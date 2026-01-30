import op from "object-path";

import { type I18nOptions } from "./types";
import { formatServerTranslate } from "./lib/formatServerTranslate";
import { loadI18nData } from "./lib/loadI18nData";

type GetTranslationReturnType = { t: (term: string, opts?: I18nOptions) => string; language: string };

export const getTranslation = async (options?: {
    language?: string;
    namespace?: string;
}): Promise<GetTranslationReturnType> => {
    const { language: argLanguage, namespace } = options || {};
    const { dictionary, language: configLanguage } = await loadI18nData();
    const language = argLanguage || configLanguage;

    if (!language) {
        throw new Error(
            "Unable to get the language in the createTranslation function. Please check the getLanguage method in the configuration file or pass the language as an argument.",
        );
    }

    const namespaceDictionary = namespace ? op.get(dictionary, namespace) : dictionary;

    const t: GetTranslationReturnType["t"] = (term, opts) => {
        let termDictionary = namespaceDictionary;
        let termNamespace = namespace;
        let termKey: string = term;

        if (term.includes(":")) {
            [termNamespace, termKey] = term.split(":");
            termDictionary = op.get(dictionary, termNamespace);
        }

        const translation = op.get(termDictionary, termKey);
        const fullTerm = `${termNamespace ? `${termNamespace}.` : ""}${termKey}`;

        if (typeof translation !== "string" || !translation) return fullTerm;

        return formatServerTranslate({ term: fullTerm, text: translation, parseEntities: true, ...opts });
    };

    return { t, language };
};
