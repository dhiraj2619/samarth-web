"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/config";

export default function Categories() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector(state => state.categories);
  const [selected, setSelected] = useState(null);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  return (
    <section id="collections" aria-labelledby="categories-title" className="scroll-mt-20 bg-[#f8f7f2] py-10 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span aria-hidden="true" className="mb-4 block h-1 w-12 rounded-full bg-brand-500" />
        <h2 id="categories-title" className="text-2xl font-bold tracking-tight text-[#10212e] sm:text-3xl lg:text-4xl">Explore Our Categories</h2>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">Browse our product range</p>

        {(status === "idle" || status === "loading") && <div role="status" className="mt-9">
          <span className="sr-only">Loading categories</span>
          <div aria-hidden="true" className="grid gap-5 sm:grid-cols-2">{Array.from({ length: 6 }, (_, index) => <div key={index} className="flex h-24 items-center rounded-xl border border-[#e2dfd6] bg-white px-7"><span className="h-6 w-3/5 animate-pulse rounded bg-gray-100 motion-reduce:animate-none" /></div>)}</div>
        </div>}
        {status === "failed" && <div role="alert" className="mt-9 rounded-xl border border-[#e2dfd6] bg-white p-6"><p className="text-gray-600">{error}</p><button onClick={() => dispatch(fetchCategories())} className="mt-4 rounded-lg bg-brand-700 px-5 py-2 text-sm font-semibold text-white">Try again</button></div>}
        {status === "succeeded" && !items.length && <p className="mt-9 rounded-xl border border-[#e2dfd6] bg-white p-7 text-gray-500">Our categories will be available soon. Please check back for our latest range.</p>}
        {status === "succeeded" && items.length > 0 && <div className="mt-9 grid gap-5 sm:grid-cols-2 sm:gap-6">
          {items.map(category => <button
            key={category._id}
            type="button"
            aria-expanded={selected?._id === category._id}
            aria-controls={selected?._id === category._id ? "category-products" : undefined}
            onClick={() => setSelected(current => current?._id === category._id ? null : category)}
            className={`group flex min-h-20 items-center justify-between gap-5 rounded-xl border bg-white px-6 py-5 text-left transition-colors hover:border-brand-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 sm:px-7 ${selected?._id === category._id ? "border-brand-500" : "border-[#e2dfd6]"}`}
          >
            <span className="font-heading text-base font-semibold tracking-tight text-[#172938] sm:text-lg">{category.name}</span>
            <svg aria-hidden="true" className="h-6 w-6 shrink-0 text-[#f78b17] transition-transform group-hover:translate-x-1 motion-reduce:transform-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16m-7-7 7 7-7 7" /></svg>
          </button>)}
        </div>}
        {selected && <CategoryProducts key={selected._id} category={selected} onClose={() => setSelected(null)} />}
      </div>
    </section>
  );
}

function CategoryProducts({ category, onClose }) {
  const [result, setResult] = useState({ items: [], loading: true, error: null });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    async function load() {
      try {
        const products = [];
        for (let page = 1; ; page += 1) {
          const items = await api.get(ENDPOINTS.products, { params: { categoryId: category._id, page, limit: 100 }, signal: controller.signal });
          if (!Array.isArray(items)) throw new Error("Unable to read products.");
          if (cancelled) return;
          products.push(...items);
          if (items.length < 100) break;
        }
        if (!cancelled) setResult({ items: products, loading: false, error: null });
      } catch {
        if (!cancelled) setResult({ items: [], loading: false, error: "Products could not be loaded. Please try again." });
      }
    }
    load();
    return () => { cancelled = true; controller.abort(); };
  }, [category._id, attempt]);

  return <div id="category-products" className="mt-8 rounded-xl border border-[#e2dfd6] bg-white p-6 sm:p-8" aria-labelledby="category-products-title">
    <div className="flex items-center justify-between gap-4"><h3 id="category-products-title" className="text-lg font-semibold text-brand-800">{category.name}</h3><button type="button" onClick={onClose} className="rounded-md px-3 py-2 text-sm text-brand-700 hover:bg-brand-50">Close</button></div>
    <div aria-live="polite">
      {result.loading && <p className="mt-5 text-gray-500">Loading products…</p>}
      {result.error && <div className="mt-5"><p className="text-gray-600">{result.error}</p><button className="mt-3 font-semibold text-brand-700" onClick={() => { setResult({ items: [], loading: true, error: null }); setAttempt(value => value + 1); }}>Try again</button></div>}
      {!result.loading && !result.error && !result.items.length && <p className="mt-5 text-gray-500">Products in this category are coming soon.</p>}
      {!!result.items.length && <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{result.items.map(product => <article key={product._id} className="rounded-lg border border-brand-100 p-5"><h4 className="font-semibold text-brand-800">{product.name}</h4><p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600">{product.description}</p></article>)}</div>}
    </div>
  </div>;
}
