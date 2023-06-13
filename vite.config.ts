import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src/packages/"],
    }),
  ],
  build: {
    lib: {
      entry: resolve("src", "packages/index.ts"),
      name: "ReactCoolScrollbar",
      formats: ["es", "umd"],
      fileName: (format) => `react-cool-scrollbar.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
