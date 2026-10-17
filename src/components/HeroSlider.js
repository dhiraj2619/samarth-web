"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Placeholder images — swap for real product photography later
const slides = [
  {
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80",
    eyebrow: ["Quality Products", "Trusted Partner"],
    title: "Reliable Products.",
    highlight: "For a Healthier Tomorrow.",
    text: "Samarth Enterprises offers a wide range of quality products for your business needs. Explore our collections and connect with us for bulk requirements.",
  },
  {
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1920&q=80",
    eyebrow: ["Pure Ingredients", "Natural Goodness"],
    title: "Nature's Best.",
    highlight: "Sourced With Care.",
    text: "From aromatic spices to wholesome dry fruits, every product is carefully selected and packed to retain freshness and flavour.",
  },
  {
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&q=80",
    eyebrow: ["Bulk Supply", "Timely Delivery"],
    title: "Bulk Orders.",
    highlight: "Made Simple.",
    text: "Competitive pricing, consistent quality and dependable delivery for retailers, distributors and businesses of every size.",
  },
];

const AUTOPLAY_MS = 6000;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  // Restart the timer whenever the slide changes so manual navigation gets a full interval
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, next, current]);

  return (
    <section
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="relative grid min-h-[calc(100svh-5rem-1px)]">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`relative col-start-1 row-start-1 min-w-0 transition-opacity duration-1000 ${
              i === current ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={i !== current}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover object-right transition-transform duration-[7000ms] ease-out ${
                i === current ? "scale-105" : "scale-100"
              }`}
            />
            {/* Soft cream fade so text stays readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#fbf8f2] via-[#fbf8f2]/85 to-[#fbf8f2]/10" />
            {/* Decorative earthy blob, bottom-left */}
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-earth-400/30 blur-2xl" />

            {i === current && (
              <div className="relative z-10 flex h-full items-center py-16 sm:py-20">
                <div className="mx-auto w-full max-w-7xl px-6 sm:px-16 lg:px-20">
                  <div className="max-w-xl">
                    <p className="fade-up mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-gray-700 sm:text-sm">
                      {slide.eyebrow[0]}
                      <span className="h-4 w-px bg-earth-500" />
                      {slide.eyebrow[1]}
                    </p>
                    <h1
                      className="fade-up text-3xl font-bold leading-tight text-brand-700 sm:text-4xl lg:text-5xl"
                      style={{ animationDelay: "120ms" }}
                    >
                      {slide.title}
                      <br />
                      <span className="text-earth-500">{slide.highlight}</span>
                    </h1>
                    <p
                      className="fade-up mt-5 max-w-md text-sm leading-relaxed text-gray-700 sm:text-base"
                      style={{ animationDelay: "240ms" }}
                    >
                      {slide.text}
                    </p>
                    <div className="fade-up mt-8 flex flex-wrap gap-4" style={{ animationDelay: "360ms" }}>
                      <Link
                        href="#collections"
                        className="group inline-flex items-center gap-2 rounded-full bg-earth-500 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-earth-500/30 transition-all hover:-translate-y-0.5 hover:bg-earth-600"
                      >
                        Explore Collections
                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                        </svg>
                      </Link>
                      <Link
                        href="/bulk-purchase"
                        className="inline-flex items-center rounded-full border-2 border-brand-600 bg-white/60 px-7 py-3 text-sm font-semibold text-brand-700 transition-all hover:bg-brand-600 hover:text-white"
                      >
                        Request Bulk Quote
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-700 shadow-md transition hover:bg-brand-600 hover:text-white sm:flex"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-700 shadow-md transition hover:bg-brand-600 hover:text-white sm:flex"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              i === current ? "w-7 bg-earth-500" : "w-2.5 bg-white/90 ring-1 ring-gray-300 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
