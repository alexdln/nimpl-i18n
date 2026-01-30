import React, { useContext } from "react";
import { render, screen } from "@testing-library/react";
import { ClientI18nContext } from "@nimpl/i18n/lib/ClientI18nContext";
import { ClientI18nProvider } from "@nimpl/i18n/lib/ClientI18nProvider";

const Consumer = () => {
    const context = useContext(ClientI18nContext);
    return (
        <div>
            <span data-testid="language">{context?.language}</span>
            <span data-testid="translates">{JSON.stringify(context?.translates)}</span>
        </div>
    );
};

describe("ClientI18nProvider", () => {
    it("provides language and translates to children", () => {
        render(
            <ClientI18nProvider language="en" translates={{ hello: "Hello" }}>
                <Consumer />
            </ClientI18nProvider>,
        );
        expect(screen.getByTestId("language")).toHaveTextContent("en");
        expect(screen.getByTestId("translates")).toHaveTextContent('{"hello":"Hello"}');
    });

    it("merges with parent translates when cleanThread is true", () => {
        render(
            <ClientI18nContext.Provider value={{ language: "en", translates: { parent: "Parent" } }}>
                <ClientI18nProvider language="en" translates={{ child: "Child" }} cleanThread>
                    <Consumer />
                </ClientI18nProvider>
            </ClientI18nContext.Provider>,
        );
        const translates = JSON.parse(screen.getByTestId("translates").textContent || "{}");
        expect(translates).toEqual({ child: "Child", parent: "Parent" });
    });
});
