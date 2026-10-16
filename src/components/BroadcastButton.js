"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/config";

export default function BroadcastButton() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const drawer = useRef(null);
  const trigger = useRef(null);
  const motion = useRef(null);

  useEffect(() => {
    if (!open) return;
    const dialog = drawer.current;
    const button = trigger.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    motion.current = dialog.animate(
      reduced ? [{ opacity: 0 }, { opacity: 1 }] : [{ transform: "translateX(100%)" }, { transform: "translateX(0)" }],
      { duration: reduced ? 140 : 520, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "both" }
    );
    document.body.style.overflow = "hidden";
    return () => {
      motion.current?.cancel();
      dialog.close();
      document.body.style.overflow = previousOverflow;
      button?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!closing) return;
    const dialog = drawer.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Capture the current position so closing mid-animation never jumps.
    const current = getComputedStyle(dialog);
    const transform = current.transform;
    const opacity = current.opacity;
    motion.current?.cancel();
    const animation = dialog.animate(
      reduced ? [{ opacity }, { opacity: 0 }] : [{ transform }, { transform: "translateX(100%)" }],
      { duration: reduced ? 140 : 420, easing: "cubic-bezier(.4, 0, .2, 1)", fill: "both" }
    );
    motion.current = animation;
    let cancelled = false;
    animation.finished.then(() => {
      if (!cancelled) { setOpen(false); setClosing(false); }
    }).catch(() => {});
    return () => { cancelled = true; animation.cancel(); };
  }, [closing]);

  return <>
    <button ref={trigger} type="button" title="Broadcasts" aria-label="Open broadcasts" aria-haspopup="dialog" aria-expanded={open} aria-controls="navbar-broadcasts" onClick={() => setOpen(true)}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-100 bg-white text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
      <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9h4l9-5v16l-9-5H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z" /><path d="m5 15 2 6h3l-2-6M8 9v6m12-7 2-1m-2 5h2m-2 4 2 1" /></svg>
    </button>
    <dialog ref={drawer} id="navbar-broadcasts" aria-labelledby="broadcasts-title" data-closing={closing}
      onCancel={event => { event.preventDefault(); setClosing(true); }}
      onClick={event => { if (event.target === event.currentTarget) setClosing(true); }}
      className="broadcast-drawer fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-full max-w-[28rem] overflow-hidden border-0 bg-[#f8f7f2] p-0 text-gray-700 shadow-2xl">
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-brand-100 bg-white px-6 pb-5 pt-[max(1.5rem,env(safe-area-inset-top))]">
          <div><p className="mb-1 text-xs font-medium uppercase tracking-widest text-brand-600">Samarth Enterprises</p><h2 id="broadcasts-title" className="text-2xl font-bold text-brand-800">Broadcasts</h2><p className="mt-2 text-sm text-gray-500">The latest news and announcements.</p></div>
          <button type="button" autoFocus onClick={() => setClosing(true)} aria-label="Close broadcasts" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-brand-600"><svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="m6 6 12 12M6 18 18 6" /></svg></button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-6">
          {open && <BroadcastList />}
        </div>
      </div>
    </dialog>
  </>;
}

function safeUrl(value) {
  try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) ? url.href : null; }
  catch { return null; }
}

function BroadcastList() {
  const [result, setResult] = useState({ items: [], loading: true, error: null });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    async function load() {
      try {
        const broadcasts = [];
        // Fetch every page, not just the API's default first 20 broadcasts.
        for (let page = 1; ; page += 1) {
          const items = await api.get(ENDPOINTS.broadcasts, { params: { page, limit: 100 }, signal: controller.signal });
          if (cancelled) return;
          if (!Array.isArray(items)) throw new Error("Unexpected broadcast response");
          broadcasts.push(...items);
          if (items.length < 100) break;
        }
        if (!cancelled) setResult({ items: [...new Map(broadcasts.map(item => [item._id, item])).values()], loading: false, error: null });
      } catch {
        if (!cancelled) setResult({ items: [], loading: false, error: "We couldn't load broadcasts. Please try again." });
      }
    }
    load();
    return () => { cancelled = true; controller.abort(); };
  }, [attempt]);

  if (result.loading) return <div role="status"><span className="sr-only">Loading broadcasts</span>{[0, 1, 2].map(key => <div key={key} aria-hidden="true" className="mb-5 animate-pulse rounded-xl border border-brand-100 bg-white p-4 motion-reduce:animate-none"><div className="h-40 rounded-lg bg-gray-100" /><div className="mt-5 h-5 w-3/4 rounded bg-gray-100" /><div className="mt-3 h-12 rounded bg-gray-50" /></div>)}</div>;
  if (result.error) return <div role="alert" className="rounded-xl border border-brand-100 bg-white p-6"><p className="text-sm leading-relaxed">{result.error}</p><button onClick={() => { setResult({ items: [], loading: true, error: null }); setAttempt(value => value + 1); }} className="mt-4 rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white">Try again</button></div>;
  if (!result.items.length) return <div className="rounded-xl border border-brand-100 bg-white p-7 text-center"><h3 className="text-lg font-semibold text-brand-800">You are all caught up</h3><p className="mt-2 text-sm leading-relaxed text-gray-500">No broadcasts yet. Check back for updates from Samarth Enterprises.</p></div>;

  return <><p role="status" className="mb-4 text-xs text-gray-500">{result.items.length} {result.items.length === 1 ? "broadcast" : "broadcasts"} · Latest first</p><div className="space-y-5">{result.items.map(item => {
    const image = safeUrl(item.image?.url);
    const link = safeUrl(item.link);
    const date = new Date(item.createdAt);
    return <article key={item._id} className="overflow-hidden rounded-xl border border-brand-100 bg-white">
      {image && <Image unoptimized src={image} alt={item.title || "Broadcast image"} width={800} height={500} className="h-auto max-h-80 w-full object-contain" />}
      <div className="p-5">
        {!Number.isNaN(date.getTime()) && <time dateTime={date.toISOString()} className="text-xs text-gray-500">{date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })}</time>}
        <h3 className="mt-2 break-words text-lg font-semibold text-brand-800">{item.title}</h3>
        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-600">{item.description}</p>
        {link && <a href={link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline">Learn more <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>}
      </div>
    </article>;
  })}</div></>;
}
