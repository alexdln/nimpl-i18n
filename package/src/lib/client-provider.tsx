"use client";

import React, { useContext } from "react";

import { ClientContext } from "./client-context";

export type ClientProviderProps = {
    translates: { [key: string]: string };
    language: string;
    children: React.ReactNode;
    cleanThread?: boolean;
};

export const ClientProvider: React.FC<ClientProviderProps> = ({ translates, children, language, cleanThread }) => {
    const prevTranslates = useContext(ClientContext);

    if (cleanThread) {
        Object.assign(translates, prevTranslates?.translates);
    }

    return <ClientContext.Provider value={{ language, translates }}>{children}</ClientContext.Provider>;
};
