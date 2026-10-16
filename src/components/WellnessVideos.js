"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Put the .mp4 files (and optional .jpg cover images) in public/videos/.
// Without a poster, the card shows the video's first frame.
const VIDEOS = [
  { title: "Diamond Energizer Capsules", src: "/videos/diamond-energizer-capsules.mp4", poster: "" },
  { title: "Samarth 18 Herbs Hair Oil", src: "/videos/samarth-18-herbs-hair-oil.mp4", poster: "" },
  { title: "Trust All Is Well Caps", src: "/videos/trust-all-is-well-caps.mp4", poster: "" },
];

function Chevron({ direction }) {
  return <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} /></svg>;
}

function PlayBadge() {
  return <span aria-hidden="true" className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-transform group-hover:scale-110 motion-reduce:transform-none sm:h-[70px] sm:w-[70px]">
    <svg className="ml-1 h-7 w-7 text-brand-500" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.52.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 7 4.5Z" /></svg>
  </span>;
}

export default function WellnessVideos() {
  const track = useRef(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);
  const [playing, setPlaying] = useState(null);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const count = Math.max(1, Math.ceil((el.scrollWidth - 2) / el.clientWidth));
    setPages(count);
    setPage(el.scrollLeft >= max - 2 ? count - 1 : Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const goTo = (index) => {
    const el = track.current;
    const target = Math.max(0, Math.min(index, pages - 1));
    el.scrollTo({ left: Math.min(target * el.clientWidth, el.scrollWidth - el.clientWidth), behavior: "smooth" });
  };

  if (!VIDEOS.length) return null;

  return <section id="wellness-videos" aria-labelledby="wellness-videos-title" className="bg-white py-12 sm:py-16">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative mb-8 flex flex-col items-center sm:mb-10">
        <h2 id="wellness-videos-title" className="text-center text-2xl font-medium tracking-tight text-[#102a2e] sm:text-3xl lg:text-4xl">Your Wellness Solutions</h2>
        <span aria-hidden="true" className="mt-3 block h-1 w-16 rounded-full bg-brand-500" />
        {pages > 1 && <div className="mt-5 flex gap-3 sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2">
          <button type="button" onClick={() => goTo(page - 1)} disabled={page === 0} aria-label="Previous videos" className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 transition-colors hover:border-brand-500 hover:text-brand-600 disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-800"><Chevron direction="left" /></button>
          <button type="button" onClick={() => goTo(page + 1)} disabled={page === pages - 1} aria-label="Next videos" className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 transition-colors hover:border-brand-500 hover:text-brand-600 disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-800"><Chevron direction="right" /></button>
        </div>}
      </div>

      <ul ref={track} onScroll={measure} className="-mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 pb-4 [scrollbar-width:none] sm:gap-6 lg:gap-10 [&::-webkit-scrollbar]:hidden">
        {VIDEOS.map(video => <li key={video.src} className="w-full shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-5rem)/3)]">
          <button type="button" onClick={() => setPlaying(video)} aria-label={`Play video: ${video.title}`} className="group block w-full overflow-hidden rounded-2xl border border-gray-100 bg-white text-left shadow-[0_8px_28px_-18px_rgba(34,65,45,0.35)] transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600">
            <span className="relative block aspect-video overflow-hidden bg-[#1f2a22]">
              <video src={`${video.src}#t=0.5`} poster={video.poster || undefined} preload="metadata" muted playsInline tabIndex={-1} aria-hidden="true" className="pointer-events-none h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" />
              <PlayBadge />
            </span>
            <span className="block px-5 py-6 text-lg text-[#172938] sm:text-xl">{video.title}</span>
          </button>
        </li>)}
      </ul>

      {pages > 1 && <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: pages }, (_, index) => <button key={index} type="button" onClick={() => goTo(index)} aria-label={`Show video page ${index + 1}`} aria-current={index === page ? "true" : undefined} className={`h-2.5 w-2.5 rounded-full transition-colors ${index === page ? "bg-brand-500" : "bg-gray-300 hover:bg-gray-400"}`} />)}
      </div>}
    </div>
    {playing && <VideoPlayer video={playing} onClose={() => setPlaying(null)} />}
  </section>;
}

function VideoPlayer({ video, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => { element.close(); document.body.style.overflow = previousOverflow; trigger?.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={dialog} aria-label={video.title} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }} className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-4xl overflow-hidden rounded-2xl border-0 bg-black p-0 shadow-2xl backdrop:bg-black/70">
    <div className="flex items-center justify-between gap-4 bg-white px-5 py-3">
      <h2 className="text-base font-semibold text-brand-800 sm:text-lg">{video.title}</h2>
      <button type="button" onClick={onClose} aria-label="Close video" className="rounded-full px-3 py-1 text-2xl leading-none text-brand-700 hover:bg-brand-50">×</button>
    </div>
    <video src={video.src} poster={video.poster || undefined} controls autoPlay playsInline className="block max-h-[78dvh] w-full bg-black object-contain" />
  </dialog>;
}
