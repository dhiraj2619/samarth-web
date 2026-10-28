// next/image loader for images uploaded to Cloudinary. The originals are often 2MB+ PNGs,
// so each image is fetched at the width it is displayed at, in WebP/AVIF where the browser
// supports it, straight from Cloudinary's CDN. Other URLs are left unchanged.
export default function cloudinaryLoader({ src, width, quality }) {
  if (!src.includes("res.cloudinary.com") || !src.includes("/upload/")) return src;
  const params = ["f_auto", quality ? `q_${quality}` : "q_auto", `w_${width}`, "c_limit"].join(",");
  return src.replace("/upload/", `/upload/${params}/`);
}

// For an <img>/<Image unoptimized> outside a client component, where a loader cannot be passed.
export const cloudinaryUrl = (src, width) => cloudinaryLoader({ src, width });
