import type { Audience } from "@/types";

export const siteConfig = {
  name: "Akshunn Innovations Private Limited",
  shortName: "Akshunn Innovations",
  tagline: "Connecting Ideas with Intelligent Technology",
  description:
    "A B2B supplier of educational lab equipment and maker of AK- branded IoT and STEM learning kits.",
  phone: "+91-XXXXXXXXXX", // TODO: replace with the verified sales phone number.
  email: "sales@akshunn.example", // TODO: replace with the verified business email.
  whatsapp: "91XXXXXXXXXX", // TODO: replace with the verified WhatsApp number.
  address: "Ambala, Haryana, India", // TODO: replace with the registered office address.
  social: {
    linkedin: "#", // TODO: replace with the verified company profile.
    youtube: "#", // TODO: replace with the verified company channel.
  },
  navItems: [
    { label: "Products", href: "/products", hasMenu: true },
    { label: "AK- Kits", href: "/akshunn-kits", hasMenu: false },
    { label: "Lab Solutions", href: "/lab-solutions", hasMenu: false },
    { label: "Services", href: "/custom-development", hasMenu: false },
    { label: "About", href: "/about", hasMenu: false },
    { label: "Contact", href: "/contact", hasMenu: false },
  ],
  audiences: [
    { label: "Schools", value: "school" as Audience },
    { label: "Colleges & ITIs", value: "college" as Audience },
    { label: "Industry", value: "industry" as Audience },
  ],
} as const;
