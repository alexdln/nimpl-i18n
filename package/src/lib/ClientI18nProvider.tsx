"use client";

import React, { useContext } from "react";

import { ClientI18nContext } from "./ClientI18nContext";

export type ClientI18nProviderProps = {
    translates: { [key: string]: string };
    language: string;
    children: React.ReactNode;
    cleanThread?: boolean;
};

export const ClientI18nProvider: React.FC<ClientI18nProviderProps> = ({
    translates,
    children,
    language,
    cleanThread,
}) => {
    const prevTranslates = useContext(ClientI18nContext);

    if (cleanThread) {
        Object.assign(translates, prevTranslates?.translates);
    }

    return <ClientI18nContext.Provider value={{ language, translates }}>{children}</ClientI18nContext.Provider>;
};
