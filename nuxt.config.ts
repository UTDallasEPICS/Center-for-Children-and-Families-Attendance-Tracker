import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  runtimeConfig: {
    public: {
      dbURL: process.env.DATABASE_URL
    }
  },

  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    redcapApiUrl: process.env.REDCAP_API_URL,
    redcapApiToken: process.env.REDCAP_API_TOKEN,
    programStartDate: process.env.PROGRAM_START_DATE,
    public: {}
  },

  // Tailwind CSS Vite Plugin
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  //Required PostCSS pipeline for Tailwind, nesting, etc.
  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },

  components: true,

  modules: [],
});
