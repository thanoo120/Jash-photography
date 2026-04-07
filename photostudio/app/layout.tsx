import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Lumière Studio — Photography & Equipment Rental",
    template: "%s | Lumière Studio",
  },
  description:
    "Premium photography services, equipment rental, and fine art prints. Book a session, rent professional gear, or order museum-quality prints.",
  keywords: ["photography studio", "photo shoot", "equipment rental", "wedding photography", "portrait"],
  openGraph: {
    title: "Lumière Studio",
    description: "Premium photography services & equipment rental",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="//localhost:8090" />
      </head>
      <body className="font-body antialiased bg-white dark:bg-obsidian-950 text-obsidian-900 dark:text-obsidian-100 transition-colors duration-300">
        <ErrorBoundary>
          <ThemeProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
