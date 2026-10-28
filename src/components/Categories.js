"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import cloudinaryLoader from "@/lib/imageLoader";
import Link from "next/link";
import { categoryPath } from "@/lib/slug";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/categoriesSlice";

// Two cards per view on phones, three on tablets, five on desktop.
const SLIDE = "min-w-0 shrink-0 snap-start basis-[calc((100%-1rem)/2)] sm:basis-[calc((100%-2.5rem)/3)] lg:basis-[calc((100%-5rem)/5)]";

function Arrow({ back }) {
  return <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d={back ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"} /></svg>;
}

function Thumbnail({ category }) {
  const [failed, setFailed] = useState(false);
  const src = category.thumbnail?.url;
  const initials = category.name.split(/\s+/).filter(word => /\w/.test(word)).slice(0, 2).map(word => word[0]).join("").toUpperCase();
  return <span className="relative block aspect-square w-full overflow-hidden rounded-xl bg-[#f3f1ea]">
    {src && !failed
      ? <Image loader={cloudinaryLoader} src={src} alt="" fill sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 50vw" onError={() => setFailed(true)} className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" />
      : <span aria-hidden="true" className="flex h-full items-center justify-center bg-brand-50 text-3xl font-semibold text-brand-700">{initials}</span>}
  </span>;
}

function CategoryCard({ category }) {
  return <li className={SLIDE}>
    <Link
      href={categoryPath(category)}
      title={category.name}
      className="group flex h-full flex-col rounded-2xl border border-[#ece9df] bg-white p-3 shadow-[0_4px_20px_-10px_rgba(16,33,46,0.2)] transition duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-[0_18px_36px_-16px_rgba(34,65,45,0.4)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 motion-reduce:transform-none"
    >
      <Thumbnail category={category} />
      <span className="flex items-center justify-between gap-3 px-1.5 pb-1 pt-4">
        <span className="min-w-0">
          <span className="block truncate font-heading text-sm font-semibold tracking-tight text-[#172938] sm:text-base">{category.name}</span>
          <span className="mt-0.5 block text-xs font-medium text-brand-600">Shop now</span>
        </span>
        <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-700 group-hover:text-white">
          <Arrow />
        </span>
      </span>
    </Link>
  </li>;
}

function CategoryCarousel({ items }) {
  const track = useRef(null);
  // `pages` is the number of start positions when moving one card at a time.
  const [paging, setPaging] = useState({ page: 0, pages: 1 });
  const step = element => {
    const [first, second] = element.children;
    return second ? second.offsetLeft - first.offsetLeft : element.clientWidth;
  };
  useEffect(() => {
    const element = track.current;
    const update = () => {
      const max = element.scrollWidth - element.clientWidth;
      const pages = max > 1 ? Math.ceil(max / step(element) - 0.01) + 1 : 1;
      setPaging({ pages, page: element.scrollLeft >= max - 1 ? pages - 1 : Math.round(element.scrollLeft / step(element)) });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); };
  }, [items.length]);
  const go = page => {
    const element = track.current;
    const target = Math.max(0, Math.min(page, paging.pages - 1));
    element.scrollTo({ left: target * step(element), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  const arrowClass = "flex h-10 w-10 items-center justify-center rounded-full border border-[#e2dfd6] bg-white text-brand-800 shadow-sm transition-colors hover:border-brand-500 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-30";
  return <>
    {paging.pages > 1 && <div className="mt-6 flex justify-end gap-2 sm:-mt-12">
      <button type="button" aria-label="Previous categories" disabled={paging.page === 0} onClick={() => go(paging.page - 1)} className={arrowClass}><Arrow back /></button>
      <button type="button" aria-label="Next categories" disabled={paging.page >= paging.pages - 1} onClick={() => go(paging.page + 1)} className={arrowClass}><Arrow /></button>
    </div>}
    <ul ref={track} tabIndex={0} aria-label="Category carousel" className={`-mx-2 flex snap-x snap-mandatory scroll-px-2 gap-4 overflow-x-auto overscroll-x-contain px-2 pb-4 pt-3 [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden ${paging.pages > 1 ? "mt-3 sm:mt-6" : "mt-9"}`}>
      {items.map(category => <CategoryCard key={category._id} category={category} />)}
    </ul>
    {paging.pages > 1 && <div className="mt-2 flex justify-center" aria-label="Category slides">{Array.from({ length: paging.pages }, (_, page) => <button key={page} type="button" aria-label={`Go to slide ${page + 1}`} aria-current={paging.page === page ? "true" : undefined} onClick={() => go(page)} className="flex h-8 w-8 items-center justify-center rounded-full"><span className={`h-2 rounded-full transition-all ${paging.page === page ? "w-6 bg-brand-500" : "w-2 bg-gray-300"}`} /></button>)}</div>}
  </>;
}

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
          <div aria-hidden="true" className="flex gap-4 overflow-hidden pt-3 sm:gap-5">{Array.from({ length: 5 }, (_, index) => <div key={index} className={`${SLIDE} rounded-2xl border border-[#ece9df] bg-white p-3`}><span className="block aspect-square animate-pulse rounded-xl bg-gray-100 motion-reduce:animate-none" /><span className="mx-1.5 mt-4 block h-5 w-3/5 animate-pulse rounded bg-gray-100 motion-reduce:animate-none" /><span className="mx-1.5 mb-1 mt-2 block h-3 w-1/4 animate-pulse rounded bg-gray-100 motion-reduce:animate-none" /></div>)}</div>
        </div>}
        {status === "failed" && <div role="alert" className="mt-9 rounded-xl border border-[#e2dfd6] bg-white p-6"><p className="text-gray-600">{error}</p><button onClick={() => dispatch(fetchCategories())} className="mt-4 rounded-lg bg-brand-700 px-5 py-2 text-sm font-semibold text-white">Try again</button></div>}
        {status === "succeeded" && !items.length && <p className="mt-9 rounded-xl border border-[#e2dfd6] bg-white p-7 text-gray-500">Our categories will be available soon. Please check back for our latest range.</p>}
        {status === "succeeded" && items.length > 0 && <CategoryCarousel items={items} />}
      </div>
    </section>
  );
}
