import type { NextConfig } from "next";

// Vercel kendi Next dağıtımını kullanır; standalone Docker imajı içindir.
const isVercel = Boolean(process.env.VERCEL);

const backendUrl = process.env.BACKEND_URL?.trim().replace(/\/$/, "") ?? "";
// Vercel production/preview: istemci /api-upstream kullanır; hedef URL runtime’da Route Handler okur
// (build anında BACKEND_URL yoksa bile çalışır). vercel dev → VERCEL_ENV=development → doğrudan API.
const onVercelDeploy =
  process.env.VERCEL === "1" && process.env.VERCEL_ENV !== "development";

const nextConfig: NextConfig = {
  ...(!isVercel && { output: "standalone" as const }),
  env: {
    NEXT_PUBLIC_API_PROXY: backendUrl || onVercelDeploy ? "1" : "0",
  },
  // ESLint `npm run build` içinde ayrı çalışır; Next’in dahili lint adımı flat config’i tam algılamıyor.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
