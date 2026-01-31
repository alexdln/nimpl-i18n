import { initialize } from "@nimpl/i18n";
import { getAppPathname } from "@nimpl/getters/get-app-pathname";
import { readFile } from "node:fs/promises";

export const { getTranslation, Transmitter, ServerTranslation } = initialize({
    load: async (language) => {
        const content = await readFile(`./translates/${language}.json`, "utf-8");
        return JSON.parse(content);
    },
    getLanguage: async () => {
        const pathname = await getAppPathname();
        const lang =
            ["en", "fr", "de"]
                .find((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)
                ?.substring(0, 2) || "en";

        return lang;
    },
    languages: ["en", "fr", "de"],
    cache: true,
});
