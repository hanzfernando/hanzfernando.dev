import type { Metadata } from "next";
import { Press_Start_2P, Geist_Mono, Geist } from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
});

const geist = Geist({
  variable: '--font-geist',
});


export const metadata: Metadata = {
  title: "hanzfernando.dev",
  description: "Pokémon Emerald-inspired developer portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pressStart.variable} ${geistMono.variable} ${geist.variable}`}>
      <body className="bg-black">
        {children}
      </body>
    </html>
  );
}
