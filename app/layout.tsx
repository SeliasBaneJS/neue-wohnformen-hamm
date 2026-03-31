import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Verein zur Förderung neuer Wohnformen in Hamm e.V.",
  description: "Generationenübergreifendes, gemeinschaftliches und barrierefreies Wohnen in Hamm.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>
        {children}
      </body>
    </html>
  );
}
