"use client";

import React from "react";

import { type I18nOptions } from "./types";
import { Translation, type TranslationProps } from "./lib/translation";
import { useTranslation } from "./use-translation";

type ClientTranslationProps = {
    term: string;
    components?: TranslationProps["components"];
    query?: I18nOptions["query"];
    removeUnusedQueries?: I18nOptions["removeUnusedQueries"];
};

export const ClientTranslation: React.FC<ClientTranslationProps> = ({
    term,
    components,
    query,
    removeUnusedQueries,
}) => {
    const { t } = useTranslation();
    const text = t(term, { query, removeUnusedQueries });

    return <Translation term={term} text={text} components={components} />;
};
