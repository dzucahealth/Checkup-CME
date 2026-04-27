import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Checkup-CME - Diagnóstico e Avaliação para CME",
  description: "Plataforma avançada de diagnóstico e avaliação para Centrais de Material e Esterilização (CME).",
  keywords: ["Checkup-CME", "CME", "Diagnóstico", "Avaliação", "Gestão Hospitalar", "Saúde", "Conformidade"],
  authors: [{ name: "Advansoftware" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Checkup-CME",
    description: "Plataforma avançada de diagnóstico e avaliação para Centrais de Material e Esterilização (CME).",
    url: "/",
    siteName: "Checkup-CME",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Checkup-CME",
    description: "Plataforma avançada de diagnóstico e avaliação para Centrais de Material e Esterilização (CME).",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
