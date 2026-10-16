import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { getCategory, getCategoryProducts } from "@/lib/catalog";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const category = await getCategory(id).catch(() => null);
  if (!category) return { title: "Category not found | Samarth Enterprises" };
  return {
    title: `${category.name} | Samarth Enterprises`,
    description: category.description || `Explore ${category.name} from Samarth Enterprises.`,
  };
}

export default function CategoryPage({ params }) {
  return (
    <>
      <Navbar activeLink="Categories" />
      <main className="flex-1 bg-[#f8f7f2] py-8 sm:py-12">
        <Suspense fallback={<CategorySkeleton />}>
          <CategoryProducts params={params} />
        </Suspense>
      </main>
    </>
  );
}

async function CategoryProducts({ params }) {
  const { id } = await params;
  const category = await getCategory(id);
  if (!category) notFound();
  const products = await getCategoryProducts(id);

  return <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link href="/" className="hover:text-brand-700">Home</Link></li>
        <li aria-hidden="true">/</li>
        <li><Link href="/#categories" className="hover:text-brand-700">Categories</Link></li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-gray-700">{category.name}</li>
      </ol>
    </nav>

    <span aria-hidden="true" className="mb-4 block h-1 w-12 rounded-full bg-brand-500" />
    <h1 className="text-2xl font-bold tracking-tight text-[#10212e] sm:text-3xl lg:text-4xl">{category.name}</h1>
    <p className="mt-2 text-sm text-gray-500 sm:text-base">
      {category.description || `${products.length} ${products.length === 1 ? "product" : "products"}`}
    </p>

    {products.length
      ? <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {products.map(product => <li key={product._id}><ProductCard product={product} /></li>)}
      </ul>
      : <div className="mt-8 rounded-2xl border border-[#e2dfd6] bg-white p-8 text-center">
        <p className="text-gray-600">Products in this category are coming soon.</p>
        <Link href="/#categories" className="mt-4 inline-block font-semibold text-brand-700 hover:text-brand-800">Browse other categories</Link>
      </div>}
  </div>;
}

function CategorySkeleton() {
  return <div role="status" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <span className="sr-only">Loading products</span>
    <div aria-hidden="true">
      <div className="mb-6 h-4 w-48 animate-pulse rounded bg-gray-200 motion-reduce:animate-none" />
      <div className="h-9 w-64 animate-pulse rounded bg-gray-200 motion-reduce:animate-none" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {[0, 1, 2, 3].map(key => <div key={key} className="rounded-2xl border border-[#f1e6d6] bg-white p-5"><div className="aspect-square animate-pulse rounded-xl bg-gray-100 motion-reduce:animate-none" /><div className="mt-5 h-5 w-3/4 rounded bg-gray-100" /><div className="mt-3 h-12 rounded bg-gray-50" /></div>)}
      </div>
    </div>
  </div>;
}
