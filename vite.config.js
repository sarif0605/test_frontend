import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [vue()],
    server: {
      host: "0.0.0.0", // Tambahkan ini agar bisa diakses dari perangkat lain
      port: 8100, // Pastikan menggunakan port yang sama dengan Ionic
      strictPort: true, // Gunakan port ini saja, jangan cari alternatif
      proxy: {
        "/api": {
          target: "http://localhost:8000",
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  });
};
