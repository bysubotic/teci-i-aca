import type { Metadata, Viewport } from "next";
import { Nunito, Baloo_2 } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Soft, rounded, cuddly type — Baloo 2 (chunky cute headings) + Nunito (rounded body).
const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const baloo = Baloo_2({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const description = "Porodični kutak: glasanje za ime, tipovanje i želje za bebu.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Čeka se devojčica 🎀",
  description,
  applicationName: "Čeka se devojčica",
  appleWebApp: { title: "Devojčica 🎀", capable: true, statusBarStyle: "default" },
  openGraph: {
    title: "Čeka se devojčica 🎀",
    description: "Pridruži nam se: glasaj za ime, tipuj i ostavi želju za bebu Teodore i Aleksandra.",
    locale: "sr_RS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Čeka se devojčica 🎀",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#FDF7F2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sr-Latn"
      className={`${nunito.variable} ${baloo.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
