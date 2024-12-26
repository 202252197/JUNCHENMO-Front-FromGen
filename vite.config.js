import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { svgBuilder } from "./src/plugins/svgBuilder";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgBuilder("./src/assets/icons/svg/")],
  server: {
    host: "0.0.0.0",
    port: 5177,
    open: true,
    fs: {
      strict: false,
      allow: [],
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
 