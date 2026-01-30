// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs/promises");

const memo = {};

/** @type {import('@nimpl/i18n/configuration/types').Config} */
module.exports = {
    load: async (language) => {
        memo[language] ||= fs
            .readFile(`./translates/${language}.json`)
            .then((data) => JSON.parse(data))
            .then((data) => {
                delete memo[language];
                return data;
            });
        const dictionary = await memo[language];
        return dictionary;
    },
    getLanguage: async ({ params }) => params.lang || "en",
    languages: ["en", "fr", "de"],
};
