/* eslint-disable @typescript-eslint/no-require-imports */
const commonjs = require("@rollup/plugin-commonjs");
const typescript = require("@rollup/plugin-typescript");
const terser = require("@rollup/plugin-terser");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const { default: preserveDirectives } = require("rollup-preserve-directives");

const isProduction = process.env.NODE_ENV === "production";

const createConfig = (format, outputDir, tsconfig) => ({
    input: ["src/initialize.tsx", "src/client-translation.tsx", "src/use-translation.ts"],
    output: {
        dir: outputDir,
        format,
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: `[name].${format === "esm" ? "mjs" : "js"}`,
    },
    external: ["react", "html-entities", "object-path"],
    plugins: [
        nodeResolve(),
        commonjs(),
        typescript({
            tsconfig: tsconfig,
            declaration: true,
            declarationDir: outputDir,
        }),
        isProduction && terser(),
        preserveDirectives(),
    ].filter(Boolean),
});

module.exports = [
    createConfig("esm", "dist/esm", "./tsconfig.esm.json"),
    createConfig("cjs", "dist/cjs", "./tsconfig.cjs.json"),
];
