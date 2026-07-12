import os from "node:os";
import path from "node:path";
import type { NextConfig } from "next";

/**
 * El repo puede vivir en iCloud Drive. Saca `.next` a disco local para evitar
 * cuelgues de File Provider al escribir/leer caché. Si el proyecto ya está
 * fuera de iCloud, sigue usando `.next` en el cwd.
 *
 * No hagas `rm -rf .next` en cada `npm run dev` desde iCloud (cuelga el terminal).
 */
const homeCache = path.join(os.homedir(), ".cache", "portfolio-web-2026-next");
const onICloud =
  process.cwd().includes("/Documents/") ||
  process.cwd().includes("Mobile Documents") ||
  process.cwd().includes("CloudDocs");

const nextConfig: NextConfig = {
  distDir: onICloud ? homeCache : ".next",
  webpack: (config, { dev }) => {
    if (dev && onICloud) {
      // Evita renames de *.pack.gz pelea con iCloud
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
