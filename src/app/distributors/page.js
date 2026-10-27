import Navbar from "@/components/Navbar";
import Distributors from "@/components/Distributors";

export const metadata = {
  title: "Our Distributors | Samarth Enterprises",
  description: "Find a Samarth Enterprises distributor near you and contact them directly.",
  alternates: { canonical: "/distributors" },
};

export default function DistributorsPage() {
  return <><Navbar activeLink="Our Distributors" /><main className="flex-1 bg-[#f8f7f2]"><Distributors /></main></>;
}
