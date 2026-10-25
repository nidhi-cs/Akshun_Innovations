"use client";

import { Check, FilePlus2 } from "lucide-react";
import { useState } from "react";
import { useQuoteStore } from "@/store/quote-store";

interface AddToQuoteButtonProps {
  id: string;
  name: string;
  slug: string;
  className?: string;
}

export function AddToQuoteButton({ id, name, slug, className = "" }: AddToQuoteButtonProps) {
  const addItem = useQuoteStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ id, name, slug, type: "product" });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      aria-label={`Add ${name} to quote`}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-primary transition hover:border-accent hover:bg-muted ${className}`}
      onClick={handleAdd}
      title="Add to Quote"
      type="button"
    >
      {added ? <Check aria-hidden="true" className="h-4 w-4 text-accent" /> : <FilePlus2 aria-hidden="true" className="h-4 w-4" />}
    </button>
  );
}
