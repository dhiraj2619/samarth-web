import WellnessVideos from "@/components/WellnessVideos";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import TopProducts from "@/components/TopProducts";
import Categories from "@/components/Categories";
import FAQs from "@/components/FAQs";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSlider />
        <Categories />
        <TopProducts />
        <WellnessVideos />
        <FAQs />
      </main>
    </>
  );
}
