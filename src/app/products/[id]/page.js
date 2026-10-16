import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { getCategoryProducts, getProduct } from "@/lib/catalog";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id).catch(() => null);
  if (!product) return { title: "Product not found | Samarth Enterprises" };
  const description = product.seo?.metaDescription || product.description?.slice(0, 160);
  const image = product.socialShare?.ogImageUrl || product.images?.[0]?.url;
  return {
    title: product.seo?.titleTag || `${product.name} | Samarth Enterprises`,
    description,
    keywords: product.seo?.keywords || undefined,
    robots: product.seo?.metaRobots || undefined,
    alternates: product.seo?.canonicalUrl ? { canonical: product.seo.canonicalUrl } : undefined,
    openGraph: {
      title: product.socialShare?.ogTitle || product.name,
      description: product.socialShare?.ogDescription || description,
      images: image ? [image] : undefined,
    },
  };
}

export default function ProductPage({ params }) {
  return (
    <>
      <Navbar activeLink="Categories" />
      <main className="flex-1 bg-[#f8f7f2] py-8 sm:py-12">
        <Suspense fallback={<ProductSkeleton />}>
          <ProductDetail params={params} />
        </Suspense>
      </main>
    </>
  );
}

function ExternalIcon() {
  return <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 4h6v6m0-6L10 14M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>;
}

async function ProductDetail({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const category = product.categoryId;
  const related = category?._id
    ? (await getCategoryProducts(category._id).catch(() => [])).filter(item => item._id !== product._id).slice(0, 4)
    : [];
  const bulkExternal = Boolean(product.bulkPurchaseUrl);

  return <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link href="/" className="hover:text-brand-700">Home</Link></li>
        {category?._id && <><li aria-hidden="true">/</li><li><Link href={`/categories/${category._id}`} className="hover:text-brand-700">{category.name}</Link></li></>}
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="line-clamp-1 text-gray-700">{product.name}</li>
      </ol>
    </nav>

    <article className="grid gap-8 rounded-2xl bg-white p-5 sm:p-8 lg:grid-cols-2 lg:gap-12">
      <ProductGallery images={product.images || []} name={product.name} />

      <div className="flex flex-col">
        {category?.name && <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-600">{category.name}</p>}
        <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-[#102a2e] sm:text-3xl lg:text-4xl">{product.name}</h1>
        <p className={`mt-4 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${product.inStock === false ? "bg-earth-50 text-earth-600" : "bg-brand-50 text-brand-700"}`}>
          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${product.inStock === false ? "bg-earth-500" : "bg-brand-500"}`} />
          {product.inStock === false ? "Currently out of stock" : "In stock"}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {product.buyNowUrl && <a href={product.buyNowUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700">
            Buy Now <ExternalIcon />
          </a>}
          <a href={bulkExternal ? product.bulkPurchaseUrl : "/contact"} {...(bulkExternal && { target: "_blank", rel: "noopener noreferrer" })} className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#ee9735] px-7 py-3 text-base font-semibold text-[#c46f12] transition-colors hover:bg-[#ee9735] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ee9735]">
            Bulk Purchase {bulkExternal && <ExternalIcon />}
          </a>
        </div>

        <div className="mt-8 border-t border-[#f1e6d6] pt-6">
          <h2 className="text-lg font-semibold text-brand-800">Description</h2>
          <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-gray-600">{product.description}</p>
        </div>
      </div>
    </article>

    {product.guideImage?.url && <section aria-labelledby="guide-title" className="mt-8 rounded-2xl bg-white p-5 sm:p-8">
      <h2 id="guide-title" className="text-xl font-semibold text-brand-800">How to use</h2>
      <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-xl bg-[#f8f7f2]">
        <Image unoptimized src={product.guideImage.url} alt={`How to use ${product.name}`} fill sizes="(max-width: 1280px) 100vw, 1200px" className="object-contain" />
      </div>
    </section>}

    {related.length > 0 && <section aria-labelledby="related-title" className="mt-12">
      <div className="flex items-end justify-between gap-4">
        <h2 id="related-title" className="text-2xl font-semibold tracking-tight text-[#102a2e]">More from {category.name}</h2>
        <Link href={`/categories/${category._id}`} className="shrink-0 text-sm font-semibold text-brand-700 hover:text-brand-800">View all</Link>
      </div>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {related.map(item => <li key={item._id}><ProductCard product={item} /></li>)}
      </ul>
    </section>}
  </div>;
}

function ProductSkeleton() {
  return <div role="status" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <span className="sr-only">Loading product</span>
    <div aria-hidden="true" className="mb-6 h-4 w-48 animate-pulse rounded bg-gray-200 motion-reduce:animate-none" />
    <div aria-hidden="true" className="grid gap-8 rounded-2xl bg-white p-5 sm:p-8 lg:grid-cols-2 lg:gap-12">
      <div className="aspect-square animate-pulse rounded-2xl bg-gray-100 motion-reduce:animate-none" />
      <div className="space-y-4">
        <div className="h-3 w-24 rounded bg-gray-100" />
        <div className="h-9 w-3/4 animate-pulse rounded bg-gray-100 motion-reduce:animate-none" />
        <div className="flex gap-3 pt-4"><div className="h-12 w-36 rounded-lg bg-gray-100" /><div className="h-12 w-40 rounded-lg bg-gray-100" /></div>
        <div className="space-y-2 pt-6">{[0, 1, 2, 3, 4].map(key => <div key={key} className="h-4 rounded bg-gray-50" />)}</div>
      </div>
    </div>
  </div>;
}
