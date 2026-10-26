import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/shared/Container";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle: string;
  breadcrumbs: Breadcrumb[];
}

export function PageHeader({ title, subtitle, breadcrumbs }: PageHeaderProps) {
  return (
    <section className="border-b border-border bg-primary py-16 text-primary-foreground md:py-20">
      <Container>
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-slate-300">
          {breadcrumbs.map((breadcrumb, index) => (
            <span className="flex items-center gap-2" key={`${breadcrumb.label}-${index}`}>
              {breadcrumb.href ? (
                <Link className="transition-colors hover:text-white" href={breadcrumb.href}>
                  {breadcrumb.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-white">
                  {breadcrumb.label}
                </span>
              )}
              {index < breadcrumbs.length - 1 ? <ChevronRight aria-hidden="true" className="h-4 w-4" /> : null}
            </span>
          ))}
        </nav>
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-accent">Built for better learning</p>
        <h1 className="mt-3 max-w-4xl font-heading text-4xl font-bold tracking-tight md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">{subtitle}</p>
      </Container>
    </section>
  );
}
