import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/config/site";
import { Header, Footer, styles } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import { getAllDocs } from "@/features/docs/service";
import { AssistantBubble } from "@/features/assistant/components/AssistantBubble";

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
        <main className={cn("flex-1 w-full py-6", styles.layout.container)}>{children}</main>
        <Footer />
        <AssistantBubble docs={getAllDocs()} />
      </body>
    </html>
  );
}
