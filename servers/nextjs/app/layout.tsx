import type { Metadata } from "next";
import localFont from "next/font/local";
import { Manrope, Syne, Unbounded } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Providers } from "./providers";
import MixpanelInitializer from "./MixpanelInitializer";
import { Toaster } from "@/components/ui/sonner";
import TailwindBrowserRuntime from "@/components/runtime/TailwindBrowserRuntime";
const inter = localFont({
  src: [
    {
      path: "./fonts/Inter.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  preload: false,
  variable: "--font-inter",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  preload: false,
  variable: "--font-manrope",
});

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  preload: false,
  variable: "--font-unbounded",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://presenton.ai"),
  title: "Attlas Slides - based on Presenton",
  description:
    "Gerador de apresentações com inteligência artificial baseado em Presenton, com suporte a múltiplos modelos (OpenAI, Gemini, Ollama) e exportação para PDF e PPTX.",
  keywords: [
    "AI presentation generator",
    "data storytelling",
    "data visualization tool",
    "AI data presentation",
    "presentation generator",
    "data to presentation",
    "interactive presentations",
    "professional slides",
  ],
  openGraph: {
    title: "Attlas Slides - based on Presenton",
    description:
      "Gerador de apresentações com inteligência artificial baseado em Presenton, com suporte a múltiplos modelos (OpenAI, Gemini, Ollama) e exportação para PDF e PPTX.",
    url: "https://presenton.ai",
    siteName: "Attlas Slides",
    images: [
      {
        url: "https://presenton.ai/presenton-feature-graphics.png",
        width: 1200,
        height: 630,
        alt: "Attlas Slides",
      },
    ],
    type: "website",
    locale: "pt_BR",
  },
  alternates: {
    canonical: "https://presenton.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Attlas Slides - based on Presenton",
    description:
      "Gerador de apresentações com inteligência artificial baseado em Presenton, com suporte a múltiplos modelos (OpenAI, Gemini, Ollama) e exportação para PDF e PPTX.",
    images: ["https://presenton.ai/presenton-feature-graphics.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${syne.variable} ${manrope.variable} ${unbounded.variable} antialiased`}
      >
        <Providers>
          <MixpanelInitializer>

            {children}

          </MixpanelInitializer>
        </Providers>
        <TailwindBrowserRuntime />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
