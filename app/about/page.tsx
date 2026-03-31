import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMarkdownData } from "@/lib/markdown";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über uns",
  description: "Erfahren Sie mehr über den Verein zur Förderung neuer Wohnformen in Hamm e.V., unsere Ziele, unsere Vorsitzende und unser Konzept für generationenübergreifendes Wohnen.",
  openGraph: {
    title: "Über uns — Neue Wohnformen Hamm",
    description: "Unser Verein fördert generationenübergreifendes Wohnen in Hamm seit 2013.",
  },
};

export default async function About() {
  const pageData = await getMarkdownData('pages', 'about');

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 container py-5">
         <div className="row justify-content-center">
           <div className="col-lg-8">
             <div className="card border-0 shadow-sm bg-white p-4 p-md-5">
                <h1 className="mb-4 fw-bold text-primary text-center">{pageData?.title || 'Über uns'}</h1>
                
                {pageData?.image && (
                  <div className="text-center mb-5 mt-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pageData.image} alt={pageData.vorsitzende || "Portrait"} className="img-fluid rounded-circle shadow" style={{width: '200px', height: '200px', objectFit: 'cover'}} />
                    {pageData.vorsitzende && <p className="mt-3 fs-5 fw-bold text-secondary">Vorsitzende: {pageData.vorsitzende}</p>}
                  </div>
                )}

                {pageData && <div className="mt-4 fs-5 lh-lg text-secondary" dangerouslySetInnerHTML={{ __html: pageData.contentHtml }} />}
             </div>
           </div>
         </div>
      </main>
      <Footer />
    </div>
  );
}
