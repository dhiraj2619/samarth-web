import Link from "next/link";

// Full-width banner for inner pages (Bulk Purchase, Our Distributors).
export default function PageHero({ breadcrumb, eyebrow, title, highlight, description, cta }) {
  return <section className="relative isolate overflow-hidden bg-brand-800 text-white">
    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_20%,rgba(233,149,56,0.28),transparent_45%),radial-gradient(circle_at_10%_90%,rgba(31,138,61,0.55),transparent_50%)]" />
    <svg aria-hidden="true" className="absolute -right-16 -top-10 -z-10 h-80 w-80 text-white/5 sm:h-[28rem] sm:w-[28rem]" viewBox="0 0 200 200" fill="currentColor"><path d="M100 10c40 30 70 70 60 120-8 40-40 60-60 60s-52-20-60-60C30 80 60 40 100 10Z" /></svg>
    <svg aria-hidden="true" className="absolute -bottom-24 right-1/3 -z-10 h-64 w-64 rotate-45 text-white/5" viewBox="0 0 200 200" fill="currentColor"><path d="M100 10c40 30 70 70 60 120-8 40-40 60-60 60s-52-20-60-60C30 80 60 40 100 10Z" /></svg>
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-white/60"><Link href="/" className="hover:text-white">Home</Link><span aria-hidden="true">/</span><span className="text-white">{breadcrumb}</span></nav>
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <p className="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#f0b46a]"><span className="h-px w-9 bg-[#e99538]" />{eyebrow}</p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{title}<br /><span className="text-[#f0b46a]">{highlight}</span></h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">{description}</p>
        </div>
        {cta && <Link href={cta.href} className="inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-50">{cta.label} <span aria-hidden="true">↗</span></Link>}
      </div>
    </div>
  </section>;
}
