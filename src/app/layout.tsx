import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import { NextTopLoader } from "@/components/NextTopLoader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "回顾笔记 - 每日回顾与成长记录",
  description: "记录每日学习、成就和帮助他人的工具，促进自我成长和反思",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <Providers>
          <NextTopLoader />
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 w-full flex items-center justify-center">
              {children}
            </main>
            <footer className="border-t py-6 md:py-0">
              <div className="container max-w-screen-xl mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  回顾笔记 &copy; {new Date().getFullYear()} Peter Chen
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
