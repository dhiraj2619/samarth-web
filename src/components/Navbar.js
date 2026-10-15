"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import WhatsAppButton from "./WhatsAppButton";
import BroadcastButton from "./BroadcastButton";

const links = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "#collections" },
  { label: "Bulk Purchase", href: "#bulk-purchase" },
  { label: "Our Distributors", href: "#our-distributors" },
  { label: "Contact Us", href: "#contact" },

];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Home");

  return (
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
          aria-label="Toggle menu"
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

      {/* Mobile menu */}
      <div
        className={`overflow-hidden bg-white transition-[max-height] duration-300 lg:hidden ${
          open ? "max-h-[32rem] border-t border-brand-100" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col px-4 py-3">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => {
                  setActive(link.label);
                  setOpen(false);
                }}
                className={`block rounded-md px-3 py-3 font-medium ${
                  active === link.label ? "bg-brand-50 text-brand-700" : "text-gray-700 hover:bg-brand-50"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="px-3 pb-2 pt-3">
            <WhatsAppButton className="w-full justify-center" />
          </li>
        </ul>
      </div>
    </header>
  );
}
