import { decode } from "html-entities";

import { injectQuery, type InjectQueryArg } from "./injectQuery";

export interface FormatTranslateOptions extends Omit<InjectQueryArg, "query"> {
    parseEntities?: boolean;
    query?: InjectQueryArg["query"];
}

export const formatTranslate = ({ term, text, removeUnusedQueries, query, parseEntities }: FormatTranslateOptions) => {
    let newTranslate = text;
    if (query) {
        newTranslate = injectQuery({ term, text: newTranslate, query, removeUnusedQueries });
    }
    if (parseEntities === undefined || parseEntities === true) {
        newTranslate = decode(newTranslate, { scope: "strict" });
    }
    return newTranslate;
};
