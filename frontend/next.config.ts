import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // ESLint `npm run build` içinde ayrı çalışır; Next’in dahili lint adımı flat config’i tam algılamıyor.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
