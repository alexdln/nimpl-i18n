import React, { useContext } from "react";
import { render, screen } from "@testing-library/react";
import { ClientContext } from "@nimpl/i18n/lib/client-context";
import { ClientProvider } from "@nimpl/i18n/lib/client-provider";

const Consumer = () => {
    const context = useContext(ClientContext);
    return (
        <div>
            <span data-testid="language">{context?.language}</span>
            <span data-testid="translates">{JSON.stringify(context?.translates)}</span>
        </div>
    );
};

describe("ClientProvider", () => {
    it("provides language and translates to children", () => {
        render(
            <ClientProvider language="en" translates={{ hello: "Hello" }}>
                <Consumer />
            </ClientProvider>,
        );
        expect(screen.getByTestId("language")).toHaveTextContent("en");
        expect(screen.getByTestId("translates")).toHaveTextContent('{"hello":"Hello"}');
    });

    it("merges with parent translates when cleanThread is true", () => {
        render(
            <ClientContext.Provider value={{ language: "en", translates: { parent: "Parent" } }}>
                <ClientProvider language="en" translates={{ child: "Child" }} cleanThread>
                    <Consumer />
                </ClientProvider>
            </ClientContext.Provider>,
        );
        const translates = JSON.parse(screen.getByTestId("translates").textContent || "{}");
        expect(translates).toEqual({ child: "Child", parent: "Parent" });
    });
});
