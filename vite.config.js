import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 2500,
  },
  server: {
    port: 2500,
  },
  assetsInclude : "**/*.xlsx",
});
