import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The configuration is intentionally verbose so every block can be
// referenced inside the accompanying documentation file.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward API calls during development to the Express backend.
      "/api": "http://localhost:3000"
    }
  }
});
