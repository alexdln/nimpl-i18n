import React from "react";
import { render, screen } from "@testing-library/react";

import { type Config } from "@nimpl/i18n/types";
import { initialize } from "@nimpl/i18n/initialize";
import { ClientContext } from "@nimpl/i18n/lib/client-context";

const resolveAsyncComponent = async (element: React.ReactElement) => {
    const Component = element.type as (props: unknown) => Promise<React.ReactElement>;
    const resolved = await Component(element.props);
    return resolved;
};

const createMockConfig = (overrides: Partial<Config> = {}): Config => ({
    load: jest.fn().mockResolvedValue({ hello: "Hello" }),
    getLanguage: jest.fn().mockResolvedValue("en"),
    languages: ["en", "ru"],
    ...overrides,
});

describe("initialize", () => {
    describe("getTranslation", () => {
        it("returns translation function with correct language", async () => {
            const config = createMockConfig({ cache: true });
            const { getTranslation } = initialize(config);

            const { t, language } = await getTranslation({ language: "en" });

            expect(language).toBe("en");
            expect(typeof t).toBe("function");
        });

        it("translates terms correctly", async () => {
            const dictionary = {
                greeting: "Hello, {{name}}!",
                nested: { deep: "Deep value" },
            };
            const config = createMockConfig({
                cache: true,
                load: jest.fn().mockResolvedValue(dictionary),
            });
            const { getTranslation } = initialize(config);

            const { t } = await getTranslation({ language: "en" });

            expect(t("greeting", { query: { name: "World" } })).toBe("Hello, World!");
            expect(t("nested.deep")).toBe("Deep value");
            expect(t("missing")).toBe("missing");
        });

        it("supports namespace option", async () => {
            const dictionary = { section: { title: "Section Title" } };
            const config = createMockConfig({
                cache: true,
                load: jest.fn().mockResolvedValue(dictionary),
            });
            const { getTranslation } = initialize(config);

            const { t } = await getTranslation({ language: "en", namespace: "section" });

            expect(t("title")).toBe("Section Title");
        });

        it("throws error when language is undefined", async () => {
            const config = createMockConfig({
                cache: true,
                getLanguage: jest.fn().mockResolvedValue(undefined),
            });
            const { getTranslation } = initialize(config);

            await expect(getTranslation({})).rejects.toThrow("Unable to get the language in getTranslation");
        });
    });

    describe("cache behavior", () => {
        it("uses cache when config.cache is true", async () => {
            const load = jest.fn().mockResolvedValue({ hello: "Hello" });
            const config = createMockConfig({ cache: true, load });
            const { getTranslation } = initialize(config);

            await getTranslation({ language: "en" });
            await getTranslation({ language: "en" });

            expect(load).toHaveBeenCalledTimes(1);
        });

        it("revalidates when config.cache is false", async () => {
            const load = jest
                .fn()
                .mockImplementation(
                    () => new Promise((resolve) => setTimeout(() => resolve({ hello: "Hello" }), 1000)),
                );
            const config = createMockConfig({ cache: false, load });
            const { getTranslation } = initialize(config);

            await getTranslation({ language: "en" });
            await getTranslation({ language: "en" });

            expect(load).toHaveBeenCalledTimes(2);
        });
    });

    describe("revalidate", () => {
        it("loads in background without replacing cache promise", async () => {
            const load = jest
                .fn()
                .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ hello: "Hello" }), 100)));
            const config = createMockConfig({ cache: true, load });
            const { revalidate } = initialize(config);

            await revalidate("en", "background");
            await revalidate("en", "background");

            expect(load).toHaveBeenCalledTimes(2);
        });
    });

    describe("ServerTranslation", () => {
        it("renders translated text", async () => {
            const dictionary = { greeting: "Hello World" };
            const config = createMockConfig({ cache: true, load: jest.fn().mockResolvedValue(dictionary) });
            const { ServerTranslation } = initialize(config);

            const element = await ServerTranslation({ language: "en", term: "greeting" });
            render(element);

            expect(screen.getByText("Hello World")).toBeInTheDocument();
        });

        it("renders with query interpolation", async () => {
            const dictionary = { message: "Welcome, {{user}}!" };
            const config = createMockConfig({ cache: true, load: jest.fn().mockResolvedValue(dictionary) });
            const { ServerTranslation } = initialize(config);

            const element = await ServerTranslation({
                language: "en",
                term: "message",
                query: { user: "Alice" },
            });
            render(element);

            expect(screen.getByText("Welcome, Alice!")).toBeInTheDocument();
        });

        it("throws error when language is undefined", async () => {
            const config = createMockConfig({
                cache: true,
                getLanguage: jest.fn().mockResolvedValue(undefined),
            });
            const { ServerTranslation } = initialize(config);

            await expect(ServerTranslation({ term: "hello" })).rejects.toThrow(
                "Unable to get the language in ServerTranslation",
            );
        });
    });

    describe("Transmitter", () => {
        const ContextConsumer = () => {
            const context = React.useContext(ClientContext);
            return (
                <div>
                    <span data-testid="lang">{context?.language}</span>
                    <span data-testid="data">{JSON.stringify(context?.translates)}</span>
                </div>
            );
        };

        it("passes language and formatted translates to children", async () => {
            const dictionary = { greeting: "Hello", nested: { key: "Nested Value" } };
            const config = createMockConfig({ cache: true, load: jest.fn().mockResolvedValue(dictionary) });
            const { Transmitter } = initialize(config);

            const element = await Transmitter({
                language: "en",
                terms: ["greeting", "nested"],
                children: <ContextConsumer />,
            });
            const resolved = await resolveAsyncComponent(element);
            render(resolved);

            expect(screen.getByTestId("lang")).toHaveTextContent("en");
            const data = JSON.parse(screen.getByTestId("data").textContent || "{}");
            expect(data).toEqual({ greeting: "Hello", "nested.key": "Nested Value" });
        });

        it("applies query interpolation to terms", async () => {
            const dictionary = { msg: "Hi, {{name}}!" };
            const config = createMockConfig({ cache: true, load: jest.fn().mockResolvedValue(dictionary) });
            const { Transmitter } = initialize(config);

            const element = await Transmitter({
                language: "en",
                terms: [["msg", { query: { name: "Bob" } }]],
                children: <ContextConsumer />,
            });
            const resolved = await resolveAsyncComponent(element);
            render(resolved);

            const data = JSON.parse(screen.getByTestId("data").textContent || "{}");
            expect(data.msg).toBe("Hi, Bob!");
        });

        it("flattens deeply nested dictionary", async () => {
            const dictionary = { a: { b: { c: "Deep" } } };
            const config = createMockConfig({ cache: true, load: jest.fn().mockResolvedValue(dictionary) });
            const { Transmitter } = initialize(config);

            const element = await Transmitter({
                language: "en",
                terms: ["a"],
                children: <ContextConsumer />,
            });
            const resolved = await resolveAsyncComponent(element);
            render(resolved);

            const data = JSON.parse(screen.getByTestId("data").textContent || "{}");
            expect(data["a.b.c"]).toBe("Deep");
        });

        it("throws error when language is undefined", async () => {
            const config = createMockConfig({
                cache: true,
                getLanguage: jest.fn().mockResolvedValue(undefined),
            });
            const { Transmitter } = initialize(config);

            await expect(Transmitter({ terms: [], children: null })).rejects.toThrow(
                "Unable to get the language in Transmitter",
            );
        });
    });
});
