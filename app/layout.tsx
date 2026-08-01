import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CommandProvider } from "@/components/command/CommandProvider";
import { profile } from "@/content/profile";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
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
      className={[spaceGrotesk.variable, jetbrainsMono.variable].join(" ")}
      // El sitio se comprometió a una sola dirección (la antigua "mono").
      // El atributo se conserva porque todo el CSS vive bajo ese scope;
      // la purga de los estilos de los otros skins es tarea de la fase 4.
      data-skin="mono"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%23e8541f'/></svg>"
        />
      </head>
      <body suppressHydrationWarning>
        <CommandProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CommandProvider>
      </body>
    </html>
  );
}
