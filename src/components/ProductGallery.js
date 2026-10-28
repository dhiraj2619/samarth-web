"use client";

import { useState } from "react";
import Image from "next/image";
import cloudinaryLoader from "@/lib/imageLoader";

export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState({});
  const current = images[active];

  return <div>
    <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#f1e6d6] bg-white">
      {current && !failed[active]
        ? <Image loader={cloudinaryLoader} priority src={current.url} alt={images.length > 1 ? `${name} – image ${active + 1} of ${images.length}` : name} fill sizes="(max-width: 1024px) 100vw, 50vw" onError={() => setFailed(value => ({ ...value, [active]: true }))} className="object-contain p-4 sm:p-8" />
        : <div className="flex h-full items-center justify-center bg-[#f1eee5] text-brand-700">Samarth Enterprises</div>}
    </div>
    {images.length > 1 && <ul className="mt-4 flex gap-3 overflow-x-auto pb-1" aria-label="Product images">
      {images.map((image, index) => <li key={image.url} className="shrink-0">
        <button type="button" onClick={() => setActive(index)} aria-label={`Show image ${index + 1}`} aria-pressed={index === active} className={`relative block h-20 w-20 overflow-hidden rounded-xl border-2 bg-white transition-colors sm:h-24 sm:w-24 ${index === active ? "border-brand-500" : "border-[#f1e6d6] hover:border-brand-100"}`}>
          {!failed[index] && <Image loader={cloudinaryLoader} src={image.url} alt="" fill sizes="96px" onError={() => setFailed(value => ({ ...value, [index]: true }))} className="object-contain p-1.5" />}
        </button>
      </li>)}
    </ul>}
  </div>;
}
