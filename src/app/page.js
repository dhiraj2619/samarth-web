import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import Features from "@/components/Features";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSlider />
        <Features />
      </main>
    </>
  );
}
