import type { NextConfig } from "next";

// Vercel kendi Next dağıtımını kullanır; standalone Docker imajı içindir.
const isVercel = Boolean(process.env.VERCEL);

const backendUrl = process.env.BACKEND_URL?.trim().replace(/\/$/, "") ?? "";

const nextConfig: NextConfig = {
  ...(!isVercel && { output: "standalone" as const }),
  // BACKEND_URL (örn. Render) varsa tarayıcıya gömülmez; istekler /api-upstream üzerinden proxy’lenir.
  env: {
    NEXT_PUBLIC_API_PROXY: backendUrl ? "1" : "0",
  },
  async rewrites() {
    if (!backendUrl) return [];
    return [
      {
        source: "/api-upstream/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  // ESLint `npm run build` içinde ayrı çalışır; Next’in dahili lint adımı flat config’i tam algılamıyor.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
