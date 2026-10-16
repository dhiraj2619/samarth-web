"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/categoriesSlice";

export default function Categories() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector(state => state.categories);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  return (
    <section id="categories" aria-labelledby="categories-title" className="scroll-mt-20 bg-[#f8f7f2] py-10 sm:py-12 lg:py-14">
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
        {status === "succeeded" && items.length > 0 && <ul className="mt-9 grid gap-5 sm:grid-cols-2 sm:gap-6">
          {items.map(category => <li key={category._id}>
            <Link
              href={`/categories/${category._id}`}
              className="group flex min-h-20 items-center justify-between gap-5 rounded-xl border border-[#e2dfd6] bg-white px-6 py-5 transition-colors hover:border-brand-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 sm:px-7"
            >
              <span>
                <span className="block font-heading text-base font-semibold tracking-tight text-[#172938] sm:text-lg">{category.name}</span>
                {typeof category.productCount === "number" && <span className="mt-1 block text-sm text-gray-500">{category.productCount ? `${category.productCount} ${category.productCount === 1 ? "product" : "products"}` : "Coming soon"}</span>}
              </span>
              <svg aria-hidden="true" className="h-6 w-6 shrink-0 text-[#f78b17] transition-transform group-hover:translate-x-1 motion-reduce:transform-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16m-7-7 7 7-7 7" /></svg>
            </Link>
          </li>)}
        </ul>}
      </div>
    </section>
  );
}
