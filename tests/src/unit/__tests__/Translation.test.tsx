import React from "react";
import { render, screen } from "@testing-library/react";
import Translation from "@nimpl/i18n/lib/Translation";

describe("Translation", () => {
    it("renders plain text", () => {
        render(<>{Translation({ term: "test", text: "Hello World" })}</>);
        expect(screen.getByText("Hello World")).toBeInTheDocument();
    });

    it("renders self-closing component", () => {
        render(
            <>
                {Translation({
                    term: "test",
                    text: "Click <br />here",
                    components: { br: () => <br data-testid="br" /> },
                })}
            </>,
        );
        expect(screen.getByTestId("br")).toBeInTheDocument();
    });

    it("renders wrapping component", () => {
        render(
            <>
                {Translation({
                    term: "test",
                    text: "Hello <b>World</b>!",
                    components: {
                        b: (props) => <strong {...props} />,
                    },
                })}
            </>,
        );
        expect(screen.getByText("World")).toBeInTheDocument();
        expect(screen.getByText("World").tagName).toBe("STRONG");
    });

    it("renders nested components", () => {
        render(
            <>
                {Translation({
                    term: "test",
                    text: "<a>Click <b>here</b></a>",
                    components: {
                        a: (props) => <a href="#" data-testid="link" {...props} />,
                        b: (props) => <strong {...props} />,
                    },
                })}
            </>,
        );
        const link = screen.getByTestId("link");
        expect(link).toBeInTheDocument();
        expect(link.querySelector("strong")).toBeInTheDocument();
        expect(link.innerHTML).toBe("Click <strong>here</strong>");
    });

    it("preserves component children as fallback", () => {
        render(
            <>
                {Translation({
                    term: "test",
                    text: "Read <link />",
                    components: {
                        link: (props) => (
                            <a href="#" {...props}>
                                more
                            </a>
                        ),
                    },
                })}
            </>,
        );
        expect(screen.getByText("more")).toBeInTheDocument();
    });

    it("handles missing component gracefully", () => {
        const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
        render(<>{Translation({ term: "test", text: "Hello <missing />", components: {} })}</>);
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Unknown component"));
        consoleSpy.mockRestore();
    });
});
