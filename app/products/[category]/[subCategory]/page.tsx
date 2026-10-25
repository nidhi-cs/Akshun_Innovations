import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogueShell } from "@/components/catalogue/CatalogueShell";
import { ProductListing } from "@/components/catalogue/ProductListing";
import { getCategories, getCategory, getProducts, getSubCategoriesByCategory, getSubCategory } from "@/lib/api";
import type { Audience } from "@/types";

interface SubCategoryPageProps { params: Promise<{ category: string; subCategory: string }>; searchParams: Promise<{ q?: string; audience?: string; sort?: string; page?: string }>; }
const audiences: Audience[] = ["school", "college", "iti", "polytechnic", "industry"];

export async function generateStaticParams() {
  const categories = await getCategories();
  const params: { category: string; subCategory: string }[] = [];
  for (const category of categories) for (const subCategory of await getSubCategoriesByCategory(category.slug)) params.push({ category: category.slug, subCategory: subCategory.slug });
  return params;
}

export async function generateMetadata({ params }: SubCategoryPageProps): Promise<Metadata> {
  const { category: categorySlug, subCategory: subCategorySlug } = await params;
  const [category, subCategory] = await Promise.all([getCategory(categorySlug), getSubCategory(subCategorySlug)]);
  return category && subCategory && subCategory.categorySlug === category.slug ? { title: subCategory.name, description: subCategory.description } : { title: "Subcategory Not Found" };
}

export default async function SubCategoryPage({ params, searchParams }: SubCategoryPageProps) {
  const { category: categorySlug, subCategory: subCategorySlug } = await params;
  const queryParams = await searchParams;
  const [category, subCategory] = await Promise.all([getCategory(categorySlug), getSubCategory(subCategorySlug)]);
  if (!category || !subCategory || subCategory.categorySlug !== category.slug) notFound();
  const query = queryParams.q?.trim() ?? "";
  const audience = audiences.includes(queryParams.audience as Audience) ? queryParams.audience as Audience : undefined;
  const sort = ["relevance", "name", "model", "newest"].includes(queryParams.sort ?? "") ? queryParams.sort as "relevance" | "name" | "model" | "newest" : undefined;
  const page = Math.max(1, Number(queryParams.page) || 1);
  const [products, allCategories] = await Promise.all([getProducts({ category: categorySlug, subCategory: subCategorySlug, q: query || undefined, audience, sort, page, pageSize: 24 }), getCategories()]);
  const categorySummaries = await Promise.all(allCategories.map(async (item) => ({ category: item, count: (await getProducts({ category: item.slug, pageSize: 1 })).total })));
  const subCategorySummaries = await Promise.all((await getSubCategoriesByCategory(categorySlug)).map(async (item) => ({ subCategory: item, count: (await getProducts({ subCategory: item.slug, pageSize: 1 })).total })));

  return <CatalogueShell activeCategory={categorySlug} activeSubCategory={subCategorySlug} categories={categorySummaries} subCategories={subCategorySummaries} audience={audience} query={query} breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: category.name, href: `/products/${category.slug}` }, { label: subCategory.name }]} subtitle={subCategory.description} title={subCategory.name}>
    <ProductListing page={products.page} products={products.items} subCategories={subCategorySummaries.map(({ subCategory: item }) => item)} total={products.total} totalPages={products.totalPages} />
  </CatalogueShell>;
}
