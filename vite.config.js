import legacy from "@vitejs/plugin-legacy";
import {globSync} from "glob";
import { resolve } from 'path';
import autoprefixer from "autoprefixer";
import handlebars from 'vite-plugin-handlebars';

const isProd = process.env.NODE_ENV === "production" || null;

const buildFolder = "build";
const isLegacy = false; // set True if you want to support older browsers or < ES2015

export default {
    base: './',
    root: "./src",
    build: {
        rollupOptions: {
            input: globSync(resolve(__dirname, 'src/**/*.html')),
            output: {
                entryFileNames: `${buildFolder}/js/[name].js`,
                chunkFileNames: `${buildFolder}/chunks/[name].js`,
            },
        },
        outDir: "../dist",
        emptyOutDir: true,
        clear: true,
    },
    css: {
        postcss: {
            plugins: isProd && [
                autoprefixer({ grid: "autoplace" }),
            ],
        },
    },
    plugins: [
        isLegacy &&
        legacy({
            targets: ["defaults"],
        }),
        handlebars({
            partialDirectory: resolve(__dirname, 'src/partials'),
            helpers: {
                eq: (a,b) => a === b
            }
        }),
    ],
};