import React from "react";

import { type Config, type Translates } from "./types";
import { getTranslationCore, type GetTranslationCoreOptions } from "./lib/get-translation-core";
import { TranslationCore, type TranslationCoreProps } from "./lib/translation-core";
import { TransmitterCore, type TransmitterCoreProps } from "./lib/transmitter-core";

export const initialize = (config: Config) => {
    const cache = new Map<string, Translates | Promise<Translates>>();

    const loadTranslates = async (language: string, revalidate?: boolean) => {
        const item = cache.get(language);

        if (!revalidate && item) return item;

        if (item && "then" in item) {
            return item;
        }

        const newData = await config.load(language);
        cache.set(language, newData);
        return newData;
    };

    const getTranslation = async (
        options?: Omit<GetTranslationCoreOptions, "dictionary" | "language"> & { language?: string },
    ) => {
        const { language, ...rest } = options || {};
        const targetLanguage = language || (await config.getLanguage());
        let dictionary: Translates;
        if (config.cache) {
            dictionary = await loadTranslates(targetLanguage);
        } else {
            dictionary = await revalidate(targetLanguage);
        }

        if (!targetLanguage) {
            throw new Error(
                "Unable to get the language in getTranslation. Please check the getLanguage method in the configuration file or pass the language as an argument.",
            );
        }

        return getTranslationCore({ ...rest, language: targetLanguage, dictionary });
    };

    const ServerTranslation = async (
        props: Omit<TranslationCoreProps, "dictionary" | "language"> & { language?: string },
    ) => {
        const { language, ...rest } = props || {};
        const targetLanguage = language || (await config.getLanguage());
        let dictionary: Translates;
        if (config.cache) {
            dictionary = await loadTranslates(targetLanguage);
        } else {
            dictionary = await revalidate(targetLanguage);
        }

        if (!targetLanguage) {
            throw new Error(
                "Unable to get the language in ServerTranslation. Please check the getLanguage method in the configuration file or pass the language as an argument.",
            );
        }

        return <TranslationCore {...rest} language={targetLanguage} dictionary={dictionary} />;
    };

    const Transmitter = async (
        options: Omit<TransmitterCoreProps, "dictionary" | "language"> & { language?: string },
    ) => {
        const { language, ...rest } = options || {};
        const targetLanguage = language || (await config.getLanguage());
        let dictionary: Translates;
        if (config.cache) {
            dictionary = await loadTranslates(targetLanguage);
        } else {
            dictionary = await revalidate(targetLanguage);
        }

        if (!targetLanguage) {
            throw new Error(
                "Unable to get the language in Transmitter. Please check the getLanguage method in the configuration file or pass the language as an argument.",
            );
        }

        return <TransmitterCore {...rest} language={targetLanguage} dictionary={dictionary} />;
    };

    const revalidate = async (language: string, background: boolean = false) => {
        const item = cache.get(language);
        if (item && "then" in item) return item;

        if (background) {
            const newData = await loadTranslates(language, true);
            return newData;
        }

        const newDataPromise = loadTranslates(language, true);
        cache.set(language, newDataPromise);
        return newDataPromise;
    };

    return {
        Transmitter,
        ServerTranslation,
        getTranslation,
        revalidate,
    };
};
