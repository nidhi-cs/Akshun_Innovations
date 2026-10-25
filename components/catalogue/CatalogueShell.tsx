"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Atom,
  BatteryCharging,
  ChevronDown,
  CircuitBoard,
  Cog,
  Cpu,
  FlaskConical,
  Gauge,
  Menu,
  Search,
  Settings2,
  Table2,
  X,
  Zap,
} from "lucide-react";
import type { ComponentType, FormEvent, PropsWithChildren } from "react";
import type { Audience, Category, SubCategory } from "@/types";
import { Container } from "@/components/shared/Container";

interface CategorySummary {
  category: Category;
  count: number;
}

interface SubCategorySummary {
  subCategory: SubCategory;
  count: number;
}

interface CatalogueShellProps extends PropsWithChildren {
  categories: CategorySummary[];
  subCategories: SubCategorySummary[];
  title: string;
  subtitle: string;
  breadcrumbs?: { label: string; href?: string }[];
  activeCategory?: string;
  activeSubCategory?: string;
  query?: string;
  audience?: Audience;
}

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Atom,
  BatteryCharging,
  CircuitBoard,
  Cog,
  Cpu,
  FlaskConical,
  Gauge,
  Settings2,
  Table2,
  Zap,
};

const audiences: { label: string; value: Audience }[] = [
  { label: "Schools", value: "school" },
  { label: "Colleges", value: "college" },
  { label: "ITIs", value: "iti" },
  { label: "Polytechnics", value: "polytechnic" },
  { label: "Industry", value: "industry" },
];

function updateParams(current: URLSearchParams, updates: Record<string, string | null>) {
  const next = new URLSearchParams(current.toString());
  Object.entries(updates).forEach(([key, value]) => {
    if (value) next.set(key, value);
    else next.delete(key);
  });
  next.delete("page");
  return next.toString();
}

export function CatalogueShell({
  categories,
  subCategories,
  title,
  subtitle,
  breadcrumbs = [{ label: "Home", href: "/" }, { label: "Products" }],
  activeCategory,
  activeSubCategory,
  query = "",
  audience,
  children,
}: CatalogueShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(query);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = updateParams(searchParams, { q: searchValue.trim() || null });
    router.push(params ? `/products?${params}` : "/products");
  }

  function chooseAudience(value: Audience) {
    const params = updateParams(searchParams, { audience: audience === value ? null : value });
    router.push(`${pathname}${params ? `?${params}` : ""}`);
    setMobileFiltersOpen(false);
  }

  function clearFilters() {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    router.push(params.toString() ? `${pathname}?${params}` : pathname);
    setMobileFiltersOpen(false);
  }

  const activeCategoryRecord = categories.find(({ category }) => category.slug === activeCategory)?.category;
  const activeFilterCount = Number(Boolean(query)) + Number(Boolean(audience)) + Number(Boolean(activeSubCategory));

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-primary py-8 text-white md:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,var(--accent)_1px,transparent_1px),linear-gradient(to_bottom,var(--accent)_1px,transparent_1px)] [background-size:42px_42px]" />
        <Container className="relative">
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-300">
            {breadcrumbs.map((breadcrumb, index) => (
              <span className="flex items-center gap-2" key={`${breadcrumb.label}-${index}`}>
                {breadcrumb.href ? <Link className="hover:text-white" href={breadcrumb.href}>{breadcrumb.label}</Link> : <span aria-current="page" className="text-white">{breadcrumb.label}</span>}
                {index < breadcrumbs.length - 1 ? <span aria-hidden="true">/</span> : null}
              </span>
            ))}
          </nav>
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-200">{subtitle}</p>
          <form className="mt-6 max-w-3xl" onSubmit={submitSearch} role="search">
            <label className="sr-only" htmlFor="catalogue-search">Search products</label>
            <div className="flex items-center rounded-xl bg-white p-1.5 shadow-xl">
              <Search aria-hidden="true" className="ml-3 h-5 w-5 shrink-0 text-muted-text" />
              <input className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3 text-sm text-text outline-none placeholder:text-muted-text" id="catalogue-search" onChange={(event) => setSearchValue(event.target.value)} placeholder="Search by product name or model no. (e.g. AKI-E101)" value={searchValue} />
              <button className="rounded-lg bg-accent-2 px-4 py-3 text-sm font-bold text-white hover:brightness-95" type="submit">Search</button>
            </div>
          </form>
        </Container>
      </section>

      <nav aria-label="Product categories" className="sticky top-20 z-30 border-b border-border bg-white/95 backdrop-blur">
        <Container className="relative">
          <div className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${!activeCategory ? "bg-primary text-white" : "bg-muted text-muted-text hover:text-primary"}`} href="/products">
              All Products
            </Link>
            {categories.map(({ category, count }) => {
              const Icon = iconMap[category.icon] ?? CircuitBoard;
              return <Link className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${activeCategory === category.slug ? "bg-primary text-white" : "bg-muted text-muted-text hover:text-primary"}`} href={`/products/${category.slug}`} key={category.id}><Icon aria-hidden="true" className="h-4 w-4" />{category.shortLabel}<span className="text-xs opacity-70">{count}</span></Link>;
            })}
          </div>
        </Container>
      </nav>

      <Container className="py-8 lg:py-10">
        <div className="mb-5 flex items-center justify-between lg:hidden">
          <button aria-expanded={mobileFiltersOpen} className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-bold text-primary" onClick={() => setMobileFiltersOpen(true)} type="button"><Menu aria-hidden="true" className="h-4 w-4" /> Filters{activeFilterCount ? ` (${activeFilterCount})` : ""}</button>
          {activeCategoryRecord ? <span className="text-sm font-semibold text-muted-text">{activeCategoryRecord.shortLabel}</span> : null}
        </div>
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <FilterPanel categories={categories} subCategories={subCategories} activeCategory={activeCategory} activeSubCategory={activeSubCategory} audience={audience} onAudience={chooseAudience} onClear={clearFilters} />
          </aside>
          <section className="min-w-0">
            {activeFilterCount ? <div className="mb-5 flex flex-wrap items-center gap-2" aria-label="Active filters"><span className="mr-1 text-sm font-semibold text-muted-text">Active:</span>{query ? <FilterChip label={`Search: ${query}`} onRemove={() => router.push(`${pathname}?${updateParams(searchParams, { q: null })}`)} /> : null}{audience ? <FilterChip label={audiences.find((item) => item.value === audience)?.label ?? audience} onRemove={() => chooseAudience(audience)} /> : null}{activeSubCategory ? <FilterChip label={subCategories.find(({ subCategory }) => subCategory.slug === activeSubCategory)?.subCategory.name ?? activeSubCategory} onRemove={() => router.push(`${pathname}?${updateParams(searchParams, { subCategory: null })}`)} /> : null}</div> : null}
            {children}
          </section>
        </div>
      </Container>

      {mobileFiltersOpen ? <div aria-modal="true" className="fixed inset-0 z-50 bg-primary/40 lg:hidden" role="dialog"><div className="absolute inset-y-0 left-0 w-[min(88vw,360px)] overflow-y-auto bg-white p-6 shadow-2xl"><div className="mb-6 flex items-center justify-between"><h2 className="font-heading text-xl font-bold text-primary">Filters</h2><button aria-label="Close filters" className="rounded-lg p-2 text-primary hover:bg-muted" onClick={() => setMobileFiltersOpen(false)} type="button"><X aria-hidden="true" className="h-5 w-5" /></button></div><FilterPanel categories={categories} subCategories={subCategories} activeCategory={activeCategory} activeSubCategory={activeSubCategory} audience={audience} onAudience={chooseAudience} onClear={clearFilters} /></div></div> : null}
    </main>
  );
}

function FilterPanel({ categories, subCategories, activeCategory, activeSubCategory, audience, onAudience, onClear }: Pick<CatalogueShellProps, "activeCategory" | "activeSubCategory" | "audience"> & { categories: CategorySummary[]; subCategories: SubCategorySummary[]; onAudience: (value: Audience) => void; onClear: () => void }) {
  const categorySubcategories = new Map<string, SubCategorySummary[]>();
  subCategories.forEach((item) => { const list = categorySubcategories.get(item.subCategory.categorySlug) ?? []; list.push(item); categorySubcategories.set(item.subCategory.categorySlug, list); });
  return <div><div className="flex items-center justify-between"><h2 className="font-heading text-lg font-bold text-primary">Categories</h2><button className="text-xs font-bold text-accent hover:text-primary" onClick={onClear} type="button">Clear all</button></div><div className="mt-4 space-y-2">{categories.map(({ category, count }) => <details className="group" key={category.id} open={activeCategory === category.slug}><summary className={`flex cursor-pointer list-none items-center justify-between rounded-lg px-2 py-2 text-sm font-bold ${activeCategory === category.slug ? "bg-muted text-primary" : "text-muted-text hover:text-primary"}`}><Link className="min-w-0 flex-1" href={`/products/${category.slug}`}>{category.shortLabel}</Link><span className="ml-2 flex items-center gap-1 text-xs font-normal"><span>{count}</span><ChevronDown aria-hidden="true" className="h-4 w-4 transition group-open:rotate-180" /></span></summary><div className="ml-3 border-l border-border pl-3">{(categorySubcategories.get(category.slug) ?? []).map(({ subCategory, count: subCount }) => <Link className={`block py-1.5 text-xs ${activeSubCategory === subCategory.slug ? "font-bold text-accent" : "text-muted-text hover:text-primary"}`} href={`/products/${category.slug}/${subCategory.slug}`} key={subCategory.id}>{subCategory.name} <span className="opacity-70">({subCount})</span></Link>)}</div></details>)}</div><fieldset className="mt-8 border-t border-border pt-6"><legend className="font-heading text-lg font-bold text-primary">Suitable for</legend><div className="mt-4 space-y-3">{audiences.map((item) => <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-text" key={item.value}><input checked={audience === item.value} className="h-4 w-4 accent-[var(--accent)]" onChange={() => onAudience(item.value)} type="checkbox" />{item.label}</label>)}</div></fieldset></div>;
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) { return <button className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-primary" onClick={onRemove} type="button">{label}<X aria-hidden="true" className="h-3.5 w-3.5" /></button>; }
