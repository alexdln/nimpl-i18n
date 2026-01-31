import React from "react";
import op from "object-path";

import { type I18nOptions, type Translates } from "../types";
import { ClientI18nProvider } from "./ClientI18nProvider";
import { formatTranslate } from "./format-translate";

export type TransmitterCoreProps = {
    dictionary: Translates;
    language: string;
    terms: (string | [string, I18nOptions])[];
    children: React.ReactNode;
    cleanThread?: boolean;
};

type ClientTranslates = { [key: string]: string };

const formatTranslates = (
    result: ClientTranslates,
    targetKey: string,
    translates: string | Translates,
    opts: I18nOptions = {},
) => {
    if (!translates) return;

    if (typeof translates === "string") {
        result[targetKey] = formatTranslate({ term: targetKey, text: translates, parseEntities: true, ...opts });
    } else {
        Object.entries(translates).forEach(([subKey, translate]) => {
            formatTranslates(result, `${targetKey}.${subKey}`, translate, opts);
        });
    }
};

export const TransmitterCore: React.FC<TransmitterCoreProps> = async ({
    dictionary,
    language,
    terms,
    children,
    cleanThread,
}) => {
    const result: { [key: string]: string } = {};
    terms.forEach((term) => {
        if (Array.isArray(term)) {
            const [termKey, opts] = term;
            const translates = op.get(dictionary, termKey) as Translates;
            formatTranslates(result, termKey, translates, opts);
        } else {
            const translates = op.get(dictionary, term) as Translates;
            formatTranslates(result, term, translates);
        }
    });

    return (
        <ClientI18nProvider language={language} translates={result} cleanThread={cleanThread}>
            {children}
        </ClientI18nProvider>
    );
};
