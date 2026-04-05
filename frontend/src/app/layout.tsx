import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { LangProvider } from "@/contexts/LangContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { getThemeBootstrapInlineScript } from "@/lib/themeBootstrapScript";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-app",
  display: "swap",
});

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
    <html
      lang="tr"
      className={sans.variable}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body>
        <Script
          id="bc-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: getThemeBootstrapInlineScript(),
          }}
        />
        <LangProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LangProvider>
      </body>
    </html>
  );
}
