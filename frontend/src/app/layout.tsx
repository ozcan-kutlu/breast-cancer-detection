import type { Metadata } from "next";
import { LangProvider } from "@/contexts/LangContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Breast cancer demo",
  description: "Wisconsin BC Random Forest demo (Next.js + FastAPI)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
