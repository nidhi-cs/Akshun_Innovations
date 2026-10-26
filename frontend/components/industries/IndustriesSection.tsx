import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Factory,
  HeartPulse,
  Lightbulb,
  Pickaxe,
  Sprout,
  Truck,
  Waves,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/shared/Container";

const industries: {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Smart Manufacturing",
    description: "Connect machines, monitor production, and prevent downtime with predictive insights.",
    image: "/about/smart-manufacturing.jpg",
    imageAlt: "Engineer monitoring industrial machinery on a factory floor",
    icon: Factory,
  },
  {
    title: "Agriculture & Smart Farming",
    description: "Make every growing decision smarter with soil, crop, and climate data in real time.",
    image: "/about/smart-farming.jpg",
    imageAlt: "Green cultivated fields under a wide open sky",
    icon: Sprout,
  },
  {
    title: "Healthcare",
    description: "Keep connected medical devices, patient monitoring, and critical equipment in view.",
    image: "/about/healthcare.jpg",
    imageAlt: "Healthcare professional reviewing patient information on a tablet",
    icon: HeartPulse,
  },
  {
    title: "Energy & Utilities",
    description: "Track consumption, optimize power use, and improve visibility across the grid.",
    image: "/about/energy-utilities.jpg",
    imageAlt: "Electricity transmission towers crossing an open landscape",
    icon: Lightbulb,
  },
  {
    title: "Transportation & Logistics",
    description: "Follow fleets and assets with location, condition, and operational data in real time.",
    image: "/about/transportation-logistics.jpg",
    imageAlt: "Packages moving through a logistics and distribution warehouse",
    icon: Truck,
  },
  {
    title: "Smart Cities",
    description: "Build more responsive infrastructure with connected lighting and environmental sensing.",
    image: "/about/smart-cities.jpg",
    imageAlt: "City skyline illuminated after dusk",
    icon: Building2,
  },
  {
    title: "Oil, Gas & Mining",
    description: "Monitor equipment and hazardous environments to support safer, more reliable operations.",
    image: "/about/oil-gas-mining.jpg",
    imageAlt: "Industrial facility with pipes and processing equipment",
    icon: Pickaxe,
  },
  {
    title: "Buildings & Infrastructure",
    description: "Improve building performance with smarter HVAC, occupancy, and energy monitoring.",
    image: "/about/buildings-infrastructure.jpg",
    imageAlt: "Modern high-rise office buildings viewed from below",
    icon: Waves,
  },
];

export function IndustriesSection() {
  return (
    <section aria-labelledby="industries-heading" className="bg-[#f5f8fc] py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#087eae]">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
            Industries we serve
          </p>
          <h2
            className="mt-4 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl"
            id="industries-heading"
          >
            Industries We Empower with IoT
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-text md:text-lg">
            Delivering intelligent, connected solutions that improve efficiency, visibility, and performance across industries.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-7">
          {industries.map(({ title, description, image, imageAlt, icon: Icon }) => (
            <article
              className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_18px_44px_rgba(15,23,42,0.12)] motion-reduce:transition-none"
              key={title}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                <Image
                  alt={imageAlt}
                  className="object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  src={image}
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0b1f3a]/45 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 bg-white/95 text-[#087eae] shadow-lg backdrop-blur-sm">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
              </div>
              <div className="p-6 md:p-7">
                <h3 className="font-heading text-xl font-bold tracking-tight text-primary">{title}</h3>
                <p className="mt-3 min-h-[3.5rem] text-sm leading-6 text-muted-text">{description}</p>
                <Link
                  aria-label={`Explore ${title} solutions`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#087eae] transition-colors hover:text-primary"
                  href="/products"
                >
                  Explore Solutions
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
