
import categoriesData from "@/data/categories.json";
import kitsData from "@/data/kits.json";
import labSolutionsData from "@/data/lab-solutions.json";
import productDetailContentData from "@/data/product-detail-content.json";
import productsData from "@/data/products.json";
import subcategoriesData from "@/data/subcategories.json";

import type {
  Category,
  SubCategory,
  Kit,
  LabSolution,
  Product,
  ProductPage,
  ProductFilters,
} from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

const categories = categoriesData as unknown as Category[];
const products = productsData as unknown as Product[];
const subcategories = subcategoriesData as unknown as SubCategory[];
const kits = kitsData as unknown as Kit[];
const labSolutions = labSolutionsData as unknown as LabSolution[];
const productDetailContent =
  productDetailContentData as unknown as Record<string, Partial<Product>>;

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

// API RESPONSE TYPES

interface ApiProductPage {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

interface ApiLabSolutions {
  items: LabSolution[];
  total: number;
}

interface ApiProductDetailContent {
  modelNo: string;
  images: string[];
  imageAlt: string;
}

interface ApiProductDetailResponse {
  items: ApiProductDetailContent[];
  total: number;
}

// PRODUCT DETAIL CONTENT — FETCHED FROM FASTAPI

async function fetchProductDetails(): Promise<
  Record<string, Partial<Product>>
> {
  const data = await fetchJson<ApiProductDetailResponse>(
    `${API_URL}/api/v1/product-detail-content`,
  );

  if (data?.items) {
    return Object.fromEntries(
      data.items.map((item) => [
        item.modelNo,
        {
          images: item.images,
          imageAlt: item.imageAlt,
        },
      ]),
    );
  }

  return productDetailContent;
}

// Merge product information with its additional detail content.
async function enrichProducts(
  products: Product[],
): Promise<Product[]> {
  const details = await fetchProductDetails();

  return products.map((product) => ({
    ...product,
    ...details[product.modelNo],
  }));
}

// FETCH A PAGE OF PRODUCTS FROM FASTAPI

async function fetchProductPage(
  page: number,
  pageSize: number,
  filters: Pick<ProductFilters, "q" | "category"> = {},
): Promise<ApiProductPage> {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("page_size", String(pageSize));

  if (filters.q?.trim()) {
    params.set("q", filters.q.trim());
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  const data = await fetchJson<ApiProductPage>(
    `${API_URL}/api/v1/products?${params.toString()}`,
  );

  if (data) {
    return data;
  }

  const filteredProducts = products.filter((product) => {
    if (filters.category && product.categorySlug !== filters.category) {
      return false;
    }

    if (!filters.q?.trim()) {
      return true;
    }

    const searchTerm = filters.q.trim().toLowerCase();
    return [
      product.name,
      product.modelNo,
      product.shortDescription,
      product.description,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm);
  });

  const total = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: filteredProducts.slice(start, start + pageSize),
    total,
    page: safePage,
    page_size: pageSize,
    total_pages: totalPages,
  };
}

// FETCH ALL MATCHING PRODUCT PAGES

async function getAllProducts(
  filters: Pick<ProductFilters, "q" | "category"> = {},
): Promise<Product[]> {
  const firstPage = await fetchProductPage(1, 100, filters);

  const remainingPages = await Promise.all(
    Array.from(
      { length: Math.max(0, firstPage.total_pages - 1) },
      (_, index) => fetchProductPage(index + 2, 100, filters),
    ),
  );

  const products = [
    ...firstPage.items,
    ...remainingPages.flatMap((page) => page.items),
  ];

  return enrichProducts(products);
}

// SORT PRODUCTS

function sortProducts(
  items: Product[],
  sort: ProductFilters["sort"],
): Product[] {
  return [...items].sort((left, right) => {
    if (sort === "name") {
      return left.name.localeCompare(right.name);
    }

    if (sort === "model") {
      return left.modelNo.localeCompare(right.modelNo);
    }

    if (sort === "newest") {
      return (
        Number(right.isNew) - Number(left.isNew) ||
        right.modelNo.localeCompare(left.modelNo)
      );
    }

    return (
      Number(right.isFeatured) - Number(left.isFeatured) ||
      left.name.localeCompare(right.name)
    );
  });
}

// CATEGORIES

export async function getCategories(): Promise<Category[]> {
  const data = await fetchJson<{ items: { slug: string }[]; total: number }>(
    `${API_URL}/api/v1/categories`,
  );

  if (data?.items) {
    return data.items
      .map((item) =>
        categories.find((category) => category.slug === item.slug),
      )
      .filter((category): category is Category => category !== undefined)
      .sort((left, right) => left.order - right.order);
  }

  return [...categories].sort((left, right) => left.order - right.order);
}

export async function getCategory(
  slug: string,
): Promise<Category | undefined> {
  return categories.find((category) => category.slug === slug);
}

// SUBCATEGORIES — FETCHED FROM FASTAPI

export async function getSubCategoriesByCategory(
  categorySlug: string,
): Promise<SubCategory[]> {
  const params = new URLSearchParams({
    category: categorySlug,
  });

  const data = await fetchJson<{ items: SubCategory[]; total: number }>(
    `${API_URL}/api/v1/subcategories?${params.toString()}`,
  );

  if (data?.items) {
    return data.items;
  }

  return [...subcategories]
    .filter((subcategory) => subcategory.categorySlug === categorySlug)
    .sort((left, right) => left.order - right.order);
}

export async function getSubCategory(
  slug: string,
): Promise<SubCategory | undefined> {
  const data = await fetchJson<{ items: SubCategory[]; total: number }>(
    `${API_URL}/api/v1/subcategories`,
  );

  if (data?.items) {
    return data.items.find((subcategory) => subcategory.slug === slug);
  }

  return subcategories.find((subcategory) => subcategory.slug === slug);
}

// PRODUCTS — FETCHED FROM FASTAPI

export async function getProducts(
  filters: ProductFilters = {},
): Promise<ProductPage> {
  const requestedPage = Math.max(1, filters.page ?? 1);
  const requestedPageSize = Math.max(1, filters.pageSize ?? 24);

  const needsClientFiltering = Boolean(
    filters.subCategory || filters.audience || filters.sort,
  );

  if (needsClientFiltering) {
    let allProducts = await getAllProducts({
      q: filters.q,
      category: filters.category,
    });

    if (filters.subCategory) {
      allProducts = allProducts.filter(
        (product) =>
          product.subCategorySlug === filters.subCategory,
      );
    }

    if (filters.audience) {
      allProducts = allProducts.filter((product) =>
        product.audience.includes(filters.audience!),
      );
    }

    const sorted = sortProducts(allProducts, filters.sort);
    const total = sorted.length;

    const totalPages = Math.max(
      1,
      Math.ceil(total / requestedPageSize),
    );

    const page = Math.min(requestedPage, totalPages);
    const start = (page - 1) * requestedPageSize;

    return {
      items: sorted.slice(start, start + requestedPageSize),
      total,
      page,
      pageSize: requestedPageSize,
      totalPages,
    };
  }

  const pageSize = Math.min(requestedPageSize, 100);

  const data = await fetchProductPage(
    requestedPage,
    pageSize,
    filters,
  );

  return {
    items: await enrichProducts(data.items),
    total: data.total,
    page: data.page,
    pageSize: data.page_size,
    totalPages: Math.max(1, data.total_pages),
  };
}

// PRODUCTS GROUPED BY CATEGORY

export async function getProductsGroupedByCategory(
  limitPerCategory = 8,
): Promise<
  { category: Category; products: Product[]; total: number }[]
> {
  const grouped = await Promise.all(
    categories.map(async (category) => {
      const result = await getProducts({
        category: category.slug,
        pageSize: limitPerCategory,
      });

      return {
        category,
        products: result.items,
        total: result.total,
      };
    }),
  );

  return grouped.filter((group) => group.total > 0);
}

// SINGLE PRODUCT

export async function getProduct(
  slug: string,
): Promise<Product | undefined> {
  const data = await fetchJson<Product>(
    `${API_URL}/api/v1/products/${encodeURIComponent(slug)}`,
  );

  if (data) {
    const enrichedProducts = await enrichProducts([data]);
    return enrichedProducts[0];
  }

  const product = products.find((candidate) => candidate.slug === slug);

  if (!product) {
    return undefined;
  }

  const enrichedProducts = await enrichProducts([product]);
  return enrichedProducts[0];
}

// FEATURED PRODUCTS

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getAllProducts();

  return products.filter((product) => product.isFeatured);
}

// NEW PRODUCTS

export async function getNewProducts(): Promise<Product[]> {
  const products = await getAllProducts();

  return products.filter((product) => product.isNew);
}

// KITS — FETCHED FROM FASTAPI

export async function getKits(): Promise<Kit[]> {
  const data = await fetchJson<{ items: Kit[]; total: number }>(
    `${API_URL}/api/v1/kits`,
  );

  if (data?.items) {
    return data.items;
  }

  return [...kits];
}

export async function getKit(
  slug: string,
): Promise<Kit | undefined> {
  const data = await fetchJson<Kit>(
    `${API_URL}/api/v1/kits/${encodeURIComponent(slug)}`,
  );

  if (data) {
    return data;
  }

  return kits.find((kit) => kit.slug === slug);
}

// LAB SOLUTIONS — FETCHED FROM FASTAPI

export async function getLabSolutions(): Promise<LabSolution[]> {
  const data = await fetchJson<ApiLabSolutions>(
    `${API_URL}/api/v1/lab-solutions`,
  );

  if (data?.items) {
    return data.items;
  }

  return [...labSolutions];
}

export async function getLabSolution(
  slug: string,
): Promise<LabSolution | undefined> {
  const data = await fetchJson<LabSolution>(
    `${API_URL}/api/v1/lab-solutions/${encodeURIComponent(slug)}`,
  );

  if (data) {
    return data;
  }

  return labSolutions.find((solution) => solution.slug === slug);
}

export async function getFeaturedLabSolutions(): Promise<
  LabSolution[]
> {
  const solutions = await getLabSolutions();

  return solutions.filter((solution) => solution.isFeatured);
}

// SEARCH PRODUCTS

export async function searchProducts(
  query: string,
): Promise<Product[]> {
  return getAllProducts({ q: query });
}

// RELATED PRODUCTS

export async function getRelatedProducts(
  slug: string,
  limit = 4,
): Promise<Product[]> {
  const product = await getProduct(slug);

  if (!product) {
    return [];
  }

  const allProducts = await getAllProducts();

  return allProducts
    .filter(
      (candidate) =>
        candidate.slug !== slug &&
        candidate.subCategorySlug === product.subCategorySlug,
    )
    .slice(0, limit);
}
