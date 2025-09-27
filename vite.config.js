  import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import history from "connect-history-api-fallback";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    middlewareMode: false, // نخلي السيرفر يقبل middleware
  },
  // نضيف middleware fallback للـ index.html
  configureServer: ({ middlewares }) => {
    middlewares.use(
      history({
        index: '/index.html'
      })
    );
  },
}); 























