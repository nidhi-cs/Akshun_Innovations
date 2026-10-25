"use client";

import { Grid2X2, List, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Product, SubCategory } from "@/types";
import { ProductCard } from "@/components/catalogue/ProductCard";

interface ProductListingProps { products: Product[]; total: number; totalPages: number; page: number; subCategories: SubCategory[]; }

export function ProductListing({ products, total, totalPages, page, subCategories }: ProductListingProps) {
  const [listView, setListView] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "relevance";

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "relevance") params.delete("sort"); else params.set("sort", value);
    params.delete("page");
    router.push(`${pathname}${params.toString() ? `?${params}` : ""}`);
  }

  function pageHref(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) params.delete("page"); else params.set("page", String(nextPage));
    return `${pathname}${params.toString() ? `?${params}` : ""}`;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4"><p className="text-sm font-semibold text-muted-text">{total} {total === 1 ? "product" : "products"}</p><div className="flex items-center gap-2"><label className="sr-only" htmlFor="product-sort">Sort products</label><select className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-primary outline-none focus:border-accent" id="product-sort" onChange={(event) => setSort(event.target.value)} value={sort}><option value="relevance">Relevance</option><option value="name">Name A-Z</option><option value="model">Model No</option><option value="newest">Newest</option></select><button aria-label="Grid view" aria-pressed={!listView} className={`rounded-lg border p-2 ${!listView ? "border-primary bg-primary text-white" : "border-border text-muted-text"}`} onClick={() => setListView(false)} type="button"><Grid2X2 aria-hidden="true" className="h-4 w-4" /></button><button aria-label="List view" aria-pressed={listView} className={`rounded-lg border p-2 ${listView ? "border-primary bg-primary text-white" : "border-border text-muted-text"}`} onClick={() => setListView(true)} type="button"><List aria-hidden="true" className="h-4 w-4" /></button></div></div>
      {products.length ? <div className={listView ? "space-y-3" : "grid gap-4 sm:grid-cols-2 xl:grid-cols-4"}>{products.map((product) => <ProductCard key={product.id} listView={listView} product={product} subCategory={subCategories.find((item) => item.slug === product.subCategorySlug)} />)}</div> : <div className="rounded-2xl border border-dashed border-border bg-muted px-6 py-16 text-center"><SlidersHorizontal aria-hidden="true" className="mx-auto h-8 w-8 text-accent" /><h2 className="mt-4 font-heading text-2xl font-bold text-primary">No products found</h2><p className="mt-2 text-sm text-muted-text">Try clearing a filter or searching with a different term.</p><Link className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white" href={pathname}>Clear filters</Link></div>}
      {totalPages > 1 ? <nav aria-label="Product pagination" className="mt-8 flex flex-wrap justify-center gap-2">{Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <Link aria-current={number === page ? "page" : undefined} className={`rounded-lg px-3 py-2 text-sm font-bold ${number === page ? "bg-primary text-white" : "border border-border bg-white text-primary hover:border-accent"}`} href={pageHref(number)} key={number}>{number}</Link>)}</nav> : null}
    </div>
  );
}
