import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Google_Sans_Code, Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// C3 button labels.
const googleSansCode = Google_Sans_Code({
  variable: "--font-google-sans-code",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Contentful Next.js Starter",
  description: "Next.js + Contentful starter project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${googleSansCode.variable} h-full antialiased`}
    >
      <head>
        {/* Material Symbols subset — only the icons the sections use.
            display=block so the ligature names never flash as text. */}
        {/* eslint-disable-next-line @next/next/google-font-display, @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=call_made,close,pause_circle,play_circle,search&display=block"
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
