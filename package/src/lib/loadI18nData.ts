import getConfig from "../configuration/getConfig";
import { type Translates } from "../types";
import { getPathname } from "@nimpl/getters/get-pathname";
import { getParams } from "@nimpl/getters/get-params";

const loadI18nData = async (): Promise<{ dictionary: Translates; language: string }> => {
    const config = await getConfig();
    const language = await config.getLanguage({
        get pathname() {
            return getPathname();
        },
        get params() {
            return getParams();
        },
    });

    if (!language || !config.languages.includes(language)) {
        throw new Error(
            `Can\' load data for language "${language}", valid languages are: ${config.languages.join(", ")}`,
        );
    }

    const dictionary = await config.load(language);
    return { dictionary, language };
};

export default loadI18nData;
