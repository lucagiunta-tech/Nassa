import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Increase chunk size limit — MarketingStudio is large
    chunkSizeWarningLimit: 2000,
  },
});
