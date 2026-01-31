import { parseEntities } from "@nimpl/i18n/lib/parse-entities";

describe("parseEntities", () => {
    it("decodes HTML entities", () => {
        expect(parseEntities("&amp;")).toBe("&");
        expect(parseEntities("&lt;")).toBe("<");
        expect(parseEntities("&gt;")).toBe(">");
        expect(parseEntities("&quot;")).toBe('"');
    });

    it("decodes numeric entities", () => {
        expect(parseEntities("&#39;")).toBe("'");
        expect(parseEntities("&#x27;")).toBe("'");
    });

    it("returns plain text unchanged", () => {
        expect(parseEntities("Hello World")).toBe("Hello World");
    });

    it("decodes multiple entities in text", () => {
        expect(parseEntities("&lt;div&gt;")).toBe("<div>");
    });
});
