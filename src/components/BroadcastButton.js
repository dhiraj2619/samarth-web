"use client";

import { useEffect, useRef, useState } from "react";

export default function BroadcastButton() {
  const [open, setOpen] = useState(false);
  const container = useRef(null);
  const button = useRef(null);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event) => {
      if (!container.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div ref={container} className="relative" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button
        ref={button}
        type="button"
        title="Broadcasts"
        aria-label="Broadcasts"
        aria-expanded={open}
        aria-controls="navbar-broadcasts"
        onClick={() => setOpen((value) => !value)}
        className={`flex h-10 w-10 items-center justify-center rounded-full border border-brand-100 text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${open ? "bg-brand-50" : "bg-white"}`}
      >
        <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 9h4l9-5v16l-9-5H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z" />
          <path d="m5 15 2 6h3l-2-6M8 9v6m12-7 2-1m-2 5h2m-2 4 2 1" />
        </svg>
      </button>
      {open && (
        <section id="navbar-broadcasts" aria-labelledby="navbar-broadcasts-title" className="absolute right-0 top-full mt-3 w-64 max-w-[calc(100vw-6rem)] rounded-xl border border-brand-100 bg-white p-5 shadow-lg">
          <h2 id="navbar-broadcasts-title" className="text-sm font-semibold text-brand-700">Broadcasts</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">Stay tuned for announcements from Samarth Enterprises.</p>
        </section>
      )}
    </div>
  );
}
