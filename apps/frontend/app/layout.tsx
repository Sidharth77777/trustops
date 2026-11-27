import type { Metadata } from "next";
import { Geist, Geist_Mono, Oxanium, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { LayoutProvider } from "@/providers/LayoutProvider";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-oxanium",
})

export const sourceCode = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code",
})

export const metadata: Metadata = {
  title: "TRUSTOPS",
  description: "Building a trust and accountability layer for collaborative work",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oxanium.variable} ${sourceCode.variable}`} suppressHydrationWarning>
      <body
        className="antialiased"
      >
        
        <LayoutProvider>
          {children}
        </LayoutProvider>
          
      </body>
    </html>
  );
}
