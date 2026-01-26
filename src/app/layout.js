import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import PageWrapper from "./components/PageWrapper";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: {
    default: "Divisha Makeovers | Luxury Bridal Makeup Artist",
    template: "%s | Divisha Makeovers",
  },
  description: "Divisha Makeovers offers premium bridal, engagement, and party makeup services. Expert artistry for your special day.",
  keywords: ["Bridal Makeup", "Makeup Artist", "Luxury Makeup", "Wedding Makeup", "Divisha Makeovers"],
  openGraph: {
    title: "Divisha Makeovers | Luxury Bridal Makeup Artist",
    description: "Premium bridal and party makeup services.",
    url: "https://divishamakeovers.com",
    siteName: "Divisha Makeovers",
    locale: "en_US",
    type: "website",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable}`}>
        <PageWrapper>
          {children}
        </PageWrapper>
      </body>
    </html>
  );
}
