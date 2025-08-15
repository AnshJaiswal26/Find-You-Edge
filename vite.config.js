import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@Profiler": path.resolve(__dirname, "src/RenderLogger"),
      "@components": path.resolve(__dirname, "src/components"),
      "@layout": path.resolve(__dirname, "src/layout"),
      "@RM": path.resolve(__dirname, "src/pages/RiskManagement"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
});
