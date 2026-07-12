import type { Metadata } from "next";
import {
  Instrument_Serif,
  Inter,
  JetBrains_Mono,
  Sora,
  Space_Grotesk,
} from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VisualPill } from "@/components/layout/VisualPill";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { ChatFab } from "@/components/chat/ChatFab";
import { profile } from "@/content/profile";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: profile.meta.title,
  description: profile.meta.description,
  metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
};

const themeBootScript = `
(function(){
  try {
    var root = document.documentElement;
    var storedTheme = localStorage.getItem('theme');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', storedTheme || (systemDark ? 'dark' : 'light'));

    var storedSkin = localStorage.getItem('visual-skin');
    var skin = (storedSkin === 'agency' || storedSkin === 'terminal' || storedSkin === 'editorial' || storedSkin === 'signal')
      ? storedSkin
      : 'editorial';
    root.setAttribute('data-skin', skin);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={[
        spaceGrotesk.variable,
        instrumentSerif.variable,
        sora.variable,
        inter.variable,
        jetbrainsMono.variable,
      ].join(" ")}
      data-skin="editorial"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%23e8541f'/></svg>"
        />
      </head>
      <body>
        <ChatProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <VisualPill />
          <ChatFab />
        </ChatProvider>
      </body>
    </html>
  );
}
