import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        clientPort: 443,
        protocol: 'wss'
      }
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Expose these env variables to your frontend app
      'import.meta.env.VITE_TRANSLATION_API_KEY': JSON.stringify(env.VITE_TRANSLATION_API_KEY || ""),
      'import.meta.env.WS_TOKEN': JSON.stringify(env.WS_TOKEN || ""),
    },
  };
});
