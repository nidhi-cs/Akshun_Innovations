import type { Metadata } from "next";
import { IndustriesSection } from "@/components/industries/IndustriesSection";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
    "Explore connected IoT solutions for manufacturing, agriculture, healthcare, energy, logistics, smart cities, and more.",
};

export default function IndustriesPage() {
  return (
    <main>
      <IndustriesSection />
    </main>
  );
}
