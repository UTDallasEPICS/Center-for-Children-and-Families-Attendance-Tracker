import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  runtimeConfig: {
    public: {
      dbURL: process.env.DATABASE_URL
    }
  },

  devtools: { enabled: true },
  modules: ['shadcn-nuxt'],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"),
      },
    },
  },
  nitro: {
    externals: {
      inline: ['uuid'],
      trace: false,
    },
  },
});
