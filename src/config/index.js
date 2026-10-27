// Central app config — import from "@/config" instead of reading env vars directly.
// Next.js exposes only NEXT_PUBLIC_* vars to the browser (VITE_* is not read).
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://shree-samarth-backend-production.up.railway.app/api/v1";

// All backend routes live here, relative to API_URL.
// TODO: confirm these against the backend — the paths below are placeholders.
export const ENDPOINTS = {
  offers: "/offers/get-all",
  ads: "/ads/get-all",
  broadcasts: "/broadcasts/get-all",
  categories: "/categories/get-all",
  products: "/products/get-all",
  productById: (id) => `/products/get-by-id/${id}`,
  productsByCategory: (categoryId) => `/products/get-by-category/${categoryId}`,
  categoryById: (id) => `/categories/get-by-id/${id}`,
  settings: "/settings/get",
  collections: "/collections",
  collectionBySlug: (slug) => `/collections/${slug}`,
  quoteSlides: "/settings/quote-slides",
  enquiries: "/enquiries/submit",
  distributors: "/distributors/get-all",
};

export const REQUEST_TIMEOUT_MS = 20000;

// Public address of this website, used for canonical URLs, sitemap.xml and robots.txt.
// TODO: set NEXT_PUBLIC_SITE_URL to the live domain (no trailing slash).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.shrisamarth.com").replace(/\/$/, "");
export const SITE_NAME = "Samarth Enterprises";
