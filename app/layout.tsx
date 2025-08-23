import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import "../css/homepage.css";

import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

import { Toaster } from "@/components/ui/sonner"

import {NextIntlClientProvider} from 'next-intl';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Short term rental project",
  description: "Short term rental project built with Next.js, Typescript, Tailwind, Better-auth, Prisma and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <Header/>
            <div className="container mx-auto">
              <Breadcrumbs />
              {children}
            </div>
          <Footer/>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
