import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/JDM/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        car: resolve(__dirname, "car.html")
      }
    }
  }
});