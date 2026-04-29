import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",

    alias: {
        '@app-types': './types'
    },

    runtimeConfig: {
        redcapApiToken: process.env.REDCAP_API_TOKEN,
        programStartDate: process.env.PROGRAM_START_DATE,
        public: {
            dbURL: process.env.DATABASE_URL,
            redcapApiUrl: process.env.REDCAP_API_URL,
        },
    },

    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],
    components: true,

    modules: ["@nuxt/eslint", "@nuxt/ui"],

    fonts: {
        families: [
            { name: "Roboto", weights: [400, 500] },
        ],
    },
})
