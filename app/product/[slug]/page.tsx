import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { getCategory, getProduct, getProducts, getSubCategory } from "@/lib/api";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const result = await getProducts({ pageSize: 1000 });
  return result.items.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return product ? { title: product.name, description: product.shortDescription } : { title: "Product Not Found" };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const subcategory = await getSubCategory(product.subCategorySlug);
  const category = await getCategory(product.categorySlug);
  if (!category || !subcategory) notFound();

  return (
    <main>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: category.name, href: `/products/${category.slug}` },
          { label: subcategory.name, href: `/products/${category.slug}/${subcategory.slug}` },
          { label: product.modelNo },
        ]}
        subtitle={product.shortDescription}
        title={product.name}
      />
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted">
              <Image alt={`${product.name} product image`} className="object-cover" fill priority sizes="(min-width: 1024px) 50vw, 100vw" src={product.images[0]} />
            </div>
            <div>
              <p className="font-mono text-sm font-bold text-accent">{product.modelNo}</p>
              <p className="mt-5 text-lg leading-8 text-muted-text">{product.description.split("\n\n")[0]}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {product.audience.map((audience) => <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize text-muted-text" key={audience}>{audience}</span>)}
              </div>
              <Link className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent-2 px-5 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg" href="/quote">
                Add to Quote <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <p className="mt-4 text-sm text-muted-text">Request a tailored quotation for your institution or lab requirement.</p>
            </div>
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary">Features</h2>
              <ul className="mt-5 space-y-3">
                {product.features.map((feature) => <li className="flex gap-3 text-sm leading-6 text-muted-text" key={feature}><span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />{feature}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary">Technical specifications</h2>
              <dl className="mt-5 divide-y divide-border rounded-2xl border border-border">
                {product.specs.map((spec) => <div className="grid grid-cols-2 gap-4 px-4 py-3 text-sm odd:bg-muted" key={spec.label}><dt className="font-semibold text-primary">{spec.label}</dt><dd className="text-muted-text">{spec.value}</dd></div>)}
              </dl>
            </div>
          </div>

          {product.experiments?.length ? (
            <div className="mt-16 rounded-2xl bg-muted p-6 md:p-8">
              <h2 className="font-heading text-2xl font-bold text-primary">Experiments that can be performed</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {product.experiments.map((experiment, index) => <p className="text-sm leading-6 text-muted-text" key={experiment}><span className="mr-3 font-mono font-bold text-accent">{String(index + 1).padStart(2, "0")}</span>{experiment}</p>)}
              </div>
            </div>
          ) : null}

          <Link className="mt-12 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent" href={`/products/${category.slug}/${subcategory.slug}`}>
            <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to {subcategory.name}
          </Link>
        </Container>
      </section>
    </main>
  );
}
