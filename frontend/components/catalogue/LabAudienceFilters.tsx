"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Audience } from "@/types";

const filters: { label: string; value: Audience | "all" }[] = [
  { label: "All", value: "all" },
  { label: "School", value: "school" },
  { label: "College", value: "college" },
  { label: "Polytechnic", value: "polytechnic" },
  { label: "ITI", value: "iti" },
  { label: "Industry", value: "industry" },
];

export function LabAudienceFilters({ selected }: { selected: Audience | "all" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateFilter(value: Audience | "all") {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("for");
    } else {
      params.set("for", value);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div aria-label="Filter lab solutions by audience" className="flex gap-2 overflow-x-auto pb-2" role="group">
      {filters.map((filter) => {
        const isSelected = selected === filter.value;
        return (
          <button
            aria-pressed={isSelected}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              isSelected
                ? "border-primary bg-primary text-white"
                : "border-border bg-white text-muted-text hover:border-accent hover:text-primary"
            }`}
            key={filter.value}
            onClick={() => updateFilter(filter.value)}
            type="button"
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
