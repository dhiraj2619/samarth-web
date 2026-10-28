"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import cloudinaryLoader from "@/lib/imageLoader";
import Link from "next/link";
import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/config";
import PageHero from "./PageHero";

async function allPages(endpoint, signal) {
  const records = [];
  for (let page = 1; ; page += 1) {
    const items = await api.get(endpoint, { params: { page, limit: 100 }, signal });
    if (!Array.isArray(items)) throw new Error("Unexpected response");
    records.push(...items);
    if (items.length < 100) return records;
  }
}

const safeUrl = value => {
  try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) ? url.href : null; }
  catch { return null; }
};
const host = url => new URL(url).hostname.replace(/^www\./, "");
const digits = value => String(value || "").replace(/\D/g, "").slice(-10);

function Icon({ d, className = "h-4 w-4" }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d={d} /></svg>;
}
const ICONS = {
  pin: "M12 21s-7-5.6-7-11a7 7 0 1 1 14 0c0 5.4-7 11-7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z",
  search: "m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z",
  store: "M3 9 4.5 4h15L21 9M3 9h18M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M5 12v8h14v-8M10 20v-5h4v5",
};

function Logo({ distributor }) {
  const [failed, setFailed] = useState(false);
  const src = distributor.logo?.url;
  const initials = distributor.companyName.split(/\s+/).slice(0, 2).map(word => word[0]).join("").toUpperCase();
  return <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#efe9dc] bg-white">
    {src && !failed
      ? <Image loader={cloudinaryLoader} src={src} alt="" fill sizes="64px" onError={() => setFailed(true)} className="object-contain p-1.5" />
      : <span aria-hidden="true" className="flex h-full items-center justify-center bg-brand-50 text-lg font-semibold text-brand-700">{initials}</span>}
  </div>;
}

function DistributorCard({ distributor }) {
  const website = safeUrl(distributor.website);
  const mobile = digits(distributor.mobile);
  const location = [distributor.city, distributor.state].filter(Boolean).join(", ");
  return <article className="flex h-full flex-col rounded-2xl border border-[#e5e4d9] bg-white p-6 shadow-sm transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(34,65,45,0.35)]">
    <div className="flex items-start gap-4">
      <Logo distributor={distributor} />
      <div className="min-w-0">
        <h3 className="text-lg font-semibold leading-snug text-brand-800">{distributor.companyName}</h3>
        {location && <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500"><Icon d={ICONS.pin} className="h-4 w-4 shrink-0 text-earth-400" />{location}{distributor.pincode && ` – ${distributor.pincode}`}</p>}
      </div>
    </div>
    <dl className="mt-5 space-y-2.5 border-t border-dashed border-gray-200 pt-4 text-sm text-gray-600">
      {distributor.contactPerson && <div className="flex items-center gap-2.5"><dt className="text-brand-600"><Icon d={ICONS.user} /><span className="sr-only">Contact person</span></dt><dd>{distributor.contactPerson}</dd></div>}
      {mobile.length === 10 && <div className="flex items-center gap-2.5"><dt className="text-brand-600"><Icon d={ICONS.phone} /><span className="sr-only">Mobile</span></dt><dd><a href={`tel:+91${mobile}`} className="hover:text-brand-700">+91 {mobile.slice(0, 5)} {mobile.slice(5)}</a></dd></div>}
      {website && <div className="flex items-center gap-2.5"><dt className="text-brand-600"><Icon d={ICONS.globe} /><span className="sr-only">Website</span></dt><dd className="truncate">{host(website)}</dd></div>}
    </dl>
    <div className="mt-auto flex gap-2 pt-5">
      {mobile.length === 10 && <a href={`https://wa.me/91${mobile}`} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center rounded-full bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">WhatsApp<span className="sr-only"> {distributor.companyName}, opens in a new tab</span></a>}
      {mobile.length === 10 && <a href={`tel:+91${mobile}`} className="flex flex-1 items-center justify-center rounded-full border border-brand-700 px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50">Call<span className="sr-only"> {distributor.companyName}</span></a>}
      {website && <a href={website} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Website <span aria-hidden="true">↗</span><span className="sr-only">, opens in a new tab</span></a>}
    </div>
  </article>;
}

export default function Distributors() {
  const [result, setResult] = useState({ items: [], loading: true, error: false });
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState("");
  const [state, setState] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    allPages(ENDPOINTS.distributors, controller.signal)
      .then(items => { if (!cancelled) setResult({ items: items.filter(item => item?.companyName), loading: false, error: false }); })
      .catch(() => { if (!cancelled) setResult({ items: [], loading: false, error: true }); });
    return () => { cancelled = true; controller.abort(); };
  }, [attempt]);

  const states = useMemo(() => [...new Set(result.items.map(item => item.state).filter(Boolean))].sort(), [result.items]);
  const cities = useMemo(() => new Set(result.items.map(item => item.city).filter(Boolean)).size, [result.items]);
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return result.items.filter(item => (!state || item.state === state) &&
      (!term || [item.companyName, item.contactPerson, item.city, item.state, item.pincode].some(value => String(value || "").toLowerCase().includes(term))));
  }, [result.items, query, state]);
  const filtered = Boolean(query.trim() || state);

  return <><PageHero breadcrumb="Our Distributors" eyebrow="Our network" title="Find a Samarth" highlight="distributor near you." description="Buy Samarth products from our trusted distribution partners. Search by name, city or pincode and get in touch directly." cta={{ href: "/contact", label: "Become a distributor" }} />
  <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
    {!result.loading && !result.error && result.items.length > 0 && <dl className="mb-8 grid grid-cols-3 divide-x divide-brand-100 rounded-2xl border border-[#e5e4d9] bg-white py-5 text-center">
      <div><dt className="text-xs uppercase tracking-wider text-gray-500">Distributors</dt><dd className="mt-1 text-2xl font-semibold text-brand-800 sm:text-3xl">{result.items.length}</dd></div>
      <div><dt className="text-xs uppercase tracking-wider text-gray-500">Cities</dt><dd className="mt-1 text-2xl font-semibold text-brand-800 sm:text-3xl">{cities}</dd></div>
      <div><dt className="text-xs uppercase tracking-wider text-gray-500">States</dt><dd className="mt-1 text-2xl font-semibold text-brand-800 sm:text-3xl">{states.length}</dd></div>
    </dl>}

    {!result.loading && !result.error && result.items.length > 0 && <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <label className="relative flex-1"><span className="sr-only">Search distributors</span>
        <Icon d={ICONS.search} className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by name, city or pincode" className="w-full rounded-full border border-[#e2dfd6] bg-white py-3 pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" />
      </label>
      {states.length > 1 && <label className="sm:w-56"><span className="sr-only">Filter by state</span>
        <select value={state} onChange={event => setState(event.target.value)} className="w-full rounded-full border border-[#e2dfd6] bg-white px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100">
          <option value="">All states</option>
          {states.map(name => <option key={name} value={name}>{name}</option>)}
        </select>
      </label>}
    </div>}

    {result.loading && <div role="status"><span className="sr-only">Loading distributors</span><div aria-hidden="true" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map(key => <div key={key} className="h-64 animate-pulse rounded-2xl bg-white motion-reduce:animate-none" />)}</div></div>}
    {result.error && <div role="alert" className="rounded-2xl border border-brand-100 bg-white p-8 text-center"><p className="text-sm text-gray-500">Distributors could not be loaded.</p><button onClick={() => { setResult({ items: [], loading: true, error: false }); setAttempt(value => value + 1); }} className="mt-4 rounded-full bg-brand-700 px-6 py-2 text-sm text-white">Try again</button></div>}
    {!result.loading && !result.error && !result.items.length && <div className="rounded-2xl border border-brand-100 bg-white p-10 text-center"><h2 className="text-lg font-semibold text-brand-800">Our distributor network is growing</h2><p className="mt-3 text-sm text-gray-500">Contact our team to buy Samarth products in your area.</p><Link href="/contact" className="mt-5 inline-block font-semibold text-brand-700">Contact Us →</Link></div>}

    {filtered && <p aria-live="polite" className="mb-4 text-xs text-gray-500">{visible.length} {visible.length === 1 ? "distributor" : "distributors"} found</p>}
    {filtered && !visible.length && <div className="rounded-2xl border border-brand-100 bg-white p-8 text-center"><p className="text-sm text-gray-500">No distributors match your search.</p><button onClick={() => { setQuery(""); setState(""); }} className="mt-3 text-sm font-semibold text-brand-700">Clear filters</button></div>}
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visible.map(item => <DistributorCard key={item._id} distributor={item} />)}</div>

    <section aria-labelledby="become-distributor" className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl bg-brand-800 p-8 text-white sm:flex-row sm:items-center sm:p-10">
      <div className="flex items-start gap-4">
        <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#f0b46a] sm:flex"><Icon d={ICONS.store} className="h-6 w-6" /></span>
        <div><h2 id="become-distributor" className="text-xl font-semibold">Become a Samarth distributor</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">Want to bring Samarth products to your city? Share your details and our team will get in touch about partnership.</p></div>
      </div>
      <Link href="/contact" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-800 hover:bg-brand-50">Partner with us <span aria-hidden="true">→</span></Link>
    </section>
  </div></>;
}
