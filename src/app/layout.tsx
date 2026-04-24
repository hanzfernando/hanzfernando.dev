import type { Metadata } from "next";
import { Press_Start_2P, Geist_Mono, Geist } from "next/font/google";
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
      <body className="relative min-h-screen bg-[#0d0f12] ">

        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full bg-[#c8b98b]/[0.04] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[360px] h-[360px] rounded-full bg-[#5b82c4]/[0.05] blur-3xl" />
        {children}
      </body>
    </html>
  );
}
