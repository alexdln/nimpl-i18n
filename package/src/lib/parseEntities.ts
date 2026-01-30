import { decode } from "html-entities";

export const parseEntities = (translate: string): string => {
    return decode(translate, { scope: "strict" });
};
