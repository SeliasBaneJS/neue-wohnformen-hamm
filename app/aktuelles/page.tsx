import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageCarousel from "@/components/ImageCarousel";
import { getAllMarkdownFiles, getMarkdownData, type MarkdownDocument } from "@/lib/markdown";
import type { Metadata } from "next";

type NewsItemData = {
  title: string;
  date: string;
  image?: string;
  gallery?: string[];
};

export const metadata: Metadata = {
  title: "Aktuelles & Neuigkeiten",
  description: "Aktuelle Nachrichten und Veranstaltungen des Vereins zur Förderung neuer Wohnformen in Hamm: Ausflüge, Gemeinschaftsprojekte, Kunstaktionen und mehr.",
  openGraph: {
    title: "Aktuelles — Neue Wohnformen Hamm",
    description: "Neuigkeiten aus unseren Mehrgenerationenhäusern VICANUS I und II in Hamm.",
  },
};

export default async function Aktuelles() {
  const files = getAllMarkdownFiles('news');
  const newsItems = (await Promise.all(
    files.map((file) => getMarkdownData<NewsItemData>('news', file.filename))
  )).filter((news): news is MarkdownDocument<NewsItemData> => news !== null);

  // Sort by date descending
  newsItems.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 container py-5">
         <h1 className="mb-5 text-center fw-bold text-primary">Aktuelles & Neuigkeiten</h1>
         <div className="row g-5 justify-content-center">
           {newsItems.map((news, idx) => {
             const images = news.gallery ?? (news.image ? [news.image] : []);
             
             return (
               <div className="col-lg-8" key={idx}>
                 <div className="card shadow-sm border-0 h-100 bg-white">
                   <div className="card-body p-4 p-md-5">
                     <h2 className="card-title h3 fw-bold text-dark">{news.title}</h2>
                     <h6 className="card-subtitle mb-4 text-muted fw-medium">{news.date}</h6>
                     
                     {images.length > 0 && (
                       <ImageCarousel images={images} id={`carousel-${idx}`} />
                     )}
                     
                     <div className="card-text fs-5 lh-lg text-secondary" dangerouslySetInnerHTML={{ __html: news.contentHtml }} />
                   </div>
                 </div>
               </div>
             );
           })}
         </div>
      </main>
      <Footer />
    </div>
  );
}
