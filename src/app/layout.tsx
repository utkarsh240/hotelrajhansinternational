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
  title: "Hotel Rajhans International | Luxury 5-Star Hotel in Bhagalpur",
  description: "Experience the pinnacle of luxury, refined comfort, and five-star hospitality at Hotel Rajhans International, Bhagalpur. Located at Kachari Chowk, MG Road. ISO 9001:2015 Certified.",
  keywords: ["Hotel Rajhans International", "Luxury Hotel Bhagalpur", "5 Star Hotel Bihar", "Rajhans Bhagalpur", "Best Hotel in Bhagalpur", "Takshshila Regency"],
  authors: [{ name: "Hotel Rajhans International" }],
  openGraph: {
    title: "Hotel Rajhans International | Luxury 5-Star Hotel in Bhagalpur",
    description: "Experience the pinnacle of luxury, refined comfort, and five-star hospitality at Hotel Rajhans International, Bhagalpur.",
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
      <body className="min-h-full flex flex-col bg-charcoal-950 text-gold-50 selection:bg-gold-300 selection:text-charcoal-950">
        {children}
      </body>
    </html>
  );
}
