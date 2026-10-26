import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Download,
  FileText,
  Layers3,
  Radio,
  Settings2,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { getCategory, getProduct, getProducts, getRelatedProducts, getSubCategory } from "@/lib/api";

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

  const category = await getCategory(product.categorySlug);
  if (!category) notFound();
  const subcategoryCandidate = await getSubCategory(product.subCategorySlug);
  const subcategory = subcategoryCandidate?.categorySlug === category.slug ? subcategoryCandidate : undefined;
  const relatedMatches = (await getRelatedProducts(product.slug, 4)).filter((candidate) => candidate.categorySlug === product.categorySlug);
  const categoryProducts = relatedMatches.length < 4 ? await getProducts({ category: product.categorySlug, pageSize: 1000 }) : undefined;
  const relatedProducts = [
    ...relatedMatches,
    ...(categoryProducts?.items.filter((candidate) => candidate.slug !== product.slug && !relatedMatches.some((related) => related.slug === candidate.slug)) ?? []),
  ].slice(0, 4);
  const datasheetUrl = product.datasheetUrl;
  const isValidDatasheetUrl = isSafeDocumentUrl(datasheetUrl);
  const quoteParams = new URLSearchParams({ product: product.name, model: product.modelNo });
  const applicationSpec = product.specs.find((spec) => spec.label.toLowerCase() === "application");
  const productOverview = product.description.split("\n\n").filter(Boolean);

  return (
    <main>
      <section className="border-b border-border bg-muted/70 py-4">
        <Container>
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-muted-text sm:text-sm">
            <Link className="hover:text-primary" href="/">Home</Link>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
            <Link className="hover:text-primary" href="/products">Products</Link>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
            <Link className="hover:text-primary" href={`/products/${category.slug}`}>{category.name}</Link>
            {subcategory ? (
              <>
                <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
                <Link className="hover:text-primary" href={`/products/${category.slug}/${subcategory.slug}`}>{subcategory.name}</Link>
              </>
            ) : null}
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
            <span aria-current="page" className="font-semibold text-primary">{product.name}</span>
          </nav>
        </Container>
      </section>

      <section className="bg-white py-10 sm:py-14 lg:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
            <ProductGallery imageAlt={product.imageAlt} images={product.images} productName={product.name} />
            <div className="lg:py-2">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{category.name}{subcategory ? <><span className="px-1 text-slate-300">/</span>{subcategory.name}</> : null}</p>
              <h1 className="mt-3 font-heading text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl">{product.name}</h1>
              <p className="mt-3 font-mono text-sm font-bold tracking-wide text-accent">{product.modelNo}</p>
              {product.isNew ? <span className="mt-4 inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-primary">New</span> : null}
              <p className="mt-5 text-base leading-7 text-muted-text">{product.shortDescription}</p>
              <div className="mt-6">
                <p className="text-sm font-bold text-primary">Key benefits</p>
                <ul className="mt-3 space-y-2.5">
                  {product.features.slice(0, 5).map((feature) => (
                    <li className="flex items-start gap-2.5 text-sm leading-6 text-muted-text" key={feature}>
                      <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {product.audience.map((audience) => <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize text-muted-text" key={audience}>{audience}</span>)}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent-2 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg" href={`/quote?${quoteParams.toString()}`}>
                  Request a Quote <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                {isValidDatasheetUrl ? (
                  <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border bg-white px-5 py-3 text-sm font-bold text-primary transition hover:border-accent hover:bg-muted" download href={datasheetUrl}>
                    Download Datasheet <Download aria-hidden="true" className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
              <p className="mt-4 text-sm text-muted-text">Request product pricing, quantity details, and suitability for your application.</p>
            </div>
          </div>
        </Container>
      </section>

      {product.features.length ? (
        <section aria-labelledby="features-heading" className="bg-muted py-12 sm:py-16">
          <Container>
            <SectionHeading eyebrow="Product highlights" id="features-heading" title="Key Features" />
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.features.map((feature, index) => {
                const FeatureIcon = [Radio, Settings2, Layers3][index % 3];
                return (
                  <article className="rounded-xl border border-border bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-md" key={feature}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-accent"><FeatureIcon aria-hidden="true" className="h-5 w-5" /></span>
                    <h3 className="mt-4 font-heading text-base font-bold text-primary">{feature}</h3>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>
      ) : null}

      {product.specs.length ? (
        <section aria-labelledby="specifications-heading" className="bg-white py-12 sm:py-16">
          <Container>
            <SectionHeading eyebrow="Product data" id="specifications-heading" title="Technical Specifications" />
            <dl className="mt-7 overflow-hidden rounded-2xl border border-border">
              {product.specs.map((spec, index) => (
                <div className={`grid gap-1 px-4 py-3.5 text-sm sm:grid-cols-[minmax(10rem,0.75fr)_1.25fr] sm:gap-6 sm:px-6 ${index % 2 ? "bg-white" : "bg-muted/70"}`} key={spec.label}>
                  <dt className="font-semibold text-primary">{spec.label}</dt>
                  <dd className="text-muted-text">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      ) : null}

      <section aria-labelledby="overview-heading" className="bg-muted py-12 sm:py-16">
        <Container className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
          <div>
            <SectionHeading eyebrow="Product information" id="overview-heading" title="Product Overview" />
            <div className="mt-5 space-y-4 text-sm leading-7 text-muted-text sm:text-base">
              {productOverview.map((paragraph, index) => <p key={`${index}-${paragraph}`}>{paragraph}</p>)}
            </div>
            {applicationSpec ? (
              <div className="mt-7">
                <h3 className="font-heading text-lg font-bold text-primary">Applications</h3>
                <p className="mt-2 text-sm leading-6 text-muted-text">{applicationSpec.value}</p>
              </div>
            ) : null}
            {product.applications?.length ? (
              <div className="mt-7">
                <h3 className="font-heading text-lg font-bold text-primary">Applications</h3>
                <p className="mt-2 text-sm leading-6 text-muted-text">Potential applications include:</p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {product.applications.map((application) => <li className="flex items-start gap-2 text-sm leading-6 text-muted-text" key={application}><Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-accent" />{application}</li>)}
                </ul>
              </div>
            ) : product.experiments?.length ? (
              <div className="mt-7">
                <h3 className="font-heading text-lg font-bold text-primary">Practical activities</h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {product.experiments.map((experiment) => <li className="flex items-start gap-2 text-sm leading-6 text-muted-text" key={experiment}><Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-accent" />{experiment}</li>)}
                </ul>
              </div>
            ) : null}
          </div>
          <div className="self-start rounded-2xl border border-border bg-white p-6 sm:p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-accent"><Layers3 aria-hidden="true" className="h-5 w-5" /></span>
            <h3 className="mt-5 font-heading text-xl font-bold text-primary">Resources &amp; Downloads</h3>
            {isValidDatasheetUrl ? (
              <a className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-border p-4 text-sm transition hover:border-accent hover:bg-muted" download href={datasheetUrl}>
                <span className="flex items-center gap-3"><FileText aria-hidden="true" className="h-5 w-5 text-accent" /><span className="font-semibold text-primary">Product datasheet</span></span>
                <Download aria-hidden="true" className="h-4 w-4 text-accent" />
              </a>
            ) : (
              <p className="mt-3 text-sm leading-6 text-muted-text">No downloadable documents are listed for this product. <Link className="font-semibold text-primary hover:text-accent" href="/contact">Contact us</Link> to ask about available documentation.</p>
            )}
            {product.includedAccessories?.length ? (
              <div className="mt-6 border-t border-border pt-5">
                <h4 className="text-sm font-bold text-primary">Included accessories</h4>
                <ul className="mt-3 space-y-2">
                  {product.includedAccessories.map((accessory) => <li className="flex gap-2 text-sm text-muted-text" key={accessory}><Check aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />{accessory}</li>)}
                </ul>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <div className="flex flex-col items-start justify-between gap-5 rounded-2xl bg-primary px-6 py-8 text-white sm:px-9 sm:py-10 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Product enquiry</p>
              <h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">Interested in This Product?</h2>
              <p className="mt-3 text-sm leading-6 text-slate-200">Share your requirements with our team to discuss pricing, quantity, technical details, and product suitability.</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent-2 px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg" href={`/quote?${quoteParams.toString()}`}>
                Request a Quote <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/25 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10" href="/contact">Contact Us</Link>
            </div>
          </div>
        </Container>
      </section>

      {relatedProducts.length ? (
        <section aria-labelledby="related-products-heading" className="bg-muted py-12 sm:py-16">
          <Container>
            <SectionHeading eyebrow="You may also be interested in" id="related-products-heading" title="Related Products" />
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} subCategory={subcategory} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <Container className="py-8">
        <Link className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent" href={subcategory ? `/products/${category.slug}/${subcategory.slug}` : `/products/${category.slug}`}>
          <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to {subcategory?.name ?? category.name}
        </Link>
      </Container>
    </main>
  );
}

function isSafeDocumentUrl(value?: string): value is string {
  if (!value) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function SectionHeading({ eyebrow, id, title }: { eyebrow: string; id: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
      <h2 className="mt-2 font-heading text-2xl font-bold text-primary sm:text-3xl" id={id}>{title}</h2>
    </div>
  );
}
