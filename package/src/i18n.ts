/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Configuration } from "webpack";
import { existsSync } from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "nimpl-i18n.js");
export const i18n = () => {
    return (nextConfig: any = {}) => {
        return {
            ...nextConfig,
            webpack: (config: Configuration, options: any) => {
                if (!existsSync(CONFIG_PATH)) throw new Error("Please create and configure nimpl-i18n.js");
                config.resolve ||= {};
                config.resolve.alias = {
                    ...config.resolve.alias,
                    "@nimpl/i18n/clientConfig": CONFIG_PATH,
                };

                if (typeof nextConfig.webpack === "function") {
                    return nextConfig.webpack(config, options);
                }

                return config;
            },
        };
    };
};
