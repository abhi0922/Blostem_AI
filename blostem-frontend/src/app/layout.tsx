import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blostem AI Engine",
  description: "AI-powered B2B marketing engine for lead intelligence and outreach automation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-[280px] p-8 min-h-screen">
            <div className="max-w-[1400px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}