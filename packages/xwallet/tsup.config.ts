import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
    entry: {
        index: "src/index.ts",
        fonts: "src/fonts.ts",
    },
    banner: {
        js: "'use client'",
    },
    minify: true,
    injectStyle: true,

    format: ["cjs", "esm"],
    dts: true,
    clean: true,

    external: ["react", "react-dom"],
    ...options,
}));

