import React from "react";
import { render, screen } from "@testing-library/react";
import { ClientI18nContext } from "@nimpl/i18n/lib/ClientI18nContext";
import { ClientTranslation } from "@nimpl/i18n/ClientTranslation";

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ClientI18nContext.Provider
        value={{
            language: "en",
            translates: {
                greeting: "Hello, {{name}}!",
                "common.link": "Click <a>here</a>",
            },
        }}
    >
        {children}
    </ClientI18nContext.Provider>
);

describe("ClientTranslation", () => {
    it("renders translation with query", () => {
        render(<ClientTranslation term="greeting" query={{ name: "World" }} />, { wrapper });
        expect(screen.getByText("Hello, World!")).toBeInTheDocument();
    });

    it("renders translation with components", () => {
        render(
            <ClientTranslation
                term="common:link"
                components={{
                    a: ({ children }) => (
                        <a href="#" data-testid="link">
                            {children}
                        </a>
                    ),
                }}
            />,
            {
                wrapper,
            },
        );
        expect(screen.getByTestId("link")).toBeInTheDocument();
        expect(screen.getByText("here")).toBeInTheDocument();
    });

    it("renders term key when translation missing", () => {
        render(<ClientTranslation term="missing" />, { wrapper });
        expect(screen.getByText("missing")).toBeInTheDocument();
    });
});
