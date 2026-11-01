import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

import { CatalogueShell } from "@/components/catalogue/CatalogueShell";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { ProductListing } from "@/components/catalogue/ProductListing";

import {
  getCategories,
  getCategory,
  getProducts,
  getSubCategoriesByCategory,
} from "@/lib/api";

import type { Audience, Product, SubCategory } from "@/types";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    q?: string;
    audience?: string;
    sort?: string;
    page?: string;
  }>;
}

const audiences: Audience[] = [
  "school",
  "college",
  "iti",
  "polytechnic",
  "industry",
];

export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory((await params).category);

  return category
    ? {
        title: category.name,
        description: category.description,
      }
    : {
        title: "Category Not Found",
      };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category: slug } = await params;
  const queryParams = await searchParams;

  // Fetch category details
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  // Search query
  const query = queryParams.q?.trim() ?? "";

  // Audience filter
  const audience = audiences.includes(queryParams.audience as Audience)
    ? (queryParams.audience as Audience)
    : undefined;

  // Sorting
  const sort = ["relevance", "name", "model", "newest"].includes(
    queryParams.sort ?? "",
  )
    ? (queryParams.sort as "relevance" | "name" | "model" | "newest")
    : undefined;

  // Pagination
  const page = Math.max(1, Number(queryParams.page) || 1);

  // Fetch subcategories
  const subCategories = await getSubCategoriesByCategory(slug);

  // Fetch subcategory counts
  const summaries = await Promise.all(
    subCategories.map(async (subCategory) => {
      const result = await getProducts({
        subCategory: subCategory.slug,
        pageSize: 1,
      });

      return {
        subCategory,
        count: result.total,
      };
    }),
  );

  // Fetch total products in category
  const categoryCountResult = await getProducts({
    category: slug,
    pageSize: 1,
  });

  const categoryCount = categoryCountResult.total;

  // Fetch all categories and their product counts
  const allCategories = await getCategories();

  const categorySummaries = await Promise.all(
    allCategories.map(async (item) => {
      const result = await getProducts({
        category: item.slug,
        pageSize: 1,
      });

      return {
        category: item,
        count: result.total,
      };
    }),
  );

  // Apply search and audience filters
  const filtered =
    query || audience
      ? await getProducts({
          category: slug,
          q: query || undefined,
          audience,
          sort,
          page,
          pageSize: 24,
        })
      : null;

  // Normal category display: group products by subcategory
  const grouped =
    filtered || subCategories.length === 0
      ? null
      : await Promise.all(
          subCategories.map(async (subCategory) => {
            const result = await getProducts({
              subCategory: subCategory.slug,
              pageSize: 8,
            });

            return {
              subCategory,
              products: result.items,
              total: result.total,
            };
          }),
        );

  // FALLBACK:
  // If a category has no subcategories, fetch its products
  // directly using the category slug.
  const categoryProducts =
    !filtered && subCategories.length === 0
      ? await getProducts({
          category: slug,
          page,
          pageSize: 24,
          sort,
        })
      : null;

  return (
    <CatalogueShell
      activeCategory={slug}
      categories={categorySummaries}
      subCategories={summaries}
      audience={audience}
      query={query}
      breadcrumbs={[
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Products",
          href: "/products",
        },
        {
          label: category.name,
        },
      ]}
      subtitle={category.description}
      title={category.name}
    >
      {/* SEARCH OR AUDIENCE FILTER RESULTS */}
      {filtered ? (
        <ProductListing
          page={filtered.page}
          products={filtered.items}
          subCategories={subCategories}
          total={filtered.total}
          totalPages={filtered.totalPages}
        />
      ) : categoryProducts ? (
        /* DIRECT CATEGORY PRODUCTS FALLBACK */
        <ProductListing
          page={categoryProducts.page}
          products={categoryProducts.items}
          subCategories={subCategories}
          total={categoryProducts.total}
          totalPages={categoryProducts.totalPages}
        />
      ) : (
        /* NORMAL SUBCATEGORY GROUPED DISPLAY */
        <div className="space-y-14">
          {grouped?.map((group) => (
            <SubCategoryGroup
              categorySlug={slug}
              key={group.subCategory.id}
              {...group}
            />
          ))}
        </div>
      )}

      {/* CATEGORY PRODUCT COUNT */}
      {!filtered && (
        <p className="mt-8 text-sm font-semibold text-muted-text">
          {categoryCount} products across {subCategories.length} subcategories
        </p>
      )}
    </CatalogueShell>
  );
}

// SUBCATEGORY PRODUCT GROUP
function SubCategoryGroup({
  categorySlug,
  subCategory,
  products,
  total,
}: {
  categorySlug: string;
  subCategory: SubCategory;
  products: Product[];
  total: number;
}) {
  return (
    <section className="scroll-mt-40" id={subCategory.slug}>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">
            {subCategory.name}
          </p>

          <p className="mt-1 text-sm text-muted-text">{total} products</p>
        </div>

        <Link
          className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-accent"
          href={`/products/${categorySlug}/${subCategory.slug}`}
        >
          View all
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex snap-x gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <div className="min-w-[78vw] snap-start sm:min-w-0" key={product.id}>
            <ProductCard product={product} subCategory={subCategory} />
          </div>
        ))}
      </div>
    </section>
  );
}
