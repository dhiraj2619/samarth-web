"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/config";
import PageHero from "./PageHero";

const BULK_PURCHASE_URL = "https://www.nohar.in/collections/6aab807df72efd444fa68369?name=Samarth";
const money = value => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const saving = offer => offer.discountType === "PERCENTAGE" ? `${offer.discountValue}% OFF` : `Flat ${money(offer.discountValue)} OFF`;
function Tag({ className = "h-6 w-6" }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h8l10 10-8 8L3 11V3Z" /><circle cx="7.5" cy="7.5" r="1" /></svg>;
}
async function allPages(endpoint, signal) {
  const records = [];
  for (let page = 1; ; page += 1) {
    if (signal.aborted) throw new Error("Request cancelled");
    const items = await api.get(endpoint, { params: { page, limit: 100 }, signal });
    if (!Array.isArray(items)) throw new Error("Unexpected response");
    records.push(...items);
    if (items.length < 100) return records;
  }
}

export default function BulkOffers() {
  const [result, setResult] = useState({ items: [], loading: true, error: false });
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    allPages(ENDPOINTS.offers, controller.signal)
      .then(items => { if (!cancelled) setResult({ items, loading: false, error: false }); })
      .catch(() => { if (!cancelled) setResult({ items: [], loading: false, error: true }); });
    return () => { cancelled = true; controller.abort(); };
  }, [attempt]);

  return <><PageHero breadcrumb="Bulk Purchase" eyebrow="More value, together" title="Better offers." highlight="Bigger possibilities." description="Explore offers for your bulk purchases. View the details and eligible products, and continue shopping on Nohar." cta={{ href: "/contact", label: "Need help with a bulk order?" }} />
  <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
    <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold text-brand-800">Available offers</h2>{!result.loading && !result.error && <span className="text-xs text-gray-500">{result.items.length} {result.items.length === 1 ? "offer" : "offers"}</span>}</div>
    {result.loading && <div role="status"><span className="sr-only">Loading offers</span><div aria-hidden="true" className="grid gap-5 md:grid-cols-2">{[0, 1, 2, 3].map(key => <div key={key} className="h-44 animate-pulse rounded-2xl bg-white motion-reduce:animate-none" />)}</div></div>}
    {result.error && <div role="alert" className="rounded-2xl border border-brand-100 bg-white p-8 text-center"><p className="text-sm text-gray-500">Offers could not be loaded.</p><button onClick={() => { setResult({ items: [], loading: true, error: false }); setAttempt(value => value + 1); }} className="mt-4 rounded-full bg-brand-700 px-6 py-2 text-sm text-white">Try again</button></div>}
    {!result.loading && !result.error && !result.items.length && <div className="rounded-2xl border border-brand-100 bg-white p-10 text-center"><h3 className="text-lg font-semibold text-brand-800">New offers are on their way</h3><p className="mt-3 text-sm text-gray-500">Contact our team to discuss your bulk requirements.</p><Link href="/contact" className="mt-5 inline-block font-semibold text-brand-700">Contact Us →</Link></div>}
    <div className="grid gap-5 md:grid-cols-2">{result.items.map(offer => <article key={offer._id} className="rounded-2xl border border-[#e5e4d9] bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Tag /></span><div><p className="text-xs font-medium uppercase tracking-wider text-[#b27b38]">{saving(offer)}</p><h3 className="mt-2 text-lg font-semibold leading-snug text-brand-800">{offer.title}</h3><p className="mt-2 text-xs text-gray-500">{offer.minOrderAmount > 0 ? `Minimum order ${money(offer.minOrderAmount)}` : "No minimum order amount specified"}</p></div></div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-gray-200 pt-4"><span className="rounded-md bg-[#f8f7f2] px-3 py-2 font-mono text-sm font-semibold tracking-wide text-brand-800">{offer.code}</span><button type="button" onClick={() => setSelected(offer)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#c27c2c] hover:bg-earth-50">Details <span aria-hidden="true">→</span></button></div>
    </article>)}</div>
    <p className="mt-8 text-center text-xs leading-relaxed text-gray-500">Purchases are completed on Nohar. Contact Samarth Enterprises for assistance with offer eligibility.</p>
    {selected && <OfferDetails offer={selected} onClose={() => setSelected(null)} />}
  </div></>;
}

function OfferDetails({ offer, onClose }) {
  const dialog = useRef(null);
  const [copied, setCopied] = useState("");
  useEffect(() => {
    const element = dialog.current;
    const trigger = document.activeElement;
    const previous = document.body.style.overflow;
    element.showModal(); document.body.style.overflow = "hidden";
    return () => { element.close(); document.body.style.overflow = previous; trigger?.focus({ preventScroll: true }); };
  }, []);
  const copy = async () => {
    try { await navigator.clipboard.writeText(offer.code); setCopied("Code copied"); }
    catch { setCopied("Select and copy the code above."); }
  };
  return <dialog ref={dialog} aria-labelledby="offer-detail-title" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-2xl border-0 bg-white p-0 text-gray-700 shadow-2xl backdrop:bg-black/50">
    <div><div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-7"><h2 id="offer-detail-title" className="text-xl font-semibold text-brand-800">Offer details</h2><button type="button" autoFocus onClick={onClose} aria-label="Close offer details" className="flex h-9 w-9 items-center justify-center rounded-full text-2xl hover:bg-brand-50">×</button></div>
      <div className="p-5 sm:p-7"><div className="rounded-xl border border-brand-100 bg-brand-50 p-5"><div className="flex items-center gap-3 text-brand-700"><Tag /><p className="text-xl font-semibold">{saving(offer)}</p></div><h3 className="mt-3 font-semibold text-brand-800">{offer.title}</h3><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm">Use code <strong className="ml-2 select-all font-mono tracking-wide">{offer.code}</strong></p><button onClick={copy} className="rounded-lg border border-brand-100 bg-white px-3 py-2 text-xs font-semibold text-brand-700">Copy code</button></div><p role="status" className="mt-2 text-xs text-brand-700">{copied}</p></div>
        {offer.description && <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{offer.description}</p>}
        <h3 className="mb-3 mt-6 text-base font-semibold text-brand-800">Offer eligibility</h3><ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-600"><li>{offer.minOrderAmount > 0 ? `Minimum order amount: ${money(offer.minOrderAmount)}.` : "No minimum order amount is specified for this offer."}</li><li>{offer.applicableProducts?.length ? "Valid for the eligible products listed below." : "This offer applies to all catalogue products."}</li><li>Keep the offer code handy when continuing to Nohar. Contact us if you need help applying it.</li></ul>
        <EligibleProducts offer={offer} />
      </div>
    </div>
  </dialog>;
}

function EligibleProducts({ offer }) {
  const restricted = Boolean(offer.applicableProducts?.length);
  const initial = restricted ? offer.applicableProducts.filter(product => product && typeof product === "object" && product.isActive !== false) : [];
  const [result, setResult] = useState({ items: initial, loading: !restricted, error: false });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (restricted) return;
    const controller = new AbortController();
    let cancelled = false;
    allPages(ENDPOINTS.products, controller.signal).then(items => {
      if (!cancelled) setResult({ items, loading: false, error: false });
    }).catch(() => { if (!cancelled) setResult({ items: [], loading: false, error: true }); });
    return () => { cancelled = true; controller.abort(); };
  }, [restricted, attempt]);
  return <div className="mt-6"><h3 className="text-base font-semibold text-brand-800">Eligible products</h3>
    {result.loading && <p role="status" className="mt-4 text-sm text-gray-500">Loading products…</p>}
    {result.error && <p role="alert" className="mt-4 text-sm">Could not load products. <button className="font-semibold text-brand-700" onClick={() => { setResult({ items: [], loading: true, error: false }); setAttempt(value => value + 1); }}>Try again</button></p>}
    {!result.loading && !result.error && !result.items.length && <p className="mt-4 text-sm text-gray-500">No eligible products are currently available. Contact us for assistance.</p>}
    {result.items.length > 0 && <ul className="mt-3 max-h-52 list-disc space-y-2 overflow-y-auto pl-5 text-sm leading-relaxed text-gray-600">{result.items.map(product => <li key={product._id}>{product.name}</li>)}</ul>}
    <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row">
      <a href={BULK_PURCHASE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-800">Bulk Purchase <span aria-hidden="true">↗</span><span className="sr-only"> on Nohar, opens in a new tab</span></a>
      <Link href="/contact" className="flex flex-1 items-center justify-center rounded-full border border-brand-700 px-6 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50">Contact Us</Link>
    </div>
  </div>;
}
