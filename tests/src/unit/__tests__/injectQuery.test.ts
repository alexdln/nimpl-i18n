import { injectQuery } from "@nimpl/i18n/lib/injectQuery";

describe("injectQuery", () => {
    it("replaces single placeholder", () => {
        const result = injectQuery({
            term: "test",
            text: "Hello, {{name}}!",
            query: { name: "World" },
        });
        expect(result).toBe("Hello, World!");
    });

    it("replaces multiple placeholders", () => {
        const result = injectQuery({
            term: "test",
            text: "{{greeting}}, {{name}}!",
            query: { greeting: "Hi", name: "John" },
        });
        expect(result).toBe("Hi, John!");
    });

    it("handles numeric values", () => {
        const result = injectQuery({
            term: "test",
            text: "Count: {{count}}",
            query: { count: 42 },
        });
        expect(result).toBe("Count: 42");
    });

    it("keeps placeholder when query key missing", () => {
        const result = injectQuery({
            term: "test",
            text: "Hello, {{name}}!",
            query: {},
        });
        expect(result).toBe("Hello, {{name}}!");
    });

    it("removes placeholder when removeUnusedQueries is true", () => {
        const result = injectQuery({
            term: "test",
            text: "Hello, {{name}}!",
            query: {},
            removeUnusedQueries: true,
        });
        expect(result).toBe("Hello, !");
    });

    it("returns unchanged text when no placeholders", () => {
        const result = injectQuery({
            term: "test",
            text: "Plain text",
            query: { unused: "value" },
        });
        expect(result).toBe("Plain text");
    });

    it("handles placeholders with hyphens and underscores", () => {
        const result = injectQuery({
            term: "test",
            text: "{{first_name}} {{last-name}}",
            query: { first_name: "John", "last-name": "Doe" },
        });
        expect(result).toBe("John Doe");
    });
});
