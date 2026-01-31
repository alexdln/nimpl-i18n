export type Translates = { [key: string]: Translates | string };

export type GetLangOpts = { pathname: string | null; params: { [key: string]: string | string[] } };

export type Query = { [key: string]: string | number };

export type I18nOptions = { query?: Query; removeUnusedQueries?: boolean };

export type I18nContextType = { lang: string; translates: { [key: string]: string } } | null;

export type Meta = { lastUpdated: number; isRevalidated?: boolean } & Record<string, unknown>;

export type Config = {
    load(key: string, meta?: Meta): Promise<Translates>;
    getLanguage(): Promise<string>;
    languages: string[];
    cache?: boolean;
};
