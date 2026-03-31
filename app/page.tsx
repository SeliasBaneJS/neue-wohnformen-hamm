import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import InfoBlock from "@/components/InfoBlock";
import HousesCarousel from "@/components/HousesCarousel";
import Footer from "@/components/Footer";
import { getMarkdownData } from "@/lib/markdown";

export default async function Home() {
  const pageData = await getMarkdownData('pages', 'home');

  if (!pageData) return <div>Loading...</div>;

  const features = [
    { title: pageData.feature1_title, text: pageData.feature1_text },
    { title: pageData.feature2_title, text: pageData.feature2_text },
    { title: pageData.feature3_title, text: pageData.feature3_text },
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 bg-light">
        <HeroSection 
          title={pageData.hero_title} 
          subtitle={pageData.hero_subtitle} 
          images={pageData.hero_images || [pageData.image]} 
        />
        <InfoBlock features={features} />
        
        {pageData.houses && pageData.houses.length > 0 && (
          <HousesCarousel houses={pageData.houses} />
        )}
        
        <section className="container py-5 mb-5 mt-3">
           <div className="row justify-content-center">
             <div className="col-lg-10 p-4 p-md-5 bg-white rounded-4 shadow-sm border-0">
               <div className="fs-5 lh-lg text-secondary" dangerouslySetInnerHTML={{ __html: pageData.contentHtml }} />
             </div>
           </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
