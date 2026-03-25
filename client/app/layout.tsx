import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "DRIP",
  description: "DRIP — Premium t-shirts, curated.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${ibmPlexMono.variable}`}>
      <body
        className="bg-studio-base text-text-primary font-sans antialiased min-h-screen relative"
        suppressHydrationWarning
      >
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-accent-gold/[0.02] rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-accent-gold/[0.015] rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10">
          <Providers>
            <Navbar />
            <main className="pt-16">{children}</main>
          </Providers>
        </div>
      </body>
    </html>
  );
}
