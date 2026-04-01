import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMarkdownData } from "@/lib/markdown";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type ImpressumPageData = {
  title: string;
};

export const metadata: Metadata = {
  title: "Impressum & Datenschutz",
  description: "Impressum und Datenschutzerklärung des Vereins zur Förderung neuer Wohnformen in Hamm e.V.",
  robots: { index: true, follow: false },
};

export default async function Impressum() {
  const pageData = await getMarkdownData<ImpressumPageData>('pages', 'impressum');

  if (!pageData) {
    notFound();
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 container py-5">
         <h1 className="mb-4">{pageData.title}</h1>
         <div className="mt-4" dangerouslySetInnerHTML={{ __html: pageData.contentHtml }} />
      </main>
      <Footer />
    </div>
  );
}
