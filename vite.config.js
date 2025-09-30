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
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production for smaller bundle size
    minify: 'esbuild', // Use esbuild for faster minification
    manifest: false, // Don't generate manifest
    rollupOptions: {
      output: {
        // Optimize for web deployment
        manualChunks: {
          // Split large libraries into separate chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['@heroicons/react'],
          'data-vendor': ['@reduxjs/toolkit', '@tanstack/react-query'],
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    globals: true,
  },
});
