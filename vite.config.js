// vite.config.js
// This file configures Vite, the build tool and development server for the HomeSer frontend.
// It defines how the project is built (e.g., using React plugin, bundle visualizer)
// and how the development server behaves (e.g., port number).

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Set the default port to 3000
  },
});
