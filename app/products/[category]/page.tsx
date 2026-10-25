import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { CatalogueShell } from "@/components/catalogue/CatalogueShell";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { ProductListing } from "@/components/catalogue/ProductListing";
import { getCategories, getCategory, getProducts, getSubCategoriesByCategory } from "@/lib/api";
import type { Audience, Product, SubCategory } from "@/types";

interface CategoryPageProps { params: Promise<{ category: string }>; searchParams: Promise<{ q?: string; audience?: string; sort?: string; page?: string }>; }
const audiences: Audience[] = ["school", "college", "iti", "polytechnic", "industry"];

export async function generateStaticParams() { return (await getCategories()).map((category) => ({ category: category.slug })); }

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory((await params).category);
  return category ? { title: category.name, description: category.description } : { title: "Category Not Found" };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category: slug } = await params;
  const queryParams = await searchParams;
  const category = await getCategory(slug);
  if (!category) notFound();
  const query = queryParams.q?.trim() ?? "";
  const audience = audiences.includes(queryParams.audience as Audience) ? queryParams.audience as Audience : undefined;
  const sort = ["relevance", "name", "model", "newest"].includes(queryParams.sort ?? "") ? queryParams.sort as "relevance" | "name" | "model" | "newest" : undefined;
  const page = Math.max(1, Number(queryParams.page) || 1);
  const subCategories = await getSubCategoriesByCategory(slug);
  const summaries = await Promise.all(subCategories.map(async (subCategory) => ({ subCategory, count: (await getProducts({ subCategory: subCategory.slug, pageSize: 1 })).total })));
  const categoryCount = (await getProducts({ category: slug, pageSize: 1 })).total;
  const allCategories = await getCategories();
  const categorySummaries = await Promise.all(allCategories.map(async (item) => ({ category: item, count: (await getProducts({ category: item.slug, pageSize: 1 })).total })));
  const filtered = query || audience ? await getProducts({ category: slug, q: query || undefined, audience, sort, page, pageSize: 24 }) : null;
  const grouped = filtered ? null : await Promise.all(subCategories.map(async (subCategory) => ({ subCategory, products: (await getProducts({ subCategory: subCategory.slug, pageSize: 8 })).items, total: (await getProducts({ subCategory: subCategory.slug, pageSize: 1 })).total })));

  return <CatalogueShell activeCategory={slug} categories={categorySummaries} subCategories={summaries} audience={audience} query={query} breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: category.name }]} subtitle={category.description} title={category.name}>
    {filtered ? <ProductListing page={filtered.page} products={filtered.items} subCategories={subCategories} total={filtered.total} totalPages={filtered.totalPages} /> : <div className="space-y-14">{grouped?.map((group) => <SubCategoryGroup categorySlug={slug} key={group.subCategory.id} {...group} />)}</div>}
    {!filtered ? <p className="mt-8 text-sm font-semibold text-muted-text">{categoryCount} products across {subCategories.length} subcategories</p> : null}
  </CatalogueShell>;
}

function SubCategoryGroup({ categorySlug, subCategory, products, total }: { categorySlug: string; subCategory: SubCategory; products: Product[]; total: number }) {
  return <section className="scroll-mt-40" id={subCategory.slug}><div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">{subCategory.name}</p><p className="mt-1 text-sm text-muted-text">{total} products</p></div><Link className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-accent" href={`/products/${categorySlug}/${subCategory.slug}`}>View all <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></div><div className="flex snap-x gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 xl:grid-cols-4">{products.map((product) => <div className="min-w-[78vw] snap-start sm:min-w-0" key={product.id}><ProductCard product={product} subCategory={subCategory} /></div>)}</div></section>;
}
