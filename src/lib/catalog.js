import { cacheLife } from "next/cache";
import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/config";
import { recordSlug } from "@/lib/slug";

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

// Every record from a paginated list endpoint. The API caps each page at 100 records.
async function getAll(path) {
  const records = [];
  for (let page = 1; ; page += 1) {
    const data = await api.get(path, { params: { page, limit: 100 } });
    const items = Array.isArray(data) ? data : data?.items;
    if (!Array.isArray(items)) throw new Error("Unable to read records.");
    records.push(...items);
    if (items.length < 100) break;
  }
  return records;
}

// Used by sitemap.xml and to look up records by slug, so a new record is reachable
// within a few minutes.
export async function getAllCategories() {
  "use cache";
  cacheLife("minutes");
  return getAll(ENDPOINTS.categories);
}

export async function getAllProducts() {
  "use cache";
  cacheLife("minutes");
  return getAll(ENDPOINTS.products);
}

// Page lookups by URL segment. The segment is normally a slug made from the name; an old
// id-based link (/products/<id>) still resolves so the page can redirect it to the slug.
const OBJECT_ID = /^[a-f\d]{24}$/i;

export async function findCategory(segment) {
  if (OBJECT_ID.test(segment)) return getCategory(segment);
  const match = (await getAllCategories()).find(category => recordSlug(category) === segment);
  return match ? getCategory(match._id) : null;
}

export async function findProduct(segment) {
  if (OBJECT_ID.test(segment)) return getProduct(segment);
  const match = (await getAllProducts()).find(product => recordSlug(product) === segment);
  return match ? getProduct(match._id) : null;
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
