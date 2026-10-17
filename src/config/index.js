// Central app config — import from "@/config" instead of reading env vars directly.
// Next.js exposes only NEXT_PUBLIC_* vars to the browser (VITE_* is not read).
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://shree-samarth-backend.onrender.com/api/v1";

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
  banners: "/banners",
  enquiries: "/enquiries/submit",
};

export const REQUEST_TIMEOUT_MS = 20000;
