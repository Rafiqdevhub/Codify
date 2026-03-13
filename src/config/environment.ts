export const ENV = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,

  api: {
    baseUrl: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
    debug: import.meta.env.VITE_API_DEBUG === "true",
  },

  // Feature Flags
  features: {
    enableAnalytics: import.meta.env.PROD, // Only in production
    enableDebugLogs: import.meta.env.DEV, // Only in development
  },
} as const;

export const log = {
  dev: (...args: unknown[]) => {
    if (ENV.features.enableDebugLogs) {
      console.log("🚀 [DEV]", ...args);
    }
  },
  info: (...args: unknown[]) => console.log("ℹ️ [INFO]", ...args),
  warn: (...args: unknown[]) => console.warn("⚠️ [WARN]", ...args),
  error: (...args: unknown[]) => console.error("❌ [ERROR]", ...args),
};
