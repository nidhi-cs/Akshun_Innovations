import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Atom,
  BatteryCharging,
  BookOpenCheck,
  Building2,
  CircuitBoard,
  Cog,
  Cpu,
  Gauge,
  Layers3,
  type LucideIcon,
  Ruler,
  Settings2,
  Table2,
  Wrench,
  Zap,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { LabAudienceFilters } from "@/components/catalogue/LabAudienceFilters";
import { LabCard } from "@/components/catalogue/LabCard";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { ProductImage } from "@/components/product/ProductImage";
import { LabSolutionFinder } from "@/components/lab-solutions/LabSolutionFinder";
import { getCategories, getLabSolutions, getProducts } from "@/lib/api";
import type { Audience } from "@/types";

export const metadata: Metadata = {
  title: "Laboratory Solutions",
  description: "Explore laboratory equipment and technical training systems across engineering disciplines.",
};

const validAudiences: Audience[] = ["school", "college", "polytechnic", "iti", "industry"];

const solutionCategories: {
  title: string;
  categorySlug: string;
  description: string;
  models: string[];
  cta: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Electrical Engineering Laboratory",
    categorySlug: "electrical",
    description: "Support hands-on learning in electrical circuits, measurements, power systems, protection, wiring, and power electronics with equipment for practical engineering education.",
    models: ["AKI-E101", "AKI-E111", "AKI-E107", "AKI-E104", "AKI-E200"],
    cta: "Explore Electrical Solutions",
    icon: Zap,
  },
  {
    title: "Electronics and Communication Laboratory",
    categorySlug: "electronics",
    description: "Help students understand electronic circuits, analog communication, signal generation, amplification, and filtering through practical training equipment.",
    models: ["AKI-E129", "AKI-E137", "AKI-E133", "AKI-E162", "AKI-E128"],
    cta: "Explore Electronics Solutions",
    icon: CircuitBoard,
  },
  {
    title: "IoT and Embedded Systems Laboratory",
    categorySlug: "iot-embedded",
    description: "Create hands-on learning opportunities in sensor interfacing, embedded systems, connected devices, data acquisition, and IoT concepts.",
    models: ["AKI-E217", "AKI-E215", "AKI-E212", "AKI-E214", "AKI-E213"],
    cta: "Explore IoT Solutions",
    icon: Cpu,
  },
  {
    title: "PLC and Industrial Automation Laboratory",
    categorySlug: "plc-automation",
    description: "Introduce programmable logic controllers, automation sequences, pneumatic control, and industrial control concepts through practical training systems.",
    models: ["AKI-E192", "AKI-E191", "AKI-E218", "AKI-E219", "AKI-E220"],
    cta: "Explore Automation Solutions",
    icon: Settings2,
  },
  {
    title: "Mechanical and Thermal Engineering Laboratory",
    categorySlug: "mechanical",
    description: "Support practical learning in thermodynamics, heat transfer, fluid mechanics, refrigeration, engine technology, and mechanical testing.",
    models: ["AKI-E180", "AKI-E199", "AKI-E177", "AKI-E186", "AKI-E187", "AKI-E183"],
    cta: "Explore Mechanical Solutions",
    icon: Cog,
  },
  {
    title: "Physics Laboratory",
    categorySlug: "physics",
    description: "Help learners explore fundamental physics through optics, mechanics, thermodynamics, waves, and renewable-energy experiments.",
    models: ["AKI-E171", "AKI-E173", "AKI-E170", "AKI-E172", "AKI-E175", "AKI-E174"],
    cta: "Explore Physics Solutions",
    icon: Atom,
  },
  {
    title: "Civil Engineering and Materials Laboratory",
    categorySlug: "civil-chemical",
    description: "Support practical learning in construction materials, soil mechanics, surveying, fluid behavior, and material testing.",
    models: ["AKI-E194", "AKI-E195", "AKI-E196", "AKI-E197", "AKI-E198"],
    cta: "Explore Civil Engineering Solutions",
    icon: Building2,
  },
  {
    title: "Electric Vehicle and Renewable Energy Laboratory",
    categorySlug: "ev-renewable",
    description: "Introduce electric mobility, battery fundamentals, EV powertrains, charging systems, solar charging, and renewable-energy monitoring.",
    models: ["AKI-E222", "AKI-E210", "AKI-E211", "AKI-E209", "AKI-E221", "AKI-E223"],
    cta: "Explore EV and Renewable Solutions",
    icon: BatteryCharging,
  },
  {
    title: "Test and Measurement Laboratory",
    categorySlug: "test-measuring",
    description: "Build practical measurement skills with instruments used for signal observation, circuit testing, and power-supply experiments.",
    models: ["AKI-E203", "AKI-E204", "AKI-E202", "AKI-E201", "AKI-E205", "AKI-E200"],
    cta: "Explore Test and Measurement",
    icon: Gauge,
  },
  {
    title: "Laboratory Furniture and Workstations",
    categorySlug: "lab-furniture",
    description: "Organize technical learning environments with workspaces for laboratory practicals, electronics assembly, STEM projects, and collaborative engineering activities.",
    models: ["AKI-E207", "AKI-E206", "AKI-E225", "AKI-E208", "AKI-E224", "AKI-E226"],
    cta: "Explore Laboratory Furniture",
    icon: Table2,
  },
];

const featuredModels = ["AKI-E212", "AKI-E215", "AKI-E192", "AKI-E137", "AKI-E210", "AKI-E171"];

const reasons = [
  {
    title: "Practical Learning Focus",
    description: "Explore equipment intended to help learners connect theoretical concepts with laboratory experiments.",
    icon: BookOpenCheck,
  },
  {
    title: "Multiple Engineering Disciplines",
    description: "Discover training equipment spanning electrical, electronics, automation, physics, mechanical, civil, EV, and renewable energy.",
    icon: Layers3,
  },
  {
    title: "Equipment for Technical Education",
    description: "Browse laboratory trainers, demonstration systems, measurement instruments, and workstations for educational and technical environments.",
    icon: Wrench,
  },
  {
    title: "Solutions Based on Your Requirements",
    description: "Contact the AKSHUNN team to discuss your laboratory equipment needs and identify suitable catalogue products.",
    icon: Ruler,
  },
];

const steps = [
  {
    title: "Identify Your Requirements",
    description: "Choose the laboratory discipline, intended experiments, and educational requirements.",
    icon: Ruler,
  },
  {
    title: "Explore Suitable Equipment",
    description: "Review relevant product categories and the specifications available for each product.",
    icon: CircuitBoard,
  },
  {
    title: "Request a Quote",
    description: "Share your requirements with AKSHUNN through the existing quote or contact workflow.",
    icon: BookOpenCheck,
  },
];

const faqs = [
  {
    question: "What types of laboratory solutions does AKSHUNN offer?",
    answer: "AKSHUNN's catalogue includes laboratory equipment and training systems across electrical engineering, electronics, IoT, automation, physics, mechanical engineering, civil engineering, EV technology, renewable energy, test and measurement, and laboratory furniture.",
  },
  {
    question: "How can I find equipment for my engineering laboratory?",
    answer: "Start by selecting the relevant laboratory discipline, then explore the available equipment categories and product details. You can also contact AKSHUNN with your requirements.",
  },
  {
    question: "Can I request a quote for specific laboratory equipment?",
    answer: "Use the Request a Quote option on the website to submit an inquiry for the products you are interested in.",
  },
  {
    question: "Where can I find product specifications?",
    answer: "Open an individual product details page to review the available description, features, and technical specifications. Some specifications may require confirmation if they are not yet available in the catalogue.",
  },
  {
    question: "Can I explore equipment for multiple engineering disciplines?",
    answer: "Yes. Browse the available laboratory categories to explore equipment across the disciplines represented in the current catalogue.",
  },
];

interface LabSolutionsPageProps {
  searchParams: Promise<{ for?: string }>;
}

export default async function LabSolutionsPage({ searchParams }: LabSolutionsPageProps) {
  const [{ for: audienceParam }, categories, productPage, solutions] = await Promise.all([
    searchParams,
    getCategories(),
    getProducts({ pageSize: 1000 }),
    getLabSolutions(),
  ]);
  const selectedAudience: Audience | "all" = validAudiences.includes(audienceParam as Audience)
    ? (audienceParam as Audience)
    : "all";
  const filteredSolutions = selectedAudience === "all"
    ? solutions
    : solutions.filter((solution) => solution.idealFor.includes(selectedAudience));
  const products = productPage.items;
  const productsByModel = new Map(products.map((product) => [product.modelNo, product]));
  const featuredProducts = featuredModels.flatMap((model) => {
    const product = productsByModel.get(model);
    return product ? [product] : [];
  });

  return (
    <main>
      <section className="overflow-hidden bg-primary text-white">
        <Container className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:py-20">
          <div>
            <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-slate-300">
              <Link className="transition-colors hover:text-white" href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="text-white">Lab Solutions</span>
            </nav>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Laboratory Solutions</p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Complete Laboratory Solutions for Technical Education
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
              Equip your institution with practical learning environments designed to connect engineering theory with real-world applications. Explore laboratory equipment, training systems, and technical workstations across electrical, electronics, automation, mechanical engineering, physics, civil engineering, renewable energy, and emerging technologies.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent-2 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg" href="#laboratory-categories">
                Explore Lab Solutions <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10" href="/quote">
                Request a Quote
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl pb-12 sm:pb-14">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/15 bg-slate-800 shadow-2xl">
              <Image
                alt="Engineering laboratory work in a technical training environment"
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                src="/about/hero-industrial.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
              <p className="absolute bottom-5 left-5 text-sm font-semibold text-white">Practical learning across engineering disciplines</p>
            </div>
            <div className="absolute -bottom-1 left-3 right-3 grid grid-cols-3 gap-2 sm:left-5 sm:right-5 sm:gap-3">
              {["AKI-E215", "AKI-E192", "AKI-E212"].map((model) => {
                const product = productsByModel.get(model);
                if (!product) return null;
                return (
                  <Link className="overflow-hidden rounded-xl border border-border bg-white p-2 shadow-lg transition hover:-translate-y-1 sm:p-3" href={`/product/${product.slug}`} key={product.id}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                      <ProductImage alt={product.imageAlt ?? `${product.name} illustration`} className="object-contain p-1" fallbackOnError sizes="(min-width: 640px) 160px, 30vw" src={product.images[0]} />
                    </div>
                    <span className="mt-2 block truncate font-mono text-[10px] font-bold text-accent sm:text-xs">{product.modelNo}</span>
                    <span className="mt-0.5 block truncate text-[10px] font-bold text-primary sm:text-xs">{product.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="laboratory-categories-title" className="bg-white py-14 sm:py-18" id="laboratory-categories">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Explore by discipline</p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl" id="laboratory-categories-title">
              Laboratory Equipment for Every Discipline
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-text">
              Browse relevant product categories and see examples from the current catalogue.
            </p>
          </div>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {solutionCategories.map((solution) => {
              const category = categories.find((item) => item.slug === solution.categorySlug);
              if (!category) return null;
              const categoryProducts = solution.models
                .map((model) => productsByModel.get(model))
                .filter((product): product is NonNullable<typeof product> => Boolean(product && product.categorySlug === category.slug));
              const coverProduct = categoryProducts.find((product) => product.imageAlt) ?? categoryProducts[0];
              const Icon = solution.icon;
              return (
                <article className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg" key={solution.categorySlug}>
                  <Link aria-label={`Browse ${category.name} products`} className="relative block aspect-[16/9] overflow-hidden bg-muted" href={`/products/${category.slug}`}>
                    {coverProduct ? (
                      <ProductImage alt={coverProduct.imageAlt ?? `${coverProduct.name} illustration`} className="object-contain p-6 transition duration-300 group-hover:scale-105" fallbackOnError sizes="(min-width: 1280px) 28vw, (min-width: 640px) 45vw, 100vw" src={coverProduct.images[0]} />
                    ) : null}
                    <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-accent shadow-md">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                  </Link>
                  <div className="p-5 sm:p-6">
                    <p className="text-xs font-bold uppercase tracking-wide text-accent">{category.name}</p>
                    <h3 className="mt-2 font-heading text-xl font-bold leading-snug text-primary">{solution.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-text">{solution.description}</p>
                    {categoryProducts.length ? (
                      <div className="mt-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-primary">Catalogue examples</p>
                        <ul className="mt-2 space-y-1.5">
                          {categoryProducts.slice(0, 4).map((product) => (
                            <li key={product.id}>
                              <Link className="text-sm text-muted-text underline decoration-border underline-offset-2 transition hover:text-accent" href={`/product/${product.slug}`}>
                                {product.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    <Link className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-primary transition hover:text-accent" href={`/products/${category.slug}`}>
                      {solution.cta} <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <LabSolutionFinder categories={categories} initialAudience={selectedAudience} products={products} />

      {filteredSolutions.length ? (
        <section aria-labelledby="learning-environments-title" className="bg-white py-14 sm:py-18">
          <Container>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Curated environments</p>
                <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl" id="learning-environments-title">
                  Explore Learning Environments
                </h2>
              </div>
              <LabAudienceFilters selected={selectedAudience} />
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSolutions.map((solution) => <LabCard key={solution.id} solution={solution} />)}
            </div>
          </Container>
        </section>
      ) : null}

      <section aria-labelledby="practical-learning-title" className="bg-muted py-14 sm:py-18">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Why AKSHUNN</p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl" id="practical-learning-title">
              Designed Around Practical Learning
            </h2>
          </div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <article className="rounded-2xl border border-border bg-white p-5 sm:p-6" key={reason.title}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-accent">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-bold text-primary">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-text">{reason.description}</p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section aria-labelledby="getting-started-title" className="bg-white py-14 sm:py-18">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">A simple starting point</p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl" id="getting-started-title">
              From Requirements to the Right Equipment
            </h2>
          </div>
          <ol className="mt-9 grid gap-7 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li className="rounded-2xl border border-border bg-white p-6 shadow-sm" key={step.title}>
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-accent"><Icon aria-hidden="true" className="h-5 w-5" /></span>
                    <span className="font-mono text-sm font-bold text-accent">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-bold text-primary">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-text">{step.description}</p>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="featured-equipment-title" className="bg-muted py-14 sm:py-18">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">From the catalogue</p>
              <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl" id="featured-equipment-title">
                Explore Equipment for Your Laboratory
              </h2>
            </div>
            <Link className="inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:text-accent" href="/products">
              View all products <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => {
              const category = categories.find((item) => item.slug === product.categorySlug);
              return (
                <div key={product.id}>
                  <p className="mb-2 px-1 text-xs font-semibold text-muted-text">{category?.name ?? "Laboratory equipment"}</p>
                  <ProductCard product={product} />
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section aria-labelledby="lab-faq-title" className="bg-white py-14 sm:py-18">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Answers to common questions</p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl" id="lab-faq-title">
              Frequently Asked Questions
            </h2>
            <div className="mt-7 divide-y divide-border border-y border-border">
              {faqs.map((faq) => (
                <details className="group py-5" key={faq.question}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-base font-bold text-primary marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                    {faq.question}
                    <span aria-hidden="true" className="text-xl text-accent transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-text">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-primary py-14 text-white sm:py-18">
        <Container className="flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Plan with clarity</p>
            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Planning Your Next Laboratory?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-200 sm:text-base">
              Explore our laboratory equipment catalogue and find training systems, instruments, and workstations suited to your technical education requirements.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent-2 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg" href="/products">
              Explore Products <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10" href="/quote">
              Request a Quote
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
