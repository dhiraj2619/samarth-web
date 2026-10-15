const features = [
  {
    title: "Wide Product Range",
    text: "Quality products for every need",
    icon: "M21 7.5 12 3 3 7.5m18 0-9 4.5m9-4.5v9L12 21m0-9L3 7.5m9 4.5v9M3 7.5v9L12 21",
  },
  {
    title: "Trusted & Reliable",
    text: "Building long-term relationships",
    icon: "M9 12.75 11.25 15 15 9.75M12 3l7.5 3v5.25c0 4.5-3.2 8.4-7.5 9.75-4.3-1.35-7.5-5.25-7.5-9.75V6L12 3Z",
  },
  {
    title: "Bulk Supply",
    text: "Competitive pricing & timely delivery",
    icon: "M2 6h11v10H2zM13 9h4l3 3.5V16h-7zM6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm11 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  },
  {
    title: "Dedicated Support",
    text: "Always here to help",
    icon: "M3 14v-2a9 9 0 0 1 18 0v2M3 14a2 2 0 0 1 2-2h1v6H5a2 2 0 0 1-2-2v-2Zm18 0a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2v-2Zm-3 4v1a3 3 0 0 1-3 3h-3",
  },
];

export default function Features() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-brand-100">
        {features.map((f) => (
          <div key={f.title} className="group flex items-center gap-4 lg:justify-center lg:px-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-earth-50 text-earth-500 transition-colors group-hover:bg-brand-600 group-hover:text-white">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
              </svg>
            </span>
            <div>
              <h3 className="font-semibold text-brand-800">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
