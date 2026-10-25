import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QuoteItem } from "@/types";

interface QuoteStore {
  items: QuoteItem[];
  addItem: (item: Omit<QuoteItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) => set((state) => {
        const existing = state.items.find((entry) => entry.id === item.id);
        if (existing) {
          return { items: state.items.map((entry) => entry.id === item.id ? { ...entry, quantity: entry.quantity + quantity } : entry) };
        }
        return { items: [...state.items, { ...item, quantity }] };
      }),
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "akshunn-quote-cart" },
  ),
);
