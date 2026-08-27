import type { Metadata, Viewport } from "next";
import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
import { JourneyProvider } from "@/context/JourneyContext";
import { AssistantPanelProvider } from "@/context/AssistantPanelContext";
import "./globals.css";

const bodyFont = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Cairo({
  subsets: ["arabic"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "نَقْل | تنظيم رحلة انتقالك بسهولة",
  description:
    "نَقْل تساعدك على تنظيم رحلة انتقالك، متابعة تجهيزاتك، إدارة ميزانيتك، ومقارنة خدمات الانتقال من مكان واحد.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B4332",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        <JourneyProvider>
          <AssistantPanelProvider>{children}</AssistantPanelProvider>
        </JourneyProvider>
      </body>
    </html>
  );
}
