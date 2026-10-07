import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "vietnamese"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Harry Huynh — Frontend & Mobile", template: "%s · Harry Huynh" },
  description: "Kho kiến thức Frontend / React Native / tiếng Anh cho dev, và portfolio của Harry Huynh.",
};

export const viewport: Viewport = { themeColor: "#0b0f17", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">{children}</main>
        <footer className="border-t border-border text-sm text-muted">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap gap-x-6 gap-y-2">
            <span>© 2026 Harry Huynh</span>
            <a className="hover:text-accent" href="https://github.com/nhu98" target="_blank" rel="noreferrer">GitHub</a>
            <span>Next.js 16 · Tailwind v4 · Markdown → SSG · Vercel</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
