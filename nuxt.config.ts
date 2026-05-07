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
            testInternId: process.env.TEST_INTERN_ID,
            testSiteManagerId: process.env.TEST_SITE_MANAGER_ID,
            testAdminId: process.env.TEST_ADMIN_ID,
        },
    },

    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],

    // Tailwind CSS Vite Plugin
    vite: {
        plugins: [tailwindcss()],
    },

    //Required PostCSS pipeline for Tailwind, nesting, etc.
    postcss: {
        plugins: {
            autoprefixer: {},
        },
    },

    components: true,

    modules: ["@nuxt/eslint", "@nuxt/fonts"],

    fonts: {
        families: [
            { name: "Roboto", weights: [400, 500] },
        ],
    },
})
