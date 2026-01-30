import { type Query } from "../types";

export type InjectQueryArg = {
    term: string;
    text: string;
    query: Query;
    removeUnusedQueries?: boolean;
};

export const injectQuery = ({ text, query, removeUnusedQueries }: InjectQueryArg): string => {
    let result = "";
    let i = 0;

    while (i < text.length) {
        if (text[i] === "{" && text[i + 1] === "{") {
            const closeIndex = text.indexOf("}}", i + 2);
            if (closeIndex !== -1) {
                const key = text.slice(i + 2, closeIndex);
                const value = query[key];
                if (value !== undefined) {
                    result += value.toString();
                } else {
                    console.warn(`Query key "${key}" not found in options for "${text}"`);
                    if (!removeUnusedQueries) {
                        result += text.slice(i, closeIndex + 2);
                    }
                }
                i = closeIndex + 2;
                continue;
            }
        }
        result += text[i];
        i++;
    }

    return result;
};
