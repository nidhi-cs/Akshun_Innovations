import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Cpu,
  Gauge,
  Handshake,
  HeartHandshake,
  Lightbulb,
  Radio,
  ScanLine,
  Settings2,
  ShieldCheck,
  Target,
  Waves,
  Wifi,
  Wind,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { siteConfig } from "@/lib/site-config";

const capabilities: { title: string; icon: LucideIcon }[] = [
  { title: "IoT Hardware Development", icon: Cpu },
  { title: "Smart Sensors & Monitoring", icon: ScanLine },
  { title: "Connected Device Solutions", icon: Wifi },
  { title: "Industrial Automation", icon: Settings2 },
];

const values: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Innovation",
    description: "Continuously exploring better connected technologies.",
    icon: Lightbulb,
  },
  {
    title: "Quality",
    description: "Prioritizing reliability, durability, and performance.",
    icon: ShieldCheck,
  },
  {
    title: "Customer Focus",
    description: "Building solutions around real customer needs.",
    icon: HeartHandshake,
  },
  {
    title: "Reliability",
    description: "Designing dependable products for demanding environments.",
    icon: Gauge,
  },
  {
    title: "Sustainability",
    description: "Supporting smarter resource utilization.",
    icon: Wind,
  },
  {
    title: "Collaboration",
    description: "Working closely with customers and technology partners.",
    icon: Handshake,
  },
];

const expertise: { title: string; icon: LucideIcon }[] = [
  { title: "IoT sensors and embedded devices", icon: ScanLine },
  { title: "Wireless connectivity and communication modules", icon: Radio },
  { title: "Industrial gateways and controllers", icon: Cpu },
  { title: "Remote monitoring and telemetry", icon: Gauge },
  { title: "Smart automation and control systems", icon: Settings2 },
  { title: "Device integration and data collection", icon: Waves },
];

const industries: { title: string; description: string; image: string; imageAlt: string }[] = [
  {
    title: "Smart Manufacturing",
    description: "Machine monitoring, predictive maintenance, and factory automation.",
    image: "/about/smart-manufacturing.jpg",
    imageAlt: "Engineer monitoring machinery on a factory floor",
  },
  {
    title: "Agriculture & Smart Farming",
    description: "Soil sensing, smart irrigation, and real-time crop monitoring.",
    image: "/about/smart-farming.jpg",
    imageAlt: "Green agricultural fields viewed across the landscape",
  },
  {
    title: "Energy & Utilities",
    description: "Energy monitoring, power optimization, and grid visibility.",
    image: "/about/energy-utilities.jpg",
    imageAlt: "Power transmission towers across an open landscape",
  },
  {
    title: "Healthcare",
    description: "Connected devices, patient monitoring, and equipment tracking.",
    image: "/about/healthcare.jpg",
    imageAlt: "Healthcare professional reviewing information on a tablet",
  },
  {
    title: "Transportation & Logistics",
    description: "Fleet management, asset tracking, and real-time operations data.",
    image: "/about/transportation-logistics.jpg",
    imageAlt: "Packages moving through a distribution warehouse",
  },
  {
    title: "Smart Cities",
    description: "Connected infrastructure, environmental sensing, and smart lighting.",
    image: "/about/smart-cities.jpg",
    imageAlt: "City skyline illuminated after dusk",
  },
];

const benefits = [
  "Practical, application-focused IoT solutions",
  "Focus on product quality and reliability",
  "Flexible solutions for different industry requirements",
  "Scalable connected-device architecture",
  "Technical support and customer collaboration",
  "Commitment to continuous improvement",
];

const contactHref = `mailto:${siteConfig.email}`;

export function AboutUs() {
  return (
    <main>
      <section className="relative isolate overflow-hidden bg-primary text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_20%,rgba(0,180,216,0.22),transparent_45%)]" />
        <Container className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:py-24">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
              About our company
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.6rem]">
              Connecting Industries Through Intelligent IoT Solutions
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              We design and deliver connected hardware solutions that help businesses monitor operations, optimize performance, and make smarter decisions through real-time data.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-primary transition hover:-translate-y-0.5 hover:bg-cyan-300"
                href="/products"
              >
                Explore Our Solutions
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <a
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:border-white/60 hover:bg-white/10"
                href={contactHref}
              >
                Contact Our Team
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-xs font-medium tracking-wide text-slate-300">
              <span className="inline-flex items-center gap-2"><Cpu aria-hidden="true" className="h-4 w-4 text-cyan-300" /> Connected hardware</span>
              <span className="inline-flex items-center gap-2"><Radio aria-hidden="true" className="h-4 w-4 text-cyan-300" /> Intelligent systems</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl lg:mx-0 lg:justify-self-end">
            <div aria-hidden="true" className="absolute -inset-4 rounded-[2rem] border border-cyan-300/15" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-slate-800 shadow-2xl shadow-black/30">
              <Image
                alt="Engineer working with connected industrial hardware and electronic components"
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                src="/about/hero-industrial.jpg"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-primary/65 via-primary/5 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">Designed for connection</p>
                  <p className="mt-1 font-heading text-lg font-semibold text-white sm:text-xl">Hardware. Data. Better decisions.</p>
                </div>
                <span aria-hidden="true" className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur sm:inline-flex">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="who-we-are" className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087eae]">Built around real-world needs</p>
              <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl" id="who-we-are">Who We Are</h2>
            </div>
            <div>
              <p className="text-base leading-8 text-slate-600 sm:text-lg">
                We are an IoT products and technology company focused on developing connected devices and intelligent hardware solutions for modern industries. Our approach combines hardware innovation, sensor technology, connectivity, and data-driven intelligence to help businesses improve operational efficiency and visibility.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {capabilities.map(({ title, icon: Icon }) => (
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-sky-200 hover:shadow-md" key={title}>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-[#087eae]">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-bold leading-5 text-primary">{title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section aria-label="Our mission and vision" className="bg-[#f5f8fc] py-14 sm:py-18">
        <Container className="grid gap-5 md:grid-cols-2 md:gap-7">
          <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-9">
            <div aria-hidden="true" className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-sky-50 transition group-hover:scale-125" />
            <div className="relative">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-[#087eae]"><Target aria-hidden="true" className="h-6 w-6" /></span>
              <h2 className="mt-5 font-heading text-2xl font-bold text-primary">Our Mission</h2>
              <p className="mt-3 max-w-lg leading-7 text-muted-text">To make intelligent connectivity accessible to businesses by delivering reliable, scalable, and practical IoT solutions.</p>
            </div>
          </article>
          <article className="group relative overflow-hidden rounded-2xl bg-primary p-7 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-9">
            <div aria-hidden="true" className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-400/10 transition group-hover:scale-125" />
            <div className="relative">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-cyan-300"><Lightbulb aria-hidden="true" className="h-6 w-6" /></span>
              <h2 className="mt-5 font-heading text-2xl font-bold">Our Vision</h2>
              <p className="mt-3 max-w-lg leading-7 text-slate-300">To contribute to a smarter, more connected world where technology enables efficient operations, sustainable growth, and better decision-making.</p>
            </div>
          </article>
        </Container>
      </section>

      <section aria-labelledby="values-heading" className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087eae]">What guides us</p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl" id="values-heading">Our Core Values</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {values.map(({ title, description, icon: Icon }) => (
              <article className="rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg" key={title}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-[#087eae]"><Icon aria-hidden="true" className="h-5 w-5" /></span>
                <h3 className="mt-5 font-heading text-lg font-bold text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-text">{description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="expertise-heading" className="bg-[#f5f8fc] py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
            <div className="max-w-md">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087eae]">Our expertise</p>
              <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl" id="expertise-heading">Technology That Connects Everything</h2>
              <p className="mt-4 leading-7 text-muted-text">From sensing and communication to control and data collection, we bring the building blocks of connected operations together.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {expertise.map(({ title, icon: Icon }) => (
                <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5" key={title}>
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-[#087eae]"><Icon aria-hidden="true" className="h-4 w-4" /></span>
                  <p className="pt-1 text-sm font-semibold leading-5 text-primary">{title}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="industries-heading" className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087eae]">Where we make a difference</p>
              <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl" id="industries-heading">Industries We Serve</h2>
              <p className="mt-3 leading-7 text-muted-text">Connected technology tailored to the environments and challenges businesses face.</p>
            </div>
            <Link className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#087eae] transition hover:text-primary" href="/industries">
              View All Industries <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map(({ title, description, image, imageAlt }) => (
              <article className="group relative isolate min-h-64 overflow-hidden rounded-2xl bg-primary sm:min-h-72" key={title}>
                <Image
                  alt={imageAlt}
                  className="object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  src={image}
                />
                <div aria-hidden="true" className="absolute inset-0 -z-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <h3 className="font-heading text-xl font-bold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="why-us-heading" className="bg-[#f5f8fc] py-16 sm:py-20 lg:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200 shadow-xl lg:order-1">
            <Image
              alt="Close-up of electronic circuitry used in connected technology"
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              src="/about/connected-circuitry.jpg"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-tr from-primary/35 to-transparent" />
            <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-lg border border-white/30 bg-primary/70 px-4 py-2.5 text-xs font-bold tracking-wide text-white backdrop-blur">
              <Zap aria-hidden="true" className="h-4 w-4 text-cyan-300" /> Built for connected operations
            </span>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087eae]">Why work with us</p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl" id="why-us-heading">Why Businesses Choose Us</h2>
            <p className="mt-4 leading-7 text-muted-text">We focus on practical technology, thoughtful integration, and solutions shaped around the work they need to do.</p>
            <ul className="mt-7 grid gap-4">
              {benefits.map((benefit) => (
                <li className="flex items-start gap-3 text-sm font-medium leading-6 text-slate-700" key={benefit}>
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} /></span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <Container className="relative isolate overflow-hidden rounded-2xl bg-primary px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_90%_20%,rgba(0,180,216,0.26),transparent_45%)]" />
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Start a conversation</p>
              <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">Let&apos;s Build a Smarter, Connected Future</h2>
              <p className="mt-4 leading-7 text-slate-300">Looking for the right IoT hardware or a connected solution for your business? Let&apos;s discuss your requirements.</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
              <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-primary transition hover:bg-cyan-300" href={contactHref}>
                Talk to Our Team <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
              <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10" href="/products">
                Explore Products <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
