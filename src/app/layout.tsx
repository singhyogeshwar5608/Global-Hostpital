import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Global Integrative Clinic - Comprehensive Healthcare Solutions",
  description:
    "Consult top doctors, book appointments, order medicines, take lab tests and manage your health from one platform. Your Health, Our Priority.",
  keywords: [
    "healthcare",
    "doctors",
    "appointment",
    "telemedicine",
    "lab tests",
    "medicines",
    "clinic",
  ],
  authors: [{ name: "Global Integrative Clinic" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased bg-background text-foreground font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
