import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Changed from 3000 to standard Vite port
    host: "0.0.0.0",
  },
  css: {
    postcss: "./postcss.config.js", // Added explicit PostCSS config path
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
})
