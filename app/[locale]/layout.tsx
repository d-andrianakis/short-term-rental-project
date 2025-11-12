import { NuqsAdapter } from 'nuqs/adapters/next/app'

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "../globals.css";
import "../../css/homepage.css";

import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

import { ThemeProvider } from "@/components/theme-provider"

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

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {

  const { locale } = await params;

  return (
    <html lang={ locale } suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
            <NextIntlClientProvider>
              <Header/>
                <div className="container mx-auto max-[1690px]:px-5 min-h-screen">
                  <Breadcrumbs />
                  {children}
                </div>
              <Footer/>
              <Toaster />
            </NextIntlClientProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
