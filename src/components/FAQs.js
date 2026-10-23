"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    q: "How do I buy Samarth products?",
    a: "Our products are sold online through Nohar. Open any product on this website and use the Buy Now button to continue to Nohar, or buy from one of our distributors.",
  },
  {
    q: "Do you offer discounts on bulk orders?",
    a: <>Yes. Visit the <Link href="/bulk-purchase" className="font-semibold text-brand-700 underline-offset-2 hover:underline">Bulk Purchase</Link> page to see current offers, their offer codes, minimum order amounts and eligible products.</>,
  },
  {
    q: "How do I use a bulk purchase offer code?",
    a: "Copy the offer code from the offer details, continue to Nohar with the Bulk Purchase button and apply the code at checkout. Make sure your order meets the minimum order amount for that offer.",
  },
  {
    q: "Where can I find a distributor near me?",
    a: <>See <Link href="/distributors" className="font-semibold text-brand-700 underline-offset-2 hover:underline">Our Distributors</Link> to search by name, city or pincode and contact a distributor directly.</>,
  },
  {
    q: "How can I become a Samarth distributor?",
    a: <>Send us your details through the <Link href="/contact" className="font-semibold text-brand-700 underline-offset-2 hover:underline">Contact Us</Link> form and our team will get in touch about partnership.</>,
  },
  {
    q: "How can I contact Samarth Enterprises?",
    a: <>Fill in the <Link href="/contact" className="font-semibold text-brand-700 underline-offset-2 hover:underline">Contact Us</Link> form or message us on WhatsApp. Our team will get back to you shortly.</>,
  },
];

export default function FAQs() {
  const [open, setOpen] = useState(0);
  return <section id="faqs" aria-labelledby="faqs-title" className="scroll-mt-20 bg-[#f8f7f2] py-12 sm:py-16 lg:py-20">
    <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_2fr] lg:px-8">
      <div>
        <span aria-hidden="true" className="mb-4 block h-1 w-12 rounded-full bg-brand-500" />
        <h2 id="faqs-title" className="text-2xl font-bold tracking-tight text-[#10212e] sm:text-3xl lg:text-4xl">Frequently Asked Questions</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base">Quick answers about buying, bulk offers and our distributors.</p>
        <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-700 px-5 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50">Still have questions? <span aria-hidden="true">→</span></Link>
      </div>
      <div className="divide-y divide-[#e5e4d9] rounded-2xl border border-[#e5e4d9] bg-white">
        {faqs.map(({ q, a }, index) => {
          const expanded = open === index;
          return <div key={q} className="px-5 sm:px-6">
            <h3>
              <button type="button" id={`faq-q-${index}`} aria-expanded={expanded} aria-controls={`faq-a-${index}`} onClick={() => setOpen(expanded ? null : index)} className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold text-brand-800 hover:text-brand-600">
                {q}
                <span aria-hidden="true" className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-lg leading-none transition-all duration-300 ease-out motion-reduce:transition-none ${expanded ? "rotate-45 bg-brand-700 text-white" : "bg-brand-50 text-brand-700"}`}>+</span>
              </button>
            </h3>
            <div id={`faq-a-${index}`} role="region" aria-labelledby={`faq-q-${index}`} inert={!expanded} className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <div className="overflow-hidden"><p className="pb-5 text-sm leading-relaxed text-gray-600">{a}</p></div>
            </div>
          </div>;
        })}
      </div>
    </div>
  </section>;
}
