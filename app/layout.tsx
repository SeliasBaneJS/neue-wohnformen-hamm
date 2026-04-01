import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { SITE_LEGAL_NAME, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_LEGAL_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Generationenübergreifendes, gemeinschaftliches und barrierefreies Wohnen in Hamm. Erfahren Sie mehr über unsere Mehrgenerationenhäuser VICANUS I und II.",
  keywords: [
    "Mehrgenerationenwohnen", "Hamm", "generationenübergreifend", "barrierefreies Wohnen",
    "Wohnprojekt Hamm", "VICANUS", "neue Wohnformen", "Gemeinschaftliches Wohnen",
    "Senioren Wohnen Hamm", "Mehrgenerationenhaus", "Wohngemeinschaft", "Verein Hamm",
  ],
  authors: [{ name: SITE_LEGAL_NAME }],
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_LEGAL_NAME,
    description: "Generationenübergreifendes, gemeinschaftliches und barrierefreies Wohnen in Hamm — VICANUS I & II.",
    images: [{ url: "/images/uploads/VICANUS+I+2.webp", width: 1200, height: 630, alt: "Mehrgenerationenhaus VICANUS I in Hamm" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_LEGAL_NAME,
              url: SITE_URL,
              description: "Generationenübergreifendes, gemeinschaftliches und barrierefreies Wohnen in Hamm.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Kentroper Weg 60 a",
                addressLocality: "Hamm",
                postalCode: "59063",
                addressCountry: "DE",
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "etummers@web.de",
                contactType: "customer service",
              },
            }),
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
