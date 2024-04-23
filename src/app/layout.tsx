import "./globals.css";
import "@fontsource/inter";

import { Inter } from "next/font/google";
import type { Metadata } from "next";
import NavBar from "./navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UNSPSC Search Engine",
  description: "UNSPSC Search Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav>
          <NavBar />
        </nav>
        {children}
      </body>
    </html>
  );
}
