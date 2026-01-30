"use client";

import { createContext } from "react";

export type ClientI18nContextType = { language: string; translates: { [key: string]: string } } | null;

export const ClientI18nContext = createContext<ClientI18nContextType>(null);
