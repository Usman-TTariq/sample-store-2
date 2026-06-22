import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FAQSection from "./components/FAQSection";
import HeroSlider from "./components/home/HeroSlider";
import FeaturedDealsSection from "./components/home/FeaturedDealsSection";
import CategoryDealsSections from "./components/home/CategoryDealsSections";
import SavingsTipsSection from "./components/home/SavingsTipsSection";
import FeaturedStoresSection from "./components/home/FeaturedStoresSection";
import SeoContentSection from "./components/home/SeoContentSection";
import { getBannersWithLayout } from "@/lib/services/bannerService";

export const revalidate = 0;

export default async function Home() {
  const banners = await getBannersWithLayout();

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* 1. Hero — promotional slider + side promos */}
      <HeroSlider initialBanners={banners} />

      {/* 2. Featured deals grid */}
      <FeaturedDealsSection />

      {/* 3. Category-based deal blocks */}
      <CategoryDealsSections />

      {/* 5. Savings tips / blog */}
      <SavingsTipsSection />

      {/* 6. Featured stores logo grid */}
      <FeaturedStoresSection />

      {/* 7. FAQ accordion */}
      <FAQSection />

      {/* 8. SEO content + internal links */}
      <SeoContentSection />

      {/* 9. Footer with newsletter */}
      <Footer showNewsletter />
    </div>
  );
}
