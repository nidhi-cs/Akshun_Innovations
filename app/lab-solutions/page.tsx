import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardList, GraduationCap, Ruler, Wrench } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Container } from "@/components/shared/Container";
import { LabAudienceFilters } from "@/components/catalogue/LabAudienceFilters";
import { LabCard } from "@/components/catalogue/LabCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { getLabSolutions } from "@/lib/api";
import type { Audience } from "@/types";

export const metadata: Metadata = {
  title: "Lab Solutions",
  description: "Complete, ready-to-teach labs for schools, colleges, polytechnics, ITIs and industry.",
};

const processSteps = [
  { title: "Consultation", description: "Understand your curriculum, space and learner goals.", icon: ClipboardList },
  { title: "Lab Design", description: "Shape the equipment, layout and learning journey.", icon: Ruler },
  { title: "Supply & Installation", description: "Coordinate delivery, setup and commissioning.", icon: Wrench },
  { title: "Training & Support", description: "Help your faculty start teaching with confidence.", icon: GraduationCap },
];

const validAudiences: Audience[] = ["school", "college", "polytechnic", "iti", "industry"];

interface LabSolutionsPageProps {
  searchParams: Promise<{ for?: string }>;
}

export default async function LabSolutionsPage({ searchParams }: LabSolutionsPageProps) {
  const { for: audienceParam } = await searchParams;
  const selectedAudience: Audience | "all" = validAudiences.includes(audienceParam as Audience)
    ? (audienceParam as Audience)
    : "all";
  const solutions = await getLabSolutions();
  const filteredSolutions =
    selectedAudience === "all"
      ? solutions
      : solutions.filter((solution) => solution.idealFor.includes(selectedAudience));

  return (
    <main>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Lab Solutions" }]}
        subtitle="Complete, ready-to-teach labs for schools, colleges, polytechnics, ITIs and industry"
        title="Lab Solutions"
      />

      <section className="bg-muted py-8">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Find your fit</p>
              <h2 className="mt-1 font-heading text-2xl font-bold text-primary">Explore by audience</h2>
            </div>
            <LabAudienceFilters selected={selectedAudience} />
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          {filteredSolutions.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSolutions.map((solution) => (
                <AnimatedSection key={solution.id}>
                  <LabCard solution={solution} />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-muted px-6 py-16 text-center">
              <h2 className="font-heading text-2xl font-bold text-primary">No lab solutions match this audience</h2>
              <p className="mx-auto mt-3 max-w-lg text-muted-text">Try another audience to explore the available lab environments.</p>
              <Link className="mt-6 inline-flex items-center gap-2 font-bold text-primary hover:text-accent" href="/lab-solutions">
                View all lab solutions <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          )}
        </Container>
      </section>

      <section className="border-y border-border bg-white py-16 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">A clear path forward</p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-primary md:text-4xl">How it works</h2>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-4">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div className="relative" key={step.title}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-accent">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-muted-text">0{index + 1}</p>
                  <h3 className="mt-2 font-heading text-lg font-bold text-primary">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-text">{step.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-primary py-16 text-white md:py-20">
        <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Plan with clarity</p>
            <h2 className="mt-3 max-w-2xl font-heading text-3xl font-bold md:text-4xl">Planning a new lab?</h2>
            <p className="mt-3 max-w-xl text-slate-200">Get a free lab proposal shaped around your learners, curriculum and space.</p>
          </div>
          <Link className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent-2 px-5 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg" href="/quote">
            Get a Free Lab Proposal <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </Container>
      </section>
    </main>
  );
}
