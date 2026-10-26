import { ArrowRight, CircuitBoard, Cpu, Glasses, Lightbulb, Settings2, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import type { LabSolution } from "@/types";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  CircuitBoard,
  Cpu,
  Glasses,
  Lightbulb,
  Settings2,
  Zap,
};

const audienceLabels = {
  school: "School",
  college: "College",
  iti: "ITI",
  polytechnic: "Polytechnic",
  industry: "Industry",
} as const;

export function LabCard({ solution }: { solution: LabSolution }) {
  const Icon = iconMap[solution.icon] ?? CircuitBoard;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <Image
          alt={`${solution.name} illustration`}
          className="object-cover transition duration-500 group-hover:scale-105"
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          src={solution.heroImage}
        />
        <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-accent shadow-lg">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-heading text-xl font-bold text-primary">{solution.name}</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-accent">{solution.tagline}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-text">{solution.shortDescription}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {solution.idealFor.map((audience) => (
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-text" key={audience}>
              {audienceLabels[audience]}
            </span>
          ))}
        </div>
        <Link
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-accent"
          href={`/lab-solutions/${solution.slug}`}
        >
          View Lab <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
