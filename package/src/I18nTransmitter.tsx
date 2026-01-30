import React from "react";
import op from "object-path";
import { type I18nOptions, type Translates } from "./types";
import ClientI18nProvider from "./lib/ClientI18nProvider";
import formatServerTranslate from "./lib/formatServerTranslate";
import loadI18nData from "./lib/loadI18nData";

export type I18nTransmitterProps = {
    terms: (string | [string, I18nOptions])[];
    children: React.ReactNode;
    cleanThread?: boolean;
    language?: string;
};

type ClientTranslates = { [key: string]: string };

const formatServerTranslates = (
    result: ClientTranslates,
    targetKey: string,
    translates: string | Translates,
    opts: I18nOptions = {},
) => {
    if (!translates) return;

    if (typeof translates === "string") {
        result[targetKey] = formatServerTranslate({ term: targetKey, text: translates, parseEntities: true, ...opts });
    } else {
        Object.entries(translates).forEach(([subKey, translate]) => {
            formatServerTranslates(result, `${targetKey}.${subKey}`, translate, opts);
        });
    }
};

const I18nTransmitter: React.FC<I18nTransmitterProps> = async ({
    language: argLanguage,
    terms,
    children,
    cleanThread,
}) => {
    const { dictionary, language: configLanguage } = await loadI18nData();
    const language = argLanguage || configLanguage;

    if (!language) {
        throw new Error(
            "Unable to get the language in the createTranslation function. Please check the getLanguage method in the configuration file or pass the language as an argument.",
        );
    }

    const result: { [key: string]: string } = {};
    terms.forEach((term) => {
        if (Array.isArray(term)) {
            const [termKey, opts] = term;
            const translates = op.get(dictionary, termKey) as Translates;
            formatServerTranslates(result, termKey, translates, opts);
        } else {
            const translates = op.get(dictionary, term) as Translates;
            formatServerTranslates(result, term, translates);
        }
    });

    return (
        <ClientI18nProvider language={language} translates={result} cleanThread={cleanThread}>
            {children}
        </ClientI18nProvider>
    );
};

export default I18nTransmitter;
