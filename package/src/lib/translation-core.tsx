import React from "react";

import { type Translates, type I18nOptions } from "../types";
import { Translation, type TranslationProps } from "./translation";
import { getTranslationCore } from "./get-translation-core";

export type TranslationCoreProps = {
    term: string;
    language: string;
    dictionary: Translates;
    namespace?: string;
    components?: TranslationProps["components"];
    query?: I18nOptions["query"];
    removeUnusedQueries?: I18nOptions["removeUnusedQueries"];
};

export const TranslationCore: React.FC<TranslationCoreProps> = ({
    dictionary,
    namespace,
    term,
    components,
    query,
    removeUnusedQueries,
    language,
}) => {
    const { t } = getTranslationCore({ language, namespace, dictionary });
    const text = t(term, { query, removeUnusedQueries });

    return <Translation term={term} text={text} components={components} />;
};
