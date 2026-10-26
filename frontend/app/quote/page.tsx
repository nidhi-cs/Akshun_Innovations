import type { Metadata } from "next";
import { RequestQuote } from "@/components/quote/RequestQuote";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Share your IoT product, quantity, and project requirements to request a quotation from Akshunn Innovations.",
};

interface QuotePageProps {
  searchParams: Promise<{ product?: string; model?: string }>;
}

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const params = await searchParams;
  const productName = params.product?.trim().slice(0, 200) ?? "";
  const productModel = params.model?.trim().slice(0, 100) ?? "";

  return <RequestQuote initialProductName={productName} initialProductModel={productModel} />;
}
