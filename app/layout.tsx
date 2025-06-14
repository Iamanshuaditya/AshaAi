import { Inter } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "EatSmart Chatbot",
  description: "AI-powered assistant to help you make healthier food choices by scanning packaged foods and providing dietary alerts.",
  keywords: ["nutrition", "food scanner", "diet alerts", "healthy eating", "AI assistant"],
  authors: [{ name: "EatSmart" }],
  creator: "EatSmart",
  publisher: "EatSmart",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
  icons: {
    icon: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745642357/logo-01_upxvqe_pbxj3h.webp",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://eatsmart.app",
    title: "EatSmart Chatbot",
    description: "AI-powered assistant for healthier food choices",
    siteName: "EatSmart",
  },
  twitter: {
    card: "summary_large_image",
    title: "EatSmart Chatbot",
    description: "AI-powered assistant for healthier food choices",
    creator: "@eatsmart",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
