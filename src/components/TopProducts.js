"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/config";

function Arrow() {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16m-6-6 6 6-6 6" /></svg>;
}

function ProductImage({ product, large = false }) {
  const [failed, setFailed] = useState(false);
  const src = product.images?.[0]?.url;
  return <div className={`relative overflow-hidden rounded-lg bg-[#f1eee5] ${large ? "aspect-[4/3]" : "aspect-square"}`}>
    {src && !failed ? <Image unoptimized src={src} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" onError={() => setFailed(true)} className="object-contain p-2 transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" /> : <div className="flex h-full items-center justify-center text-sm text-brand-700">Samarth Enterprises</div>}
  </div>;
}

export default function TopProducts() {
  const [result, setResult] = useState({ items: [], loading: true, error: false });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    api.get(ENDPOINTS.products, { params: { isMostBuy: true, limit: 4, page: 1 }, signal: controller.signal })
      .then(items => {
        if (!Array.isArray(items)) throw new Error("Unexpected product response");
        if (!cancelled) setResult({ items: items.slice(0, 4), loading: false, error: false });
      })
      .catch(() => { if (!cancelled) setResult({ items: [], loading: false, error: true }); });
    return () => { cancelled = true; controller.abort(); };
  }, [attempt]);

  return <section id="top-products" aria-labelledby="top-products-title" className="relative isolate overflow-hidden bg-[#f8f7f2] py-12 sm:py-16">
    <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-20 -z-10 h-52 w-64 rotate-[-25deg] rounded-[100%_0] bg-brand-700/10" />
    <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -right-12 -z-10 h-52 w-72 rotate-[-30deg] rounded-[100%_0] bg-brand-700/15" />
    <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-20 -z-10 h-40 w-56 rotate-[-35deg] bg-[#f49a33]/80" />
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="mb-4 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em] text-brand-600"><span aria-hidden="true" className="h-px w-10 bg-[#f3932b]" />Top selling products</p>
          <h2 id="top-products-title" className="text-2xl font-bold leading-tight tracking-tight text-[#102a2e] sm:text-3xl lg:text-4xl">Trusted Products.<br /><span className="text-[#ee9735]">Growing Together.</span></h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#6b7e83]">Explore our best-selling range of high-quality products, trusted by businesses for their reliability and value.</p>
        </div>
        <Link href="/#categories" className="inline-flex w-fit shrink-0 items-center gap-3 rounded-full border border-brand-600 px-5 py-2.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700">Browse all categories <Arrow /></Link>
      </div>
      {result.loading && <div role="status"><span className="sr-only">Loading top products</span><div aria-hidden="true" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map(key => <div key={key} className="animate-pulse rounded-xl bg-white p-3 motion-reduce:animate-none"><div className="aspect-square rounded-lg bg-gray-100" /><div className="m-2 mt-5 h-4 w-3/4 rounded bg-gray-100" /><div className="m-2 h-16 rounded bg-gray-50" /></div>)}</div></div>}
      {result.error && <div role="alert" className="rounded-xl border border-brand-100 bg-white p-6 text-sm"><p>We could not load the products. Please try again.</p><button onClick={() => { setResult({ items: [], loading: true, error: false }); setAttempt(value => value + 1); }} className="mt-3 font-semibold text-brand-700">Try again</button></div>}
      {!result.loading && !result.error && !result.items.length && <p className="rounded-xl border border-brand-100 bg-white p-6 text-sm text-gray-500">Our top product selection is coming soon. Explore our categories to browse the range.</p>}
      {!!result.items.length && <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{result.items.map(product => <article key={product._id} className="group flex flex-col rounded-xl border border-white bg-white/80 p-3 shadow-[0_8px_28px_-15px_rgba(34,65,45,0.2)] transition-shadow hover:shadow-lg">
        <ProductImage product={product} />
        <div className="flex flex-1 flex-col px-1 pb-2 pt-4">
          <h3 className="text-base font-semibold leading-snug text-[#193239]">{product.name}</h3>
          <p className="mb-4 mt-2 line-clamp-3 text-sm leading-relaxed text-[#6b7e83]">{product.description}</p>
          <Link href={`/products/${product._id}`} aria-label={`View ${product.name}`} className="mt-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#f28c25] text-[#ed831b] transition-colors hover:bg-[#ed831b] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700"><Arrow /></Link>
        </div>
      </article>)}</div>}
    </div>
  </section>;
}

