import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "./components/providers/query-client-provider";
import { ToastProvider } from "./components/providers/toast-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://database-webserver.vercel.app/";

export const metadata: Metadata = {
  title: "Bixy",
  description: "Bixy Blog Application",
  metadataBase: new URL(siteUrl), 
  icons: { icon: "/logo-bixy.png" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Bixy",
    description: "Bixy Blog Application",
    images: [
      {
        url: "/og-bixy.png",
        width: 1200,
        height: 630,
        alt: "Bixy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bixy",
    description: "Bixy Blog Application",
    images: ["/og-bixy.png"],
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`p-8 ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
