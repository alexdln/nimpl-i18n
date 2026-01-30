import { decode } from "html-entities";

import { injectQuery, type InjectQueryArg } from "./injectQuery";

export interface FormatServerTranslateArg extends Omit<InjectQueryArg, "query"> {
    parseEntities?: boolean;
    query?: InjectQueryArg["query"];
}

export const formatServerTranslate = ({
    term,
    text,
    removeUnusedQueries,
    query,
    parseEntities,
}: FormatServerTranslateArg) => {
    let newTranslate = text;
    if (query) {
        newTranslate = injectQuery({ term, text: newTranslate, query, removeUnusedQueries });
    }
    if (parseEntities === undefined || parseEntities === true) {
        newTranslate = decode(newTranslate, { scope: "strict" });
    }
    return newTranslate;
};
