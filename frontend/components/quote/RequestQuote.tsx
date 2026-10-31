"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  FileText,
  FileCheck2,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Radio,
  Settings2,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { useQuoteStore } from "@/store/quote-store";

const productCategories = [
  "IoT Sensors",
  "IoT Gateways",
  "Smart Meters",
  "Controllers & Automation Devices",
  "GPS & Asset Trackers",
  "Wireless Communication Modules",
  "Embedded Systems",
  "Custom IoT Hardware",
  "Other",
];

const quantityRanges = ["1–10 units", "11–50 units", "51–100 units", "101–500 units", "500+ units", "Not yet decided"];

const purchaseTypes = [
  "One-time purchase",
  "Bulk order",
  "Recurring requirement",
  "Sample or prototype",
  "Custom manufacturing",
];

const budgetRanges = [
  "Not yet decided",
  "Under 1,000",
  "1,000–5,000",
  "5,000–10,000",
  "10,000–50,000",
  "Over 50,000",
  "Prefer not to say",
];

const purchaseTimelines = [
  "Immediately",
  "Within 1 month",
  "Within 3 months",
  "Within 6 months",
  "Researching options",
];

const industries = [
  "Manufacturing",
  "Agriculture",
  "Healthcare",
  "Energy & Utilities",
  "Logistics & Transportation",
  "Smart Cities",
  "Buildings & Infrastructure",
  "Oil, Gas & Mining",
  "Education",
  "Other",
];

const connectivityOptions = ["Wi-Fi", "Bluetooth", "LoRaWAN", "Zigbee", "Cellular / 4G / 5G", "Ethernet", "Other", "Not sure yet"];

const helpItems: { title: string; icon: LucideIcon }[] = [
  { title: "Product selection assistance", icon: PackageCheck },
  { title: "Bulk purchasing enquiries", icon: Building2 },
  { title: "Technical specification discussions", icon: Settings2 },
  { title: "Custom IoT product enquiries", icon: Wrench },
];

const steps: { number: string; title: string; description: string; icon: LucideIcon }[] = [
  {
    number: "01",
    title: "Share Your Requirements",
    description: "Tell us which IoT products you need, your application, and your estimated quantity.",
    icon: ClipboardList,
  },
  {
    number: "02",
    title: "Requirements Review",
    description: "The team reviews your enquiry and checks the details needed for a quotation.",
    icon: BadgeCheck,
  },
  {
    number: "03",
    title: "Quotation Follow-Up",
    description: "The team contacts you regarding pricing, specifications, and next steps.",
    icon: Mail,
  },
];

const faqs = [
  {
    question: "What information should I provide to request a quote?",
    answer:
      "Include the product category or model, estimated quantity, intended application, country, and any technical or connectivity requirements you already know. More context can help the team review your request.",
  },
  {
    question: "Can I request pricing for bulk orders?",
    answer:
      "Yes, you can indicate your estimated quantity and select “Bulk order” so your purchasing requirements are clear. Pricing and availability are confirmed separately after review.",
  },
  {
    question: "Can I request a quote for custom IoT hardware?",
    answer:
      "Choose “Custom IoT Hardware” and describe your use case and technical requirements. The team can review the information and discuss whether a suitable approach is available.",
  },
  {
    question: "Can I ask for a sample or prototype?",
    answer:
      "You can select “Sample or prototype” as the purchase type. Availability and any applicable terms need to be confirmed by the team.",
  },
  {
    question: "Can I submit technical specifications with my request?",
    answer:
      "You can paste key specifications into the technical requirements field. File uploads are not available until a secure upload and submission service is configured.",
  },
  {
    question: "Is submitting a quote request a purchase commitment?",
    answer:
      "No. A quote request is an enquiry only; it does not confirm an order, pricing, or a purchase commitment.",
  },
];

type QuoteValues = {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  jobTitle: string;
  country: string;
  productCategory: string;
  productName: string;
  quantity: string;
  productModel: string;
  purchaseType: string;
  currency: string;
  budget: string;
  timeline: string;
  industry: string;
  application: string;
  technicalRequirements: string;
  connectivity: string;
  comments: string;
  consent: boolean;
};

type QuoteErrors = Partial<Record<keyof QuoteValues, string>>;

const initialValues: QuoteValues = {
  fullName: "",
  email: "",
  company: "",
  phone: "",
  jobTitle: "",
  country: "",
  productCategory: "",
  productName: "",
  quantity: "",
  productModel: "",
  purchaseType: "",
  currency: "",
  budget: "",
  timeline: "",
  industry: "",
  application: "",
  technicalRequirements: "",
  connectivity: "",
  comments: "",
  consent: false,
};

function validate(values: QuoteValues): QuoteErrors {
  const errors: QuoteErrors = {};
  if (!values.fullName.trim()) errors.fullName = "Enter your full name.";
  if (!values.email.trim()) {
    errors.email = "Enter your business email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.company.trim()) errors.company = "Enter your company name.";
  if (values.phone.trim() && (!/^\+?[\d\s().-]+$/.test(values.phone.trim()) || values.phone.replace(/\D/g, "").length < 7)) {
    errors.phone = "Enter a valid phone number or leave this field blank.";
  }
  if (!values.country.trim()) errors.country = "Enter your country.";
  if (!values.productCategory) errors.productCategory = "Choose a product category.";
  if (!values.quantity) errors.quantity = "Choose an estimated quantity.";
  if (!values.consent) errors.consent = "Consent is required to submit a quotation request.";
  return errors;
}

async function submitQuoteRequest(payload: QuoteValues): Promise<void> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
  const response = await fetch(`${apiBaseUrl}/api/v1/quote-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: payload.fullName,
      email: payload.email,
      company: payload.company,
      phone: payload.phone,
      jobTitle: payload.jobTitle,
      country: payload.country,
      productCategory: payload.productCategory,
      productName: payload.productName,
      quantity: payload.quantity,
      productModel: payload.productModel,
      purchaseType: payload.purchaseType,
      currency: payload.currency,
      budget: payload.budget,
      timeline: payload.timeline,
      industry: payload.industry,
      application: payload.application,
      technicalRequirements: payload.technicalRequirements,
      connectivity: payload.connectivity,
      comments: payload.comments,
      consent: payload.consent,
    }),
  });

  if (!response.ok) {
    let message = "Your quotation request could not be submitted.";

    try {
      const data = (await response.json()) as { detail?: string };
      if (data.detail) {
        message = data.detail;
      }
    } catch {
      // Ignore invalid JSON payloads and use the fallback message.
    }

    throw new Error(message);
  }
}

export function RequestQuote({
  initialProductName = "",
  initialProductModel = "",
}: {
  initialProductName?: string;
  initialProductModel?: string;
}) {
  const quoteItems = useQuoteStore((state) => state.items);
  const [values, setValues] = useState<QuoteValues>(() => ({
    ...initialValues,
    productName: initialProductName,
    productModel: initialProductModel,
  }));
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  function update<K extends keyof QuoteValues>(field: K, value: QuoteValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setFormMessage(null);
    if (Object.keys(validationErrors).length) {
      document.getElementById(Object.keys(validationErrors)[0])?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await submitQuoteRequest(values);
      setFormMessage({ type: "success", text: "Your quotation request has been received." });
      setValues(initialValues);
      setErrors({});
    } catch (error) {
      setFormMessage({
        type: "error",
        text: error instanceof Error ? error.message : "We could not submit your request. Your information has been preserved.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="quote-page">
      <section className="quote-hero relative isolate overflow-hidden">
        <div aria-hidden="true" className="quote-hero-pattern absolute inset-0 -z-10" />
        <Container className="grid items-center gap-10 py-14 sm:py-18 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:py-20">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
              Request a quote
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Let&apos;s Find the Right IoT Solution for Your Business
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Tell us about your product requirements, project goals, and quantity needs. Our team will review your enquiry and help you explore the right IoT hardware solutions for your application.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {["Product and Bulk Order Enquiries", "Custom IoT Requirements", "Business & Industrial Solutions"].map((item) => (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-100" key={item}>
                  <Check aria-hidden="true" className="h-3.5 w-3.5 text-cyan-300" /> {item}
                </span>
              ))}
            </div>
            <Link className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-primary transition hover:-translate-y-0.5 hover:bg-cyan-300" href="#quote-form">
              Get a Quote <ArrowDown aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:justify-self-end">
            <div aria-hidden="true" className="absolute -inset-3 rounded-[1.75rem] border border-cyan-300/15" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-slate-800 shadow-2xl shadow-black/30">
              <Image
                alt="Electronic circuitry used in connected IoT hardware"
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                src="/about/smart-manufacturing.jpg"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#252a34]/70 via-[#252a34]/5 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">Connected hardware</p>
                  <p className="mt-1 font-heading text-lg font-semibold text-white sm:text-xl">A clearer path to the right solution</p>
                </div>
                <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section aria-label="Quotation request form" className="quote-form-section bg-[#f5f8fc] py-12 sm:py-16">
        <Container className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_310px] xl:gap-8">
          <form className="quote-form-card rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10" id="quote-form" noValidate onSubmit={handleSubmit}>
            <div className="mb-8 border-b border-slate-200 pb-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087eae]">Tell us what you need</p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-primary sm:text-3xl">Request a Quotation</h2>
              <p className="mt-2 text-sm leading-6 text-muted-text">Fields marked <span className="font-bold text-red-700">*</span> are required.</p>
            </div>

            {quoteItems.length > 0 ? (
              <div className="mb-8 rounded-xl border border-sky-100 bg-sky-50/70 p-4 sm:p-5">
                <div className="flex items-center gap-2">
                  <FileCheck2 aria-hidden="true" className="h-5 w-5 text-[#087eae]" />
                  <h3 className="font-heading text-sm font-bold text-primary">Products added to your quote</h3>
                </div>
                <ul className="mt-3 divide-y divide-sky-100">
                  {quoteItems.map((item) => (
                    <li className="flex items-center justify-between gap-4 py-2 text-sm" key={item.id}>
                      {item.type === "product" ? (
                        <Link className="font-semibold text-primary hover:text-[#087eae]" href={`/product/${item.slug}`}>{item.name}</Link>
                      ) : (
                        <span className="font-semibold text-primary">{item.name}</span>
                      )}
                      <span className="shrink-0 text-xs font-medium text-slate-600">Qty: {item.quantity}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs leading-5 text-slate-600">These selections are stored in this browser and are not sent until a quote service is configured.</p>
              </div>
            ) : null}

            <FormSection number="01" icon={Building2} title="Contact Information" description="Let us know who to contact about this request.">
              <Field id="fullName" label="Full Name" required error={errors.fullName}>
                <input autoComplete="name" className={inputClass(errors.fullName)} id="fullName" name="fullName" onChange={(e) => update("fullName", e.target.value)} required aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "fullName-error" : undefined} value={values.fullName} />
              </Field>
              <Field id="email" label="Business Email" required error={errors.email}>
                <input autoComplete="email" className={inputClass(errors.email)} id="email" name="email" onChange={(e) => update("email", e.target.value)} required type="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} value={values.email} />
              </Field>
              <Field id="company" label="Company Name" required error={errors.company}>
                <input autoComplete="organization" className={inputClass(errors.company)} id="company" name="company" onChange={(e) => update("company", e.target.value)} required aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? "company-error" : undefined} value={values.company} />
              </Field>
              <Field id="phone" label="Phone Number" optional error={errors.phone}>
                <input autoComplete="tel" className={inputClass(errors.phone)} id="phone" inputMode="tel" name="phone" onChange={(e) => update("phone", e.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} value={values.phone} />
              </Field>
              <Field id="jobTitle" label="Job Title" optional>
                <input autoComplete="organization-title" className={inputClass()} id="jobTitle" name="jobTitle" onChange={(e) => update("jobTitle", e.target.value)} value={values.jobTitle} />
              </Field>
              <Field id="country" label="Country" required error={errors.country}>
                <input autoComplete="country-name" className={inputClass(errors.country)} id="country" name="country" onChange={(e) => update("country", e.target.value)} required aria-invalid={Boolean(errors.country)} aria-describedby={errors.country ? "country-error" : undefined} value={values.country} />
              </Field>
            </FormSection>

            <FormSection number="02" icon={PackageCheck} title="Product Requirements" description="Product category and quantity help us understand the scope.">
              <Field id="productCategory" label="Product Category" required error={errors.productCategory}>
                <SelectField id="productCategory" value={values.productCategory} onChange={(value) => update("productCategory", value)} options={productCategories} placeholder="Select a product category" error={errors.productCategory} required />
              </Field>
              <Field id="productName" label="Product Name or Model" optional>
                <input className={inputClass()} id="productName" name="productName" onChange={(e) => update("productName", e.target.value)} placeholder="Enter a name or model number" value={values.productName} />
              </Field>
              <Field id="productModel" label="Model Number" optional>
                <input className={inputClass()} id="productModel" name="productModel" onChange={(e) => update("productModel", e.target.value)} placeholder="Enter the model number" value={values.productModel} />
              </Field>
              <Field id="quantity" label="Estimated Quantity" required error={errors.quantity}>
                <SelectField id="quantity" value={values.quantity} onChange={(value) => update("quantity", value)} options={quantityRanges} placeholder="Select quantity" error={errors.quantity} required />
              </Field>
              <Field id="purchaseType" label="Purchase Type" optional>
                <SelectField id="purchaseType" value={values.purchaseType} onChange={(value) => update("purchaseType", value)} options={purchaseTypes} placeholder="Select purchase type" />
              </Field>
              <Field id="currency" label="Budget Currency" optional>
                <SelectField id="currency" value={values.currency} onChange={(value) => update("currency", value)} options={["USD", "EUR", "GBP", "INR", "Other"]} placeholder="Select currency" />
              </Field>
              <Field id="budget" label="Budget Range" optional>
                <SelectField id="budget" value={values.budget} onChange={(value) => update("budget", value)} options={budgetRanges} placeholder="Select an indicative range" />
              </Field>
              <Field id="timeline" label="Expected Purchase Timeline" optional>
                <SelectField id="timeline" value={values.timeline} onChange={(value) => update("timeline", value)} options={purchaseTimelines} placeholder="Select a timeline" />
              </Field>
            </FormSection>

            <FormSection number="03" icon={Radio} title="Project Specifications" description="Application and technical context can help us review suitability.">
              <Field id="industry" label="Industry" optional>
                <SelectField id="industry" value={values.industry} onChange={(value) => update("industry", value)} options={industries} placeholder="Select an industry" />
              </Field>
              <Field id="application" label="Application / Use Case" optional>
                <input className={inputClass()} id="application" name="application" onChange={(e) => update("application", e.target.value)} placeholder="What are you looking to monitor or control?" value={values.application} />
              </Field>
              <div className="sm:col-span-2">
                <Field id="technicalRequirements" label="Technical Requirements" optional hint="Include known specifications, operating conditions, interfaces, or compliance needs. If some details are unknown, describe what you are trying to achieve.">
                  <textarea className={`${inputClass()} min-h-32 resize-y`} id="technicalRequirements" name="technicalRequirements" onChange={(e) => update("technicalRequirements", e.target.value)} placeholder="Describe the technical requirements for your application" rows={4} value={values.technicalRequirements} />
                </Field>
              </div>
              <Field id="connectivity" label="Preferred Connectivity" optional>
                <SelectField id="connectivity" value={values.connectivity} onChange={(value) => update("connectivity", value)} options={connectivityOptions} placeholder="Select a connectivity option" />
              </Field>
              <Field id="comments" label="Additional Comments" optional>
                <textarea className={`${inputClass()} min-h-11 resize-y`} id="comments" name="comments" onChange={(e) => update("comments", e.target.value)} placeholder="Anything else we should know?" rows={2} value={values.comments} />
              </Field>
              <div className="sm:col-span-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <FileText aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                  <div>
                    <p className="text-sm font-semibold text-primary">Datasheet or specification upload</p>
                    <p className="mt-1 text-xs leading-5 text-muted-text">File uploads are not available until a secure upload endpoint is configured. You can include relevant details in the technical requirements field above.</p>
                  </div>
                </div>
              </div>
            </FormSection>

            <div className="border-t border-slate-200 pt-6">
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-600" htmlFor="consent">
                <input checked={values.consent} className="mt-1 h-4 w-4 shrink-0 accent-[#087eae]" id="consent" name="consent" onChange={(e) => update("consent", e.target.checked)} required type="checkbox" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "consent-error" : undefined} />
                <span>I agree to the <span className="font-semibold text-primary">Privacy Policy</span> and consent to being contacted regarding this quotation request.</span>
              </label>
              {errors.consent ? <p className="mt-1 pl-7 text-xs font-medium text-red-700" id="consent-error">{errors.consent}</p> : null}
              <button className="rfq-submit-button mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#12365f] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto" disabled={isSubmitting} type="submit">
                {isSubmitting ? (
                  <><span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" /> Submitting…</>
                ) : (
                  <>Submit Quote Request <ArrowRight aria-hidden="true" className="h-4 w-4" /></>
                )}
              </button>
              <p className="mt-3 text-xs leading-5 text-muted-text">Our team will review your requirements and follow up using the contact details you provide.</p>
              <p className="mt-2 text-xs leading-5 text-amber-800">Form delivery is not configured yet. Submitting will not send or store your information.</p>
              {formMessage ? (
                <p aria-live="polite" className={`mt-4 flex items-start gap-2 text-sm font-medium leading-6 ${formMessage.type === "success" ? "text-emerald-700" : "text-red-700"}`} role={formMessage.type === "error" ? "alert" : "status"}>
                  {formMessage.type === "success" ? <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0" /> : <CircleHelp aria-hidden="true" className="mt-1 h-4 w-4 shrink-0" />}
                  {formMessage.text}
                </p>
              ) : null}
            </div>
          </form>

          <aside className="space-y-5 xl:sticky xl:top-28">
            <div className="rfq-guidance rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#087eae]">Here to help</p>
              <h2 className="mt-2 font-heading text-xl font-bold text-primary">Need Help With Your Requirements?</h2>
              <ul className="mt-5 space-y-4">
                {helpItems.map(({ title, icon: Icon }) => (
                  <li className="flex items-center gap-3 text-sm font-medium text-slate-700" key={title}>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-[#087eae]"><Icon aria-hidden="true" className="h-4 w-4" /></span>
                    {title}
                  </li>
                ))}
              </ul>
              <Link className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-primary transition hover:border-sky-200 hover:bg-sky-50" href="/contact">
                Contact Our Team <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-2xl bg-primary p-5 text-white sm:p-6">
              <h3 className="font-heading text-lg font-bold">Sales contact details</h3>
              <p className="mt-1 text-sm leading-6 text-slate-300">Official contact information can be added when verified.</p>
              <div className="mt-5 space-y-4 border-t border-white/15 pt-5 text-sm">
                <ContactPlaceholder icon={Mail} label="Sales email" />
                <ContactPlaceholder icon={Phone} label="Business phone" />
                <ContactPlaceholder icon={MapPin} label="Office address" />
              </div>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-5">
              <div className="flex gap-3">
                <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#087eae]" />
                <div>
                  <h3 className="text-sm font-bold text-primary">Your details stay here for now</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-600">There is no configured RFQ service. Form data is not transmitted or saved when you submit.</p>
                </div>
              </div>
            </div>
          </aside>
        </Container>
      </section>

      <section aria-labelledby="how-it-works" className="quote-process py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087eae]">What happens next</p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl" id="how-it-works">How It Works</h2>
          </div>
          <div className="relative mt-10 grid gap-5 md:grid-cols-3 md:gap-7">
            <div aria-hidden="true" className="absolute left-[16.6%] right-[16.6%] top-10 hidden border-t border-dashed border-sky-300 md:block" />
            {steps.map(({ number, title, description, icon: Icon }) => (
              <article className="relative rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-7" key={number}>
                <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-sky-50 text-[#087eae] shadow-sm">
                  <Icon aria-hidden="true" className="h-6 w-6" />
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">{number}</span>
                </span>
                <h3 className="mt-5 font-heading text-lg font-bold text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-text">{description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="quote-faq-heading" className="quote-faq bg-[#f5f8fc] py-14 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087eae]">Need to know</p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl" id="quote-faq-heading">Frequently Asked Questions</h2>
            <p className="mt-4 leading-7 text-muted-text">Helpful notes about preparing and submitting a quotation request.</p>
          </div>
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5 sm:px-7">
            {faqs.map(({ question, answer }) => (
              <details className="group py-1" key={question}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-heading text-sm font-bold leading-6 text-primary marker:content-none [&::-webkit-details-marker]:hidden">
                  {question}
                  <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-[#087eae] transition group-open:rotate-45">
                    <span className="text-xl font-normal leading-none">+</span>
                  </span>
                </summary>
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-open:grid-rows-[1fr] motion-reduce:transition-none">
                  <div className="overflow-hidden"><p className="max-w-2xl pb-5 pr-10 text-sm leading-6 text-muted-text">{answer}</p></div>
                </div>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}

function inputClass(error?: string) {
  return `mt-1.5 min-h-11 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-primary outline-none transition placeholder:text-slate-400 focus:border-[#087eae] focus:ring-2 focus:ring-sky-100 ${
    error ? "border-red-500" : "border-slate-300"
  }`;
}

function FormSection({ number, icon: Icon, title, description, children }: { number: string; icon: LucideIcon; title: string; description: string; children: ReactNode }) {
  return (
    <section className="rfq-panel mb-8 border-b border-slate-200 pb-8 last:border-0">
      <div className="mb-5 flex items-start gap-3">
        <span className="rfq-panel-icon relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#087eae]"><Icon aria-hidden="true" className="h-5 w-5" /><span className="rfq-panel-number">{number}</span></span>
        <div>
          <h3 className="font-heading text-lg font-bold text-primary">{title}</h3>
          <p className="mt-0.5 text-xs leading-5 text-muted-text">{description}</p>
        </div>
      </div>
      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  required = false,
  optional = false,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-primary" htmlFor={id}>
        {label}
        {required ? <span className="ml-1 text-red-700" aria-hidden="true">*</span> : null}
        {optional ? <span className="ml-1.5 text-xs font-normal text-slate-500">(optional)</span> : null}
      </label>
      {children}
      {hint ? <p className="mt-1.5 text-xs leading-5 text-muted-text">{hint}</p> : null}
      {error ? <p className="mt-1 text-xs font-medium text-red-700" id={`${id}-error`}>{error}</p> : null}
    </div>
  );
}

function SelectField({
  id,
  value,
  onChange,
  options,
  placeholder,
  error,
  required = false,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <select
        className={`${inputClass(error)} appearance-none pr-10`}
        id={id}
        name={id}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
    </div>
  );
}

function ContactPlaceholder({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <p className="flex items-center gap-3 text-sm text-slate-300">
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-cyan-300" />
      <span><span className="font-semibold text-white">{label}:</span> Add verified details</span>
    </p>
  );
}
