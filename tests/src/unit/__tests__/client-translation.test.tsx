import React from "react";
import { render, screen } from "@testing-library/react";
import { ClientContext } from "@nimpl/i18n/lib/client-context";
import { ClientTranslation } from "@nimpl/i18n/client-translation";

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ClientContext.Provider
        value={{
            language: "en",
            translates: {
                greeting: "Hello, {{name}}!",
                "common.link": "Click <a>here</a>",
            },
        }}
    >
        {children}
    </ClientContext.Provider>
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
