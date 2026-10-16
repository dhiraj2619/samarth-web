"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  const [failed, setFailed] = useState(false);
  const src = product.images?.[0]?.url;
  return <Link href={`/products/${product._id}`} className="group flex h-full flex-col rounded-2xl border border-[#f1e6d6] bg-white p-5 transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(34,65,45,0.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 sm:p-6">
    <div className="relative aspect-square overflow-hidden rounded-xl bg-white">
      {src && !failed
        ? <Image unoptimized src={src} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" onError={() => setFailed(true)} className="object-contain transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" />
        : <div className="flex h-full items-center justify-center bg-[#f1eee5] text-sm text-brand-700">Samarth Enterprises</div>}
      {product.inStock === false && <span className="absolute left-2 top-2 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-earth-600 shadow-sm">Out of stock</span>}
    </div>
    <h3 className="mt-5 text-lg leading-snug text-[#172938] group-hover:text-brand-700 sm:text-xl">{product.name}</h3>
    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#6b7e83]">{product.description}</p>
    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-brand-700">
      View details
      <svg aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16m-6-6 6 6-6 6" /></svg>
    </span>
  </Link>;
}
