import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === "development";

  return {
    server: {
      host: "0.0.0.0",
      port: 3000,
      ...(isDevelopment && {
        headers: {
          // Allow localhost connections in development
          "Content-Security-Policy":
            "connect-src 'self' http://localhost:8000 https://api.codereviewagent.com wss: https:",
        },
        // Proxy API requests to backend in development
        proxy: {
          "/api": {
            target: "http://localhost:8000",
            changeOrigin: true,
            secure: false,
          },
        },
      }),
    },
    plugins: [react(), isDevelopment && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            query: ["@tanstack/react-query"],
            ui: [
              "lucide-react",
              "class-variance-authority",
              "clsx",
              "tailwind-merge",
            ],
          },
        },
      },
    },
  };
});
