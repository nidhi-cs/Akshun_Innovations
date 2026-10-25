export type Audience = "school" | "college" | "iti" | "polytechnic" | "industry";

export interface Category {
  id: string;
  name: string;
  shortLabel: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  description: string;
  order: number;
}

export interface Product {
  id: string;
  modelNo: string;
  name: string;
  slug: string;
  categorySlug: string;
  subCategorySlug: string;
  shortDescription: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  experiments?: string[];
  includedAccessories?: string[];
  images: string[];
  datasheetUrl?: string;
  audience: Audience[];
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
}

export interface Kit extends Omit<Product, "experiments"> {
  level: string;
  components: string[];
  experiments: { title: string; summary: string }[];
  manualUrl?: string;
}

export type SetupTier = "basic" | "standard" | "advanced";

export interface LabSolution {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  shortDescription: string;
  overview: string;
  heroImage: string;
  icon: string;
  idealFor: Audience[];
  curriculumAlignment: string[];
  includes: { group: string; items: string[] }[];
  experiments: string[];
  learningOutcomes: string[];
  setupTiers: {
    tier: SetupTier;
    title: string;
    capacity: string;
    highlights: string[];
  }[];
  relatedProductSlugs: string[];
  relatedKitSlugs: string[];
  faqs: { question: string; answer: string }[];
  isFeatured: boolean;
}

export interface QuoteItem {
  id: string;
  type: "product" | "kit" | "lab";
  name: string;
  slug: string;
  quantity: number;
}

export interface ProductFilters {
  category?: string;
  subCategory?: string;
  audience?: Audience;
  q?: string;
  sort?: "relevance" | "name" | "model" | "newest";
  page?: number;
  pageSize?: number;
}

export interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
