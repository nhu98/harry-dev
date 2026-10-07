import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/config/site";
import { Header, Footer } from "@/shared/ui";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "vietnamese"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: SITE.title, template: `%s · ${SITE.owner}` },
  description: SITE.description,
};

export const viewport: Viewport = { themeColor: "#0b0f17", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
