"use client";

import { createContext } from "react";

export type ClientContextType = { language: string; translates: { [key: string]: string } } | null;

export const ClientContext = createContext<ClientContextType>(null);
