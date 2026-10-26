import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Atom, BatteryCharging, CircuitBoard, Cog, Cpu, FlaskConical, Gauge, Settings2, Table2, Zap } from "lucide-react";
import type { ComponentType } from "react";
import { CatalogueShell } from "@/components/catalogue/CatalogueShell";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { ProductListing } from "@/components/catalogue/ProductListing";
import { Container } from "@/components/shared/Container";
import { getCategories, getProducts, getProductsGroupedByCategory, getSubCategoriesByCategory } from "@/lib/api";
import type { Audience, Category, Product, SubCategory } from "@/types";

export const metadata: Metadata = { title: "Our Product Range", description: "Explore laboratory equipment for education and industry." };

const iconMap: Record<string, ComponentType<{ className?: string }>> = { Atom, BatteryCharging, CircuitBoard, Cog, Cpu, FlaskConical, Gauge, Settings2, Table2, Zap };
const audiences: Audience[] = ["school", "college", "iti", "polytechnic", "industry"];

interface ProductsPageProps { searchParams: Promise<{ q?: string; audience?: string; sort?: string; page?: string }>; }
interface CategorySummary { category: Category; count: number; }
interface SubCategorySummary { subCategory: SubCategory; count: number; }

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const audience = audiences.includes(params.audience as Audience) ? params.audience as Audience : undefined;
  const sort = ["relevance", "name", "model", "newest"].includes(params.sort ?? "") ? params.sort as "relevance" | "name" | "model" | "newest" : undefined;
  const page = Number.isFinite(Number(params.page)) ? Math.max(1, Number(params.page)) : 1;
  const categories = await getCategories();
  const categorySummaries: CategorySummary[] = await Promise.all(categories.map(async (category) => ({ category, count: (await getProducts({ category: category.slug, pageSize: 1 })).total })));
  const subCategorySummaries: SubCategorySummary[] = (await Promise.all(categories.flatMap((category) => getSubCategoriesByCategory(category.slug).then(async (items) => Promise.all(items.map(async (subCategory) => ({ subCategory, count: (await getProducts({ subCategory: subCategory.slug, pageSize: 1 })).total }))))))).flat();
  const isFiltered = Boolean(query || audience);
  const filteredProducts = isFiltered ? await getProducts({ q: query || undefined, audience, sort, page, pageSize: 24 }) : null;
  const grouped = isFiltered ? null : await getProductsGroupedByCategory(8);

  return (
    <CatalogueShell categories={categorySummaries} subCategories={subCategorySummaries} audience={audience} query={query} subtitle="Explore practical laboratory equipment for schools, colleges, polytechnics, ITIs and industry." title="Our Product Range">
      {isFiltered && filteredProducts ? <ProductListing page={filteredProducts.page} products={filteredProducts.items} subCategories={subCategorySummaries.map(({ subCategory }) => subCategory)} total={filteredProducts.total} totalPages={filteredProducts.totalPages} /> : <GroupedCatalogue groups={grouped ?? []} />}
      <section className="mt-16 rounded-2xl bg-primary px-6 py-10 text-white md:px-10"><Container className="flex flex-col items-start justify-between gap-6 p-0 md:flex-row md:items-center"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Need something specific?</p><h2 className="mt-2 font-heading text-2xl font-bold md:text-3xl">Can&apos;t find what you need?</h2><p className="mt-2 text-sm text-slate-200">Send us your lab requirement list and we&apos;ll help shape the right equipment set.</p></div><Link className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent-2 px-5 py-3 text-sm font-bold text-white hover:brightness-95" href="/quote">Send your requirement list <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></Container></section>
    </CatalogueShell>
  );
}

function GroupedCatalogue({ groups }: { groups: { category: Category; products: Product[]; total: number }[] }) {
  return <div className="space-y-14">{groups.map((group) => { const Icon = iconMap[group.category.icon] ?? CircuitBoard; return <section className="scroll-mt-40" id={group.category.slug} key={group.category.id}><div className="mb-5 flex items-end justify-between gap-4"><div><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-accent"><Icon aria-hidden="true" className="h-5 w-5" /></span><h2 className="font-heading text-2xl font-bold text-primary md:text-3xl">{group.category.name}</h2></div><p className="mt-2 text-sm text-muted-text">{group.total} products</p></div><Link className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary hover:text-accent" href={`/products/${group.category.slug}`}>View all <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></div><div className="flex snap-x gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 xl:grid-cols-4">{group.products.map((product) => <div className="min-w-[78vw] snap-start sm:min-w-0" key={product.id}><ProductCard product={product} /></div>)}</div></section>; })}</div>;
}
