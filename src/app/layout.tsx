import type { Metadata } from "next";
import { Press_Start_2P, Geist_Mono, Geist } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import "./global.css";

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
  metadataBase: new URL("https://hanzfernando.dev"),
  title: "Hanz Fernando | Software Engineer",
  description: "Personal developer portfolio of Hanz Fernando, showcasing software engineering projects, technical skills, and professional experience.",
  keywords: ["Hanz Fernando", "Software Engineer", "Portfolio", "Next.js", "React", "TypeScript"],
  authors: [{ name: "Hanz Fernando" }],
  creator: "Hanz Fernando",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/web_logo.png",
    shortcut: "/web_logo.png",
    apple: "/web_logo.png",
  },
  openGraph: {
    type: "website",
    url: "https://hanzfernando.dev",
    title: "Hanz Fernando | Software Engineer",
    description: "Personal developer portfolio of Hanz Fernando, showcasing software engineering projects, technical skills, and professional experience.",
    siteName: "Hanz Fernando",
    images: [
      {
        url: "/web_logo.png",
        width: 512,
        height: 512,
        alt: "Hanz Fernando logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hanz Fernando | Software Engineer",
    description: "Personal developer portfolio of Hanz Fernando, showcasing software engineering projects, technical skills, and professional experience.",
    images: ["/web_logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pressStart.variable} ${geistMono.variable} ${geist.variable}`}>
      <body className="retro-textured-bg relative min-h-screen">
        <div className="retro-bg-layer" aria-hidden="true" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
