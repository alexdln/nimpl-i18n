import { formatServerTranslate } from "@nimpl/i18n/lib/formatServerTranslate";

describe("formatServerTranslate", () => {
    it("injects query and parses entities by default", () => {
        const result = formatServerTranslate({
            term: "test",
            text: "Hello, {{name}}! &amp;",
            query: { name: "World" },
        });
        expect(result).toBe("Hello, World! &");
    });

    it("parses entities correctly", () => {
        const result = formatServerTranslate({
            term: "test",
            text: "&lt;div&gt;",
        });
        expect(result).toBe("<div>");
    });

    it("skips entity parsing when parseEntities is false", () => {
        const result = formatServerTranslate({
            term: "test",
            text: "&lt;div&gt;",
            parseEntities: false,
        });
        expect(result).toBe("&lt;div&gt;");
    });

    it("respects removeUnusedQueries option", () => {
        const result = formatServerTranslate({
            term: "test",
            text: "Value: {{missing}}",
            query: {},
            removeUnusedQueries: true,
        });
        expect(result).toBe("Value: ");
        const result2 = formatServerTranslate({
            term: "test",
            text: "Value: {{missing}}",
            query: {},
            removeUnusedQueries: false,
        });
        expect(result2).toBe("Value: {{missing}}");
    });
});
