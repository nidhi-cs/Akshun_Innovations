import categoriesData from "@/data/categories.json";
import subcategoriesData from "@/data/subcategories.json";
import kitsData from "@/data/kits.json";
import labSolutionsData from "@/data/lab-solutions.json";
import productsData from "@/data/products.json";
import type {
  Category,
  SubCategory,
  Kit,
  LabSolution,
  Product,
  ProductPage,
  ProductFilters,
} from "@/types";

const categories = categoriesData as Category[];
const subcategories = subcategoriesData as SubCategory[];
const products = productsData as unknown as Product[];
const kits = kitsData as unknown as Kit[];
const labSolutions = labSolutionsData as LabSolution[];

/*
 * API migration note:
 * Replace each local lookup below with fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/...`)
 * and keep the exported function signatures stable so components do not change.
 */

export async function getCategories(): Promise<Category[]> {
  return [...categories].sort((left, right) => left.order - right.order);
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return categories.find((category) => category.slug === slug);
}

export async function getSubCategoriesByCategory(categorySlug: string): Promise<SubCategory[]> {
  return subcategories
    .filter((subcategory) => subcategory.categorySlug === categorySlug)
    .sort((left, right) => left.order - right.order);
}

export async function getSubCategory(slug: string): Promise<SubCategory | undefined> {
  return subcategories.find((subcategory) => subcategory.slug === slug);
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductPage> {
  const pageSize = Math.max(1, filters.pageSize ?? 24);
  const page = Math.max(1, filters.page ?? 1);
  const query = filters.q?.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const category = categories.find((item) => item.slug === product.categorySlug);
    const subcategory = subcategories.find((item) => item.slug === product.subCategorySlug);
    const matchesCategory = !filters.category || product.categorySlug === filters.category;
    const matchesSubCategory = !filters.subCategory || product.subCategorySlug === filters.subCategory;
    const matchesAudience = !filters.audience || product.audience.includes(filters.audience);
    const matchesQuery =
      !query ||
      [product.name, product.modelNo, product.shortDescription, ...product.tags, category?.name ?? "", subcategory?.name ?? ""].some((value) =>
        value.toLowerCase().includes(query),
      );

    return matchesCategory && matchesSubCategory && matchesAudience && matchesQuery;
  });

  const sorted = [...filtered].sort((left, right) => {
    if (filters.sort === "name") return left.name.localeCompare(right.name);
    if (filters.sort === "model") return left.modelNo.localeCompare(right.modelNo);
    if (filters.sort === "newest") return Number(right.isNew) - Number(left.isNew) || right.modelNo.localeCompare(left.modelNo);
    return Number(right.isFeatured) - Number(left.isFeatured) || left.name.localeCompare(right.name);
  });

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return { items: sorted.slice(start, start + pageSize), total, page: safePage, pageSize, totalPages };
}

export async function getProductsGroupedByCategory(limitPerCategory = 8): Promise<
  { category: Category; products: Product[]; total: number }[]
> {
  const grouped = await Promise.all(
    categories.map(async (category) => {
      const result = await getProducts({ category: category.slug, pageSize: limitPerCategory });
      return { category, products: result.items, total: result.total };
    }),
  );
  return grouped.filter((group) => group.total > 0);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return products.find((product) => product.slug === slug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return products.filter((product) => product.isFeatured);
}

export async function getNewProducts(): Promise<Product[]> {
  return products.filter((product) => product.isNew);
}

export async function getKits(): Promise<Kit[]> {
  return kits;
}

export async function getKit(slug: string): Promise<Kit | undefined> {
  return kits.find((kit) => kit.slug === slug);
}

export async function getLabSolutions(): Promise<LabSolution[]> {
  return labSolutions;
}

export async function getLabSolution(slug: string): Promise<LabSolution | undefined> {
  return labSolutions.find((solution) => solution.slug === slug);
}

export async function getFeaturedLabSolutions(): Promise<LabSolution[]> {
  return labSolutions.filter((solution) => solution.isFeatured);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const result = await getProducts({ q: query, pageSize: products.length });
  return result.items;
}

export async function getRelatedProducts(slug: string, limit = 4): Promise<Product[]> {
  const product = await getProduct(slug);
  if (!product) return [];
  return products
    .filter((candidate) => candidate.slug !== slug && candidate.subCategorySlug === product.subCategorySlug)
    .slice(0, limit);
}
