"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import WhatsAppButton from "./WhatsAppButton";
import BroadcastButton from "./BroadcastButton";

const links = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/#categories" },
  { label: "Bulk Purchase", href: "/bulk-purchase" },
  { label: "Our Distributors", href: "/#our-distributors" },
  { label: "Contact Us", href: "/contact" },

];

export default function Navbar({ activeLink = "Home" }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(activeLink);
  const drawer = useRef(null);
  const menuButton = useRef(null);
  useEffect(() => {
    const dialog = drawer.current;
    const trigger = menuButton.current;
    if (!open) return;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const breakpoint = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (breakpoint.matches) setOpen(false); };
    breakpoint.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      breakpoint.removeEventListener("change", closeOnDesktop);
      dialog.close();
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0" aria-label="Samarth Enterprises home">
          <Image
            src="/logo/samarthlogo.png"
            alt="Samarth Enterprises"
            width={2048}
            height={768}
            priority
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => setActive(link.label)}
                className={`relative py-2 text-[15px] font-medium transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:rounded-full after:bg-brand-600 after:transition-all ${
                  active === link.label
                    ? "text-brand-700 after:w-full"
                    : "text-gray-700 after:w-0 hover:text-brand-600 hover:after:w-full"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <BroadcastButton />
        <div className="hidden lg:block">
          <WhatsAppButton />
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-md p-2 text-brand-700 hover:bg-brand-50 lg:hidden"
          ref={menuButton}
          aria-label="Open navigation"
          aria-controls="mobile-navigation"
          aria-expanded={open}
        >
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        </div>
      </nav>

    </header>
    <dialog ref={drawer} id="mobile-navigation" aria-labelledby="mobile-navigation-title"
      onCancel={() => setOpen(false)}
      onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}
      className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[min(85vw,22rem)] max-w-none border-0 bg-white p-0 text-gray-700 shadow-2xl backdrop:bg-black/40 lg:hidden">
      <div className="flex min-h-full flex-col px-5 pb-8 pt-5">
        <div className="flex items-center justify-between gap-4 border-b border-brand-100 pb-5">
          <h2 id="mobile-navigation-title" className="text-lg font-semibold text-brand-800">Explore Samarth</h2>
          <button type="button" autoFocus onClick={() => setOpen(false)} aria-label="Close navigation" className="rounded-full p-2 text-brand-700 hover:bg-brand-50">
            <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="m6 6 12 12M6 18 18 6" /></svg>
          </button>
        </div>
        <nav aria-label="Mobile navigation" className="mt-5">
          <ul className="space-y-2">
            {links.map(link => <li key={link.label}>
              <Link href={link.href} aria-current={active === link.label ? "location" : undefined}
                onClick={() => { setActive(link.label); setOpen(false); }}
                className={"flex items-center justify-between rounded-lg px-4 py-4 text-base font-medium " + (active === link.label ? "bg-brand-50 text-brand-700" : "text-gray-700 hover:bg-brand-50")}>
                {link.label}
              </Link>
            </li>)}
          </ul>
        </nav>
      </div>
    </dialog>
    <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 lg:hidden">
      <WhatsAppButton iconOnly />
    </div>
    </>
  );
}
