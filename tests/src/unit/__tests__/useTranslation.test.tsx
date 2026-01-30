import React from "react";
import { renderHook } from "@testing-library/react";
import { ClientI18nContext } from "@nimpl/i18n/lib/ClientI18nContext";
import { useTranslation } from "@nimpl/i18n/useTranslation";

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ClientI18nContext.Provider value={{ language: "en", translates: { "common.hello": "Hello" } }}>
        {children}
    </ClientI18nContext.Provider>
);

describe("useTranslation", () => {
    it("throws error without provider", () => {
        expect(() => renderHook(() => useTranslation())).toThrow();
    });

    it("returns language from context", () => {
        const { result } = renderHook(() => useTranslation(), { wrapper });
        expect(result.current.language).toBe("en");
    });

    it("translates term with namespace", () => {
        const { result } = renderHook(() => useTranslation({ namespace: "common" }), { wrapper });
        expect(result.current.t("hello")).toBe("Hello");
    });

    it("translates term with colon namespace syntax", () => {
        const { result } = renderHook(() => useTranslation(), { wrapper });
        expect(result.current.t("common:hello")).toBe("Hello");
    });

    it("returns key when translation missing", () => {
        const { result } = renderHook(() => useTranslation(), { wrapper });
        expect(result.current.t("missing.key")).toBe("missing.key");
    });

    it("injects query parameters", () => {
        const customWrapper = ({ children }: { children: React.ReactNode }) => (
            <ClientI18nContext.Provider value={{ language: "en", translates: { greeting: "Hello, {{name}}!" } }}>
                {children}
            </ClientI18nContext.Provider>
        );
        const { result } = renderHook(() => useTranslation(), { wrapper: customWrapper });
        expect(result.current.t("greeting", { query: { name: "World" } })).toBe("Hello, World!");
    });

    it("removes unused queries when option set", () => {
        const customWrapper = ({ children }: { children: React.ReactNode }) => (
            <ClientI18nContext.Provider value={{ language: "en", translates: { text: "Value: {{missing}}" } }}>
                {children}
            </ClientI18nContext.Provider>
        );
        const { result } = renderHook(() => useTranslation(), { wrapper: customWrapper });
        expect(result.current.t("text", { query: {}, removeUnusedQueries: true })).toBe("Value: ");
    });
});
