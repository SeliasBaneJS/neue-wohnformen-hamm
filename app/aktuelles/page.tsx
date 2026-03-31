import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageCarousel from "@/components/ImageCarousel";
import { getAllMarkdownFiles, getMarkdownData } from "@/lib/markdown";

export default async function Aktuelles() {
  const files = getAllMarkdownFiles('news');
  const newsItems = await Promise.all(
    files.map(async (f) => await getMarkdownData('news', f.filename))
  );

  // Sort by date descending
  newsItems.sort((a, b) => {
    if ((a?.date || '') < (b?.date || '')) return 1;
    if ((a?.date || '') > (b?.date || '')) return -1;
    return 0;
  });

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 container py-5">
         <h1 className="mb-5 text-center fw-bold text-primary">Aktuelles & Neuigkeiten</h1>
         <div className="row g-5 justify-content-center">
           {newsItems.map((news, idx) => {
             if (!news) return null;
             const images = news.gallery ? news.gallery : (news.image ? [news.image] : []);
             
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
