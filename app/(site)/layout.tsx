import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({ variable: "--font-sans", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://elsadealfonso.vercel.app"),
  title: "Elsa de Alfonso — Full Stack Software Engineer",
  description:
    "Portfolio of Elsa de Alfonso, full stack software engineer: selected web projects, platforms and websites.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Elsa de Alfonso — Full Stack Software Engineer",
    description: "Selected web projects by Elsa de Alfonso.",
    url: "/",
    siteName: "Elsa de Alfonso",
    type: "website",
  },
  robots: { index: true, follow: true },
  verification: {
    google: "LOMflQ9uJp0URV3nG3zyV-0d2vDeOMWkWb0ka4mggPU",
  },
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
