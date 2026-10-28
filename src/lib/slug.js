// Readable URLs for products and categories, built from their names
// ("Beauty & Skincare" -> /categories/beauty-and-skincare). The backend has no slug field,
// so the pages find the record by matching this slug against every record's name.
export function slugify(name) {
  return String(name || "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// A record whose name has no usable letters falls back to its id.
export const recordSlug = (record) => slugify(record?.name) || record?._id;

export const categoryPath = (category) => `/categories/${recordSlug(category)}`;
export const productPath = (product) => `/products/${recordSlug(product)}`;
