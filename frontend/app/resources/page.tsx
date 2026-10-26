import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Building2,
  ClipboardList,
  Cpu,
  Factory,
  Headphones,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { getCategories } from "@/lib/api";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Browse product categories, lab solutions, industries, and enquiry resources from Akshunn Innovations.",
};

const resourceLinks: {
  title: string;
  description: string;
  href: string;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Lab Solutions",
    description: "Explore complete lab environments and learning systems for education and industry.",
    href: "/lab-solutions",
    label: "Explore lab solutions",
    icon: BookOpen,
  },
  {
    title: "Industries We Serve",
    description: "See how connected technology can support different applications and operating environments.",
    href: "/industries",
    label: "Browse industries",
    icon: Factory,
  },
  {
    title: "Request a Quote",
    description: "Share product, quantity, and project requirements in a structured quotation enquiry.",
    href: "/quote",
    label: "Start a quote request",
    icon: ClipboardList,
  },
  {
    title: "Contact Our Team",
    description: "Find the right way to discuss product, technical, or business enquiries.",
    href: "/contact",
    label: "Get in touch",
    icon: Headphones,
  },
];

export default async function ResourcesPage() {
  const categories = await getCategories();

  return (
    <main>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]}
        subtitle="Find products, application information, and the right next step for your requirements."
        title="Resources for Better Decisions"
      />

      <section aria-labelledby="product-categories-heading" className="bg-muted py-14 sm:py-18">
        <Container>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Product catalogue</p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-primary sm:text-3xl" id="product-categories-heading">
                Browse Product Categories
              </h2>
              <p className="mt-3 leading-7 text-muted-text">
                Explore the available catalogue by product area and view the products listed in each category.
              </p>
            </div>
            <Link className="inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:text-accent" href="/products">
              View all products <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          {categories.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  className="group flex min-h-36 flex-col rounded-2xl border border-border bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg"
                  href={`/products/${category.slug}`}
                  key={category.id}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-accent transition group-hover:bg-primary group-hover:text-accent">
                    <Boxes aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="mt-4 font-heading text-base font-bold text-primary">{category.name}</span>
                  <span className="mt-1 line-clamp-2 text-sm leading-5 text-muted-text">{category.description}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-border bg-white p-8 text-center">
              <p className="font-semibold text-primary">Product categories are not available right now.</p>
              <Link className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent" href="/products">
                Open the product catalogue <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          )}
        </Container>
      </section>

      <section aria-labelledby="more-resources-heading" className="py-14 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Explore more</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-primary sm:text-3xl" id="more-resources-heading">
              Helpful Places to Start
            </h2>
            <p className="mt-3 leading-7 text-muted-text">
              Choose a resource based on what you are researching or the support you need.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {resourceLinks.map(({ title, description, href, label, icon: Icon }) => (
              <article className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg" key={title}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-primary transition group-hover:bg-primary group-hover:text-accent">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-heading text-lg font-bold text-primary">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-text">{description}</p>
                <Link className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-accent" href={href}>
                  {label} <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-primary py-12 text-white sm:py-16">
        <Container className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent sm:flex">
              <Cpu aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Need a little guidance?</p>
              <h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">Let&apos;s talk through your requirements.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">
                Tell us what you are working on and we can direct you to the relevant products or solutions.
              </p>
            </div>
          </div>
          <Link className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent-2 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg" href="/contact">
            Contact Us <Building2 aria-hidden="true" className="h-4 w-4" />
          </Link>
        </Container>
      </section>
    </main>
  );
}
