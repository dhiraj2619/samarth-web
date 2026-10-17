"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/config";
import { WHATSAPP_URL, WhatsAppIcon } from "./WhatsAppButton";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/#categories" },
  { label: "Bulk Purchase", href: "/bulk-purchase" },
  { label: "Our Distributors", href: "/#our-distributors" },
  { label: "Contact Us", href: "/contact" },
];

function Heading({ children }) {
  return <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">{children}</h2>;
}

function ContactRow({ icon, children }) {
  return <li className="flex items-start gap-3">
    <svg aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#f3a24c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d={icon} /></svg>
    <span className="min-w-0 break-words">{children}</span>
  </li>;
}

const ICONS = {
  phone: "M3 5.5A2.5 2.5 0 0 1 5.5 3h1.6a1 1 0 0 1 .95.68l1.1 3.3a1 1 0 0 1-.36 1.12l-1.6 1.2a12 12 0 0 0 5.5 5.5l1.2-1.6a1 1 0 0 1 1.12-.36l3.3 1.1a1 1 0 0 1 .69.95v1.6a2.5 2.5 0 0 1-2.5 2.5h-1A14.5 14.5 0 0 1 3 6.5v-1Z",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  pin: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
};

// Read at request time; prerendering may not evaluate the current date.
function Year() {
  return new Date().getFullYear();
}

export default function Footer() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.categories.items);
  const [profile, setProfile] = useState(null);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);
  useEffect(() => {
    const controller = new AbortController();
    api.get(ENDPOINTS.settings, { signal: controller.signal })
      .then(data => setProfile(data?.profile ?? null))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const social = profile?.socialLinks || {};
  const whatsapp = social.whatsapp || WHATSAPP_URL;

  return <footer className="mt-auto bg-brand-800 text-[15px] text-white/75">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-12 lg:px-8 lg:py-16">
      <div>
        <Link href="/" aria-label="Samarth Enterprises home" className="inline-block rounded-xl bg-white px-4 py-2">
          <Image src="/logo/samarthlogo.png" alt="Samarth Enterprises" width={2048} height={768} className="h-11 w-auto" />
        </Link>
        <p className="mt-5 max-w-xs leading-relaxed">Reliable products for a healthier tomorrow. Quality wellness, beauty and personal-care products for homes and businesses.</p>
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-whatsapp-dark">
          <WhatsAppIcon className="h-5 w-5" /> Chat on WhatsApp
        </a>
      </div>

      <nav aria-labelledby="footer-links">
        <Heading><span id="footer-links">Quick Links</span></Heading>
        <ul className="mt-5 space-y-3">
          {quickLinks.map(link => <li key={link.label}><Link href={link.href} className="transition-colors hover:text-white">{link.label}</Link></li>)}
        </ul>
      </nav>

      <nav aria-labelledby="footer-categories">
        <Heading><span id="footer-categories">Categories</span></Heading>
        <ul className="mt-5 space-y-3">
          {categories.length
            ? categories.slice(0, 8).map(category => <li key={category._id}><Link href={`/categories/${category._id}`} className="transition-colors hover:text-white">{category.name}</Link></li>)
            : <li><Link href="/#categories" className="transition-colors hover:text-white">Browse all categories</Link></li>}
        </ul>
      </nav>

      <div>
        <Heading>Get in Touch</Heading>
        <ul className="mt-5 space-y-4">
          {profile?.phone && <ContactRow icon={ICONS.phone}><a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="hover:text-white">{profile.phone}</a></ContactRow>}
          {profile?.email && <ContactRow icon={ICONS.mail}><a href={`mailto:${profile.email}`} className="hover:text-white">{profile.email}</a></ContactRow>}
          {profile?.address && <ContactRow icon={ICONS.pin}><span className="whitespace-pre-line">{profile.address}</span></ContactRow>}
          <ContactRow icon={ICONS.mail}><Link href="/contact" className="font-medium text-white underline-offset-4 hover:underline">Send us an enquiry</Link></ContactRow>
        </ul>
        {(social.instagram || social.youtube) && <div className="mt-6 flex gap-3">
          {social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white hover:text-brand-800">
            <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
          </a>}
          {social.youtube && <a href={social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white hover:text-brand-800">
            <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" /></svg>
          </a>}
        </div>}
      </div>
    </div>

    <div className="border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© <Suspense><Year /></Suspense> {profile?.companyName || "Samarth Enterprises"}. All rights reserved.</p>
        {profile?.gstNumber && <p>GSTIN: {profile.gstNumber}</p>}
      </div>
    </div>
  </footer>;
}
