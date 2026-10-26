import type { Metadata } from "next";
import { ContactUs } from "@/components/contact/ContactUs";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Akshunn Innovations about IoT products, connected devices, industrial sensors, and business enquiries.",
};

export default function ContactPage() {
  return <ContactUs />;
}
