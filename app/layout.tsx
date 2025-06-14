import { Inter } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Asha AI by JobsForHer",
  description: "AI-powered virtual assistant for women's career growth, job discovery, and professional networking. Get personalized guidance on job listings, community events, mentorship programs, and career development resources.",
  keywords: ["women careers", "job search", "career growth", "mentorship", "professional networking", "AI assistant", "career guidance", "women empowerment"],
  authors: [{ name: "JobsForHer Foundation" }],
  creator: "JobsForHer Foundation",
  publisher: "JobsForHer Foundation",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
  icons: {
    icon: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745642357/logo-01_upxvqe_pbxj3h.webp",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jobsforher.com",
    title: "Asha AI by JobsForHer",
    description: "AI-powered virtual assistant for women's career growth and professional development",
    siteName: "JobsForHer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asha AI by JobsForHer",
    description: "AI-powered virtual assistant for women's career growth and professional development",
    creator: "@jobsforher",
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
