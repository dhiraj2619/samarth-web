"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import cloudinaryLoader from "@/lib/imageLoader";
import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/config";

function mediaSource(value) {
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol)) return null;
    const host = url.hostname.toLowerCase();
    let id;
    if (["youtu.be", "www.youtu.be"].includes(host)) id = url.pathname.split("/")[1];
    if (["youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"].includes(host)) {
      id = url.searchParams.get("v") || (/^\/(shorts|embed|live)\//.test(url.pathname) ? url.pathname.split("/")[2] : null);
    }
    if (id && /^[\w-]{11}$/.test(id)) return { type: "youtube", src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`, poster: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` };
    return { type: /\.(mp4|webm|ogg|ogv)$/i.test(url.pathname) ? "video" : "link", src: url.href };
  } catch { return null; }
}

function Arrow({ back = false }) {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d={back ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"} /></svg>;
}

export default function WellnessVideos() {
  const [result, setResult] = useState({ items: [], loading: true, error: false });
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    async function load() {
      try {
        const ads = [];
        for (let page = 1; ; page += 1) {
          const items = await api.get(ENDPOINTS.ads, { params: { page, limit: 100 }, signal: controller.signal });
          if (cancelled) return;
          if (!Array.isArray(items)) throw new Error("Invalid response");
          ads.push(...items.filter(item => item.isActive !== false));
          if (items.length < 100) break;
        }
        if (!cancelled) setResult({ items: ads, loading: false, error: false });
      } catch { if (!cancelled) setResult({ items: [], loading: false, error: true }); }
    }
    load();
    return () => { cancelled = true; controller.abort(); };
  }, [attempt]);

  return <section aria-labelledby="wellness-title" className="bg-white py-12 sm:py-16 lg:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 id="wellness-title" className="text-center text-2xl font-semibold text-[#142b26] sm:text-3xl">Your Wellness Solutions</h2>
      <span aria-hidden="true" className="mx-auto mb-8 mt-4 block h-0.5 w-14 rounded-full bg-brand-500" />
      {result.loading && <div role="status"><span className="sr-only">Loading wellness videos</span><div aria-hidden="true" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map(key => <div key={key} className="aspect-video animate-pulse rounded-2xl bg-gray-100 motion-reduce:animate-none" />)}</div></div>}
      {result.error && <div role="alert" className="py-8 text-center text-sm text-gray-500"><p>Wellness videos could not be loaded.</p><button className="mt-3 font-semibold text-brand-700" onClick={() => { setResult({ items: [], loading: true, error: false }); setAttempt(value => value + 1); }}>Try again</button></div>}
      {!result.loading && !result.error && !result.items.length && <p className="py-8 text-center text-sm text-gray-500">Our wellness videos are coming soon.</p>}
      {!!result.items.length && <AdCarousel items={result.items} onSelect={setSelected} />}
    </div>
    {selected && <AdPlayer ad={selected} onClose={() => setSelected(null)} />}
  </section>;
}

function AdCarousel({ items, onSelect }) {
  const track = useRef(null);
  const [paging, setPaging] = useState({ page: 0, pages: 1 });
  useEffect(() => {
    const element = track.current;
    const update = () => {
      const width = element.firstElementChild?.getBoundingClientRect().width || element.clientWidth;
      const visible = Math.max(1, Math.round((element.clientWidth + 24) / (width + 24)));
      const pages = Math.ceil(items.length / visible);
      const max = element.scrollWidth - element.clientWidth;
      setPaging({ pages, page: max > 1 ? Math.round(element.scrollLeft / max * (pages - 1)) : 0 });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); };
  }, [items.length]);
  const go = page => {
    const element = track.current;
    element.scrollTo({ left: (element.scrollWidth - element.clientWidth) * page / Math.max(1, paging.pages - 1), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return <>
    <div className="mb-5 flex justify-end gap-2 sm:-mt-20 sm:mb-8">
      <button type="button" aria-label="Previous wellness videos" disabled={paging.page === 0} onClick={() => go(paging.page - 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-brand-800 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-30"><Arrow back /></button>
      <button type="button" aria-label="Next wellness videos" disabled={paging.page >= paging.pages - 1} onClick={() => go(paging.page + 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-brand-800 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-30"><Arrow /></button>
    </div>
    <div ref={track} tabIndex={0} role="region" aria-label="Wellness video carousel" className="flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map(ad => <AdCard key={ad._id} ad={ad} onSelect={onSelect} />)}
    </div>
    {paging.pages > 1 && <div className="mt-5 flex justify-center" aria-label="Wellness video pages">{Array.from({ length: paging.pages }, (_, page) => <button key={page} type="button" aria-label={`Go to video page ${page + 1}`} aria-current={paging.page === page ? "true" : undefined} onClick={() => go(page)} className="flex h-8 w-8 items-center justify-center rounded-full"><span className={`h-2 w-2 rounded-full ${paging.page === page ? "bg-brand-500" : "bg-gray-200"}`} /></button>)}</div>}
  </>;
}

function AdCard({ ad, onSelect }) {
  const source = mediaSource(ad.videoLink);
  const poster = ad.image?.url || source?.poster;
  const [imageFailed, setImageFailed] = useState(false);
  return <article className="min-w-0 shrink-0 basis-full snap-start sm:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)]">
    <button type="button" onClick={() => onSelect(ad)} aria-label={`${source ? "Play" : "View"} ${ad.title}`} className="group block w-full overflow-hidden rounded-2xl border border-[#e5eae4] bg-white text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-brand-600">
      <div className="relative aspect-video bg-brand-50">
        {poster && !imageFailed ? <Image loader={cloudinaryLoader} src={poster} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" onError={() => setImageFailed(true)} className="object-cover" /> : <span className="absolute inset-0 flex items-center justify-center px-12 text-center font-heading text-xl font-semibold text-brand-700">Samarth Enterprises</span>}
        {source && <><span className="absolute inset-0 bg-black/20" /><span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-brand-500 shadow-lg transition-transform group-hover:scale-110"><svg aria-hidden="true" width="25" height="25" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.8c0-1 1.1-1.6 1.9-1.1l12 7.2a1.3 1.3 0 0 1 0 2.2l-12 7.2A1.3 1.3 0 0 1 7 19.2Z" /></svg></span></>}
      </div>
      <h3 className="px-5 py-5 text-base font-medium text-[#18342c]">{ad.title}</h3>
    </button>
  </article>;
}

function AdPlayer({ ad, onClose }) {
  const dialog = useRef(null);
  const [failed, setFailed] = useState(false);
  const source = mediaSource(ad.videoLink);
  useEffect(() => {
    const element = dialog.current;
    const trigger = document.activeElement;
    const overflow = document.body.style.overflow;
    element.showModal(); document.body.style.overflow = "hidden";
    return () => { element.close(); document.body.style.overflow = overflow; trigger?.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={dialog} aria-labelledby="wellness-player-title" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto rounded-2xl border-0 bg-white p-0 shadow-2xl backdrop:bg-black/70">
    <div><div className="flex items-center justify-between gap-4 px-5 py-4"><h2 id="wellness-player-title" className="text-lg font-semibold text-brand-800">{ad.title}</h2><button type="button" autoFocus aria-label="Close video" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-2xl text-brand-800 hover:bg-brand-50">×</button></div>
      {source?.type === "youtube" ? <iframe src={source.src} title={ad.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="aspect-video w-full border-0 bg-black" />
        : source?.type === "video" && !failed ? <video controls autoPlay playsInline onError={() => setFailed(true)} src={source.src} aria-label={ad.title} className="aspect-video w-full bg-black" />
          : <div className="p-5">{ad.image?.url && <Image loader={cloudinaryLoader} src={ad.image.url} alt={ad.title} width={900} height={600} className="h-auto w-full rounded-lg" />}{failed && <p role="alert" className="mt-3 text-sm text-gray-600">The video could not be played here.</p>}{source && <a href={source.src} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-full bg-brand-700 px-5 py-3 text-sm text-white">Open video in a new tab</a>}{!source && !ad.image?.url && <p className="text-sm text-gray-500">More information coming soon.</p>}</div>}
    </div>
  </dialog>;
}
