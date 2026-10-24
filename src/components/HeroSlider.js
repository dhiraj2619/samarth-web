"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBanners, selectBanners, selectBannersStatus } from "@/store/slices/bannersSlice";

// Quote slides are designed banners (2048x768) with their text baked in, so they are shown whole.
const AUTOPLAY_MS = 6000;

export default function HeroSlider() {
  const dispatch = useAppDispatch();
  const slides = useAppSelector(selectBanners).filter((slide) => slide?.image?.url);
  const status = useAppSelector(selectBannersStatus);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => { dispatch(fetchBanners()); }, [dispatch]);

  const next = useCallback(() => setCurrent((c) => (c + 1) % count), [count]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + count) % count), [count]);

  // Restart the timer whenever the slide changes so manual navigation gets a full interval
  useEffect(() => {
    if (paused || count < 2) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, next, current, count]);

  if (status === "idle" || status === "loading") {
    return <div className="aspect-2/1 w-full animate-pulse bg-brand-50 sm:aspect-2048/768" aria-hidden />;
  }
  if (count === 0) return null;

  const active = current % count;

  return (
    <section
      className="relative w-full overflow-hidden bg-[#fbf8f2]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="relative grid aspect-2/1 w-full sm:aspect-2048/768">
        {slides.map((slide, i) => (
          <div
            key={slide._id ?? i}
            className={`relative col-start-1 row-start-1 transition-opacity duration-1000 ${
              i === active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={i !== active}
          >
            <Image
              unoptimized
              src={slide.image.url}
              alt={`Samarth slide ${i + 1}`}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
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
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-5">
            {slides.map((slide, i) => (
              <button
                key={slide._id ?? i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  i === active ? "w-7 bg-earth-500" : "w-2.5 bg-white/90 ring-1 ring-gray-300 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
