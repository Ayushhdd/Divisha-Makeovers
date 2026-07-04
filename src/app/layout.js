import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import PageWrapper from "./components/PageWrapper";

const siteUrl = "https://divishamakeovers.com";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Divisha Makeovers | Bridal Makeup Artist in Jalandhar, Punjab",
    template: "%s | Divisha Makeovers",
  },
  description:
    "Divisha Makeovers is a professional bridal makeup artist in Jalandhar, Punjab, offering bridal, engagement, reception, party makeup and nail extensions.",
  keywords: [
    "Divisha Makeovers",
    "makeup artist in Jalandhar",
    "bridal makeup artist in Jalandhar",
    "best makeup artist in Punjab",
    "bridal makeup Punjab",
    "party makeup Jalandhar",
    "engagement makeup Jalandhar",
    "nail extensions Jalandhar",
  ],
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Divisha Makeovers | Bridal Makeup Artist in Jalandhar",
    description:
      "Luxury bridal, engagement, reception and party makeup services in Jalandhar, Punjab.",
    url: siteUrl,
    siteName: "Divisha Makeovers",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo/dm2.png",
        width: 681,
        height: 239,
        alt: "Divisha Makeovers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Divisha Makeovers | Bridal Makeup Artist in Jalandhar",
    description:
      "Professional bridal makeup artist in Jalandhar, Punjab for weddings, engagements, receptions, parties and nails.",
    images: ["/logo/dm2.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "@id": `${siteUrl}/#beautysalon`,
    name: "Divisha Makeovers",
    url: siteUrl,
    logo: `${siteUrl}/logo/dm2.png`,
    image: `${siteUrl}/logo/dm2.png`,
    description:
      "Professional bridal makeup artist in Jalandhar, Punjab offering bridal makeup, engagement makeup, reception makeup, party makeup and nail extensions.",
    telephone: "+916280879548",
    email: "divishamakeovers5@gmail.com",
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jalandhar",
      addressRegion: "Punjab",
      addressCountry: "IN",
    },
    areaServed: [
      { "@type": "City", name: "Jalandhar" },
      { "@type": "State", name: "Punjab" },
    ],
    sameAs: [
      "https://www.instagram.com/divishamakeovers/?hl=en",
      "https://www.facebook.com/divishamakeovers/",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Makeup and beauty services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Bridal Makeup in Jalandhar",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Engagement and Reception Makeup",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Party Makeup",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Nail Extensions",
          },
        },
      ],
    },
  };

  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <PageWrapper>
          {children}
        </PageWrapper>
      </body>
    </html>
  );
}
