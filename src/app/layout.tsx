import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hotel Rajhans International | Bhagalpur",
  description: "Rooms, dining, and parking at Kachari Chowk, MG Road, Bhagalpur. Executive, Deluxe, and Royal Suite rooms. ISO 9001:2015 certified.",
  keywords: ["Hotel Rajhans International", "Hotel Bhagalpur", "MG Road Bhagalpur", "Rajhans Bhagalpur", "Takshshila Regency"],
  authors: [{ name: "Hotel Rajhans International" }],
  openGraph: {
    title: "Hotel Rajhans International | Bhagalpur",
    description: "Rooms, dining, and parking at Kachari Chowk, MG Road, Bhagalpur.",
    url: "https://www.hotelrajhansinternational.com",
    siteName: "Hotel Rajhans International",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-gold-50 selection:bg-gold-300 selection:text-brown-900">
        {children}
      </body>
    </html>
  );
}
