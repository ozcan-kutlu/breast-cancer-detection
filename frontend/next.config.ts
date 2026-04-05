import type { NextConfig } from "next";

// Vercel kendi Next dağıtımını kullanır; standalone Docker imajı içindir.
const isVercel = Boolean(process.env.VERCEL);

const nextConfig: NextConfig = {
  ...(!isVercel && { output: "standalone" as const }),
  // ESLint `npm run build` içinde ayrı çalışır; Next’in dahili lint adımı flat config’i tam algılamıyor.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
