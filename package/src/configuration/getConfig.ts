import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { type Config } from "./types";

const CONFIG_PATH = path.join(process.cwd(), "nimpl-i18n.js");
// Crutch bypass of conversion by the assembler to require
const dynamicImport = new Function("p", "return import(p)");

const getConfig = async (): Promise<Config> => {
    let clientConfig: Config;
    if (fs.existsSync(CONFIG_PATH)) {
        const config: { default: Config } = await dynamicImport(pathToFileURL(CONFIG_PATH).href);
        clientConfig = config.default;
    } else {
        // @ts-expect-error will be imported from the alias configuration in webpack
        const config: { default: Config } = await import("@nimpl/i18n/clientConfig");
        clientConfig = config.default;
    }

    const { load, getLanguage, languages } = clientConfig;
    if (!load) {
        throw new Error(
            `Can't find "load" method in configuration file - https://github.com/alexdln/nimpl-i18n#configuration`,
        );
    }

    if (!languages) {
        throw new Error(
            `Can't find "languages" list in configuration file - https://github.com/alexdln/nimpl-i18n#configuration`,
        );
    }

    if (!getLanguage) {
        throw new Error(
            `Can't find "getLanguage" method in configuration file - https://github.com/alexdln/nimpl-i18n#configuration`,
        );
    }

    return clientConfig;
};

export default getConfig;
