import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product, SubCategory } from "@/types";
import { AddToQuoteButton } from "@/components/product/AddToQuoteButton";

interface ProductCardProps {
  product: Product;
  subCategory?: SubCategory;
  listView?: boolean;
}

export function ProductCard({ product, subCategory, listView = false }: ProductCardProps) {
  if (listView) {
    return (
      <article className="flex gap-4 rounded-xl border border-border bg-white p-4 shadow-sm">
        <Link className="relative hidden h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:block" href={`/product/${product.slug}`}>
          <Image alt={`${product.name} illustration`} className="object-contain p-3" fill sizes="96px" src={product.images[0]} />
        </Link>
        <div className="min-w-0 flex-1"><p className="font-mono text-xs font-bold text-accent">{product.modelNo}</p><Link href={`/product/${product.slug}`}><h3 className="mt-1 font-heading font-bold text-primary hover:text-accent">{product.name}</h3></Link><p className="mt-1 line-clamp-2 text-sm text-muted-text">{product.shortDescription}</p></div>
        <div className="flex shrink-0 items-center gap-2"><Link aria-label={`View details for ${product.name}`} className="hidden items-center gap-1 text-sm font-bold text-primary hover:text-accent sm:inline-flex" href={`/product/${product.slug}`}>View Details <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link><AddToQuoteButton id={product.id} name={product.name} slug={product.slug} /></div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link className="relative aspect-square overflow-hidden bg-muted" href={`/product/${product.slug}`}>
        <Image alt={`${product.name} illustration`} className="object-contain p-8 transition duration-300 group-hover:scale-105" fill sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw" src={product.images[0]} />
        {product.isNew ? <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-primary">New</span> : null}
      </Link>
      <div className="flex flex-1 flex-col p-4"><p className="font-mono text-xs font-bold text-accent">{product.modelNo}</p><Link className="mt-2" href={`/product/${product.slug}`}><h3 className="line-clamp-2 min-h-12 font-heading text-base font-bold text-primary hover:text-accent">{product.name}</h3></Link><p className="mt-2 text-xs font-semibold text-muted-text">{subCategory?.name ?? "Laboratory equipment"}</p><div className="mt-auto flex items-center justify-between gap-3 pt-5"><Link className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-accent" href={`/product/${product.slug}`}>View Details <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link><AddToQuoteButton id={product.id} name={product.name} slug={product.slug} /></div></div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return <div aria-hidden="true" className="animate-pulse overflow-hidden rounded-xl border border-border bg-white"><div className="aspect-square bg-muted" /><div className="space-y-3 p-4"><div className="h-3 w-20 rounded bg-muted" /><div className="h-5 w-4/5 rounded bg-muted" /><div className="h-4 w-2/5 rounded bg-muted" /></div></div>;
}
