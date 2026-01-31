import op from "object-path";

import { type Translates, type I18nOptions } from "../types";
import { formatTranslate } from "./format-translate";

export type GetTranslationCoreOptions = {
    language: string;
    namespace?: string;
    dictionary: Translates;
};
export type GetTranslationCoreReturnType = { t: (term: string, opts?: I18nOptions) => string; language: string };

export const getTranslationCore = (options: GetTranslationCoreOptions): GetTranslationCoreReturnType => {
    const { language, namespace, dictionary } = options || {};

    const namespaceDictionary = namespace ? op.get(dictionary, namespace) : dictionary;

    const t: GetTranslationCoreReturnType["t"] = (term, opts) => {
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

        return formatTranslate({ term: fullTerm, text: translation, parseEntities: true, ...opts });
    };

    return { t, language };
};
