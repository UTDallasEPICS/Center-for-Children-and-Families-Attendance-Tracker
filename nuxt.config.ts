import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  // Use app/ directory as source directory
  srcDir: 'app',
  css: ['../assets/css/main.css'],
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
    server: {
      watch: {
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.data/**',
          '**/Application Data/**',
          '**/AppData/**',
        ]
      }
    }
  },
  // Nitro configuration for backend API
  nitro: {
    storage: {
      // Optional: Configure storage for production
      // You can add database connections here if needed
    }
  },
});
