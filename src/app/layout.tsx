import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LeadFlow - Buyer Lead Management",
  description: "Modern buyer lead management system for real estate professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans h-full antialiased bg-gradient-to-br from-slate-50 to-blue-50`}>
        <div className="min-h-full">
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
