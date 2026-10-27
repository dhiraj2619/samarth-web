import Navbar from "@/components/Navbar";
import BulkOffers from "@/components/BulkOffers";

export const metadata = {
  title: "Bulk Purchase Offers | Samarth Enterprises",
  description: "Explore bulk purchase offers, eligible products and minimum order amounts from Samarth Enterprises.",
  alternates: { canonical: "/bulk-purchase" },
};

export default function BulkPurchasePage() {
  return <><Navbar activeLink="Bulk Purchase" /><main className="flex-1 bg-[#f8f7f2]"><BulkOffers /></main></>;
}
