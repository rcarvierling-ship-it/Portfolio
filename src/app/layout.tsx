import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CommandPalette } from "@/components/ui/command-palette";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { EchoChat } from "@/components/ai/echo-chat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getSettings } from "@/lib/cms";

export async function generateMetadata() {
  const settings = await getSettings();
  const title = settings.seo?.defaultTitle || "RCV.Media | Reese Vierling";
  const description = settings.seo?.defaultDescription || "A highly interactive portfolio website showcasing a decade of visual excellence.";
  const ogImage = settings.seo?.ogImage || "/og-image.jpg";

  return {
    metadataBase: new URL("https://rcv-media.com"),
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://rcv-media.com",
      siteName: "RCV.Media",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    icons: {
      icon: '/logo.png',
      shortcut: '/logo.png',
      apple: '/logo.png',
    },
  };
}

import { Suspense } from "react";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { ToastProvider } from "@/components/ui/toast-context";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <AnalyticsProvider>
              <ToastProvider>
                <SmoothScroll>
                  <AnimatedBackground colors={settings.theme?.backgroundColors} />
                  <ScrollProgress />
                  <CommandPalette />
                  <Navbar settings={settings} />
                  <main className="min-h-screen">
                    {children}
                  </main>
                  <EchoChat />
                  <Footer />
                </SmoothScroll>
              </ToastProvider>
            </AnalyticsProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
