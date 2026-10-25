import { getCategories } from "@/lib/api";
import { siteConfig } from "@/lib/site-config";

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-background">
      <section className="bg-primary px-6 py-24 text-primary-foreground">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
            {siteConfig.shortName}
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-200">
            B2B lab equipment, intelligent learning systems and practical AK- kits for institutions and industry.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Catalogue foundation</p>
        <h2 className="mt-3 text-3xl font-bold text-primary">Explore technical learning systems</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <article className="rounded-2xl border bg-white p-5 shadow-sm" key={category.id}>
              <h3 className="font-semibold text-primary">{category.name}</h3>
              <p className="mt-2 text-sm text-muted-text">{category.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
