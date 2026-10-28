import { SITE_URL } from "@/config";
import { getAllCategories, getAllProducts } from "@/lib/catalog";
import { categoryPath, productPath } from "@/lib/slug";

// Served at /sitemap.xml. Categories and products come from the backend, so new ones
// appear here automatically once the cache refreshes.
const lastModified = (record) => (record.updatedAt ? new Date(record.updatedAt) : undefined);

export default async function sitemap() {
  const pages = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/bulk-purchase`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/distributors`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
  ];

  // A backend failure still leaves the static pages in the sitemap.
  const [categories, products] = await Promise.all([
    getAllCategories().catch(() => []),
    getAllProducts().catch(() => []),
  ]);

  return [
    ...pages,
    ...categories.filter(category => category?._id).map(category => ({
      url: `${SITE_URL}${categoryPath(category)}`,
      lastModified: lastModified(category),
      changeFrequency: "weekly",
      priority: 0.8,
    })),
    ...products.filter(product => product?._id && !product.seo?.metaRobots?.includes("noindex")).map(product => ({
      url: `${SITE_URL}${productPath(product)}`,
      lastModified: lastModified(product),
      changeFrequency: "weekly",
      priority: 0.9,
      images: product.images?.[0]?.url ? [product.images[0].url] : undefined,
    })),
  ];
}
