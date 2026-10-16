import { cacheLife } from "next/cache";
import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/config";

// Server-side catalogue reads for the product and category pages, cached for a few minutes.
// They return null for a missing or invalid id so the page can show its not-found state.
const missing = (err) => err?.status === 404 || err?.status === 400;

export async function getProduct(id) {
  "use cache";
  cacheLife("minutes");
  try {
    return await api.get(ENDPOINTS.productById(id));
  } catch (err) {
    if (missing(err)) return null;
    throw err;
  }
}

export async function getCategory(id) {
  "use cache";
  cacheLife("minutes");
  try {
    return await api.get(ENDPOINTS.categoryById(id));
  } catch (err) {
    if (missing(err)) return null;
    throw err;
  }
}

export async function getCategoryProducts(categoryId) {
  "use cache";
  cacheLife("minutes");
  const products = [];
  // The API caps each page at 100 records.
  for (let page = 1; ; page += 1) {
    const items = await api.get(ENDPOINTS.productsByCategory(categoryId), { params: { page, limit: 100 } });
    if (!Array.isArray(items)) throw new Error("Unable to read products.");
    products.push(...items);
    if (items.length < 100) break;
  }
  return products;
}
