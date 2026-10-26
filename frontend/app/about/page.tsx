import type { Metadata } from "next";
import { AboutUs } from "@/components/about/AboutUs";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn how Akshunn Innovations brings together connected hardware, sensors, and intelligent IoT solutions for modern industries.",
};

export default function AboutPage() {
  return <AboutUs />;
}
