"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import type { Audience, Category, Product } from "@/types";

const audienceOptions: { label: string; value: Audience | "all" }[] = [
  { label: "All institution types", value: "all" },
  { label: "Schools", value: "school" },
  { label: "Colleges & universities", value: "college" },
  { label: "ITIs", value: "iti" },
  { label: "Polytechnics", value: "polytechnic" },
  { label: "Industry", value: "industry" },
];

const useOptions = [
  { label: "Any intended use", value: "all" },
  { label: "Basic practical training", value: "basic" },
  { label: "Advanced experiments", value: "advanced" },
  { label: "Technical demonstration", value: "demonstration" },
] as const;

const useKeywords = {
  basic: ["basic", "fundamental", "introduction", "introductory", "practical", "learning", "educational"],
  advanced: ["advanced", "analysis", "measurement", "performance", "characteristic", "experiment", "response", "control"],
  demonstration: ["demonstrat", "trainer", "model", "panel", "demonstration", "demonstrator"],
};

interface LabSolutionFinderProps {
  categories: Category[];
  products: Product[];
  initialAudience: Audience | "all";
}

export function LabSolutionFinder({ categories, products, initialAudience }: LabSolutionFinderProps) {
  const [categorySlug, setCategorySlug] = useState("all");
  const [audience, setAudience] = useState<Audience | "all">(initialAudience);
  const [intendedUse, setIntendedUse] = useState<(typeof useOptions)[number]["value"]>("all");

  const matches = useMemo(() => {
    return products.filter((product) => {
      if (categorySlug !== "all" && product.categorySlug !== categorySlug) return false;
      if (audience !== "all" && !product.audience.includes(audience)) return false;
      if (intendedUse === "all") return true;

      const searchableContent = [
        product.name,
        product.shortDescription,
        product.description,
        ...product.features,
        ...(product.applications ?? []),
        ...(product.experiments ?? []),
        ...product.tags,
      ]
        .join(" ")
        .toLowerCase();

      return useKeywords[intendedUse].some((keyword) => searchableContent.includes(keyword));
    });
  }, [audience, categorySlug, intendedUse, products]);

  return (
    <section aria-labelledby="solution-finder-title" className="bg-muted py-14 sm:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Solution finder</p>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl" id="solution-finder-title">
            Find the Right Laboratory Solution
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-text">
            Tell us which discipline or training environment you are planning for, and explore the equipment categories that match your requirements.
          </p>
        </div>

        <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-white p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-bold text-primary" htmlFor="solution-discipline">Laboratory discipline</label>
            <select className="min-h-12 w-full rounded-lg border border-border bg-white px-3 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" id="solution-discipline" onChange={(event) => setCategorySlug(event.target.value)} value={categorySlug}>
              <option value="all">All disciplines</option>
              {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-primary" htmlFor="solution-institution">Institution type</label>
            <select className="min-h-12 w-full rounded-lg border border-border bg-white px-3 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" id="solution-institution" onChange={(event) => setAudience(event.target.value as Audience | "all")} value={audience}>
              {audienceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-primary" htmlFor="solution-use">Intended use</label>
            <select className="min-h-12 w-full rounded-lg border border-border bg-white px-3 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" id="solution-use" onChange={(event) => setIntendedUse(event.target.value as (typeof useOptions)[number]["value"])} value={intendedUse}>
              {useOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
        </div>

        <div aria-live="polite" className="mt-7">
          {matches.length ? (
            <>
              <p className="mb-4 text-sm font-semibold text-muted-text">{matches.length} catalogue {matches.length === 1 ? "product" : "products"} match your filters</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {matches.slice(0, 9).map((product) => {
                  const category = categories.find((item) => item.slug === product.categorySlug);
                  return (
                    <Link className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-white p-4 transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md" href={`/product/${product.slug}`} key={product.id}>
                      <span className="min-w-0">
                        <span className="block font-mono text-xs font-bold text-accent">{product.modelNo}</span>
                        <span className="mt-1 block font-heading text-sm font-bold text-primary group-hover:text-accent">{product.name}</span>
                        <span className="mt-1 block text-xs text-muted-text">{category?.name ?? "Laboratory equipment"}</span>
                      </span>
                      <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-accent transition-transform group-hover:translate-x-1" />
                    </Link>
                  );
                })}
              </div>
              {matches.length > 9 ? (
                <Link className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent" href={categorySlug === "all" ? "/products" : `/products/${categorySlug}`}>
                  View all matching products <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              ) : null}
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-white px-5 py-10 text-center">
              <Search aria-hidden="true" className="mx-auto h-7 w-7 text-accent" />
              <h3 className="mt-3 font-heading text-lg font-bold text-primary">No products match these filters</h3>
              <p className="mt-2 text-sm text-muted-text">Try another discipline, institution type, or intended use.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
