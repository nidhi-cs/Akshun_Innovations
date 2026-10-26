"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  CircleHelp,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  PlugZap,
  Send,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { contactEmailRecipients } from "@/lib/contact-email-config";

const contactOptions: {
  title: string;
  description: string;
  emailRecipient: keyof typeof contactEmailRecipients;
  emailSubject: string;
  emailAriaLabel: string;
  icon: LucideIcon;
}[] = [
  {
    title: "General Enquiries",
    description: "Questions about our company and services",
    emailRecipient: "general",
    emailSubject: "General Enquiry - AKSHUNN Intelligent Technology",
    emailAriaLabel: "Email general enquiries",
    icon: MessageSquareText,
  },
  {
    title: "Sales & Product Enquiries",
    description: "Product specifications, pricing, and quotations",
    emailRecipient: "sales",
    emailSubject: "Product Enquiry and Quotation - AKSHUNN",
    emailAriaLabel: "Email the sales team",
    icon: Building2,
  },
  {
    title: "Technical Support",
    description: "Product integration and technical assistance",
    emailRecipient: "support",
    emailSubject: "Technical Support Request - AKSHUNN",
    emailAriaLabel: "Email technical support",
    icon: Wrench,
  },
  {
    title: "Business Partnerships",
    description: "Distribution, collaboration, and OEM opportunities",
    emailRecipient: "partnerships",
    emailSubject: "Business Partnership Enquiry - AKSHUNN",
    emailAriaLabel: "Email the partnerships team",
    icon: BriefcaseBusiness,
  },
];

function buildContactMailto(recipient: string, subject: string) {
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}`;
}

const enquiryTypes = [
  "Product Enquiry",
  "Request a Quote",
  "Technical Support",
  "Custom IoT Solution",
  "Distribution & Partnership",
  "General Enquiry",
];

const faqs = [
  {
    question: "How can I request a quotation for an IoT product?",
    answer:
      "Choose “Request a Quote” in the enquiry form and include the product, quantity, and any relevant requirements. The form is awaiting a configured submission endpoint, so enquiries cannot currently be delivered through this page.",
  },
  {
    question: "Can you help us choose the right IoT hardware?",
    answer:
      "Share your application, operating environment, and the information you need to monitor. This helps the team understand your requirements and identify relevant products.",
  },
  {
    question: "Do you provide custom IoT product development?",
    answer:
      "Select “Custom IoT Solution” and describe your requirements. The team can review the scope and confirm what options may be suitable.",
  },
  {
    question: "Can your products integrate with existing systems?",
    answer:
      "Integration depends on the product and the systems involved. Include the device, communication, and platform details in your enquiry so compatibility can be reviewed.",
  },
  {
    question: "How can I contact technical support?",
    answer:
      "Select “Technical Support” and provide the product name, setup details, and a description of the issue. A verified support email or working submission service has not yet been configured on this page.",
  },
  {
    question: "Do you support bulk orders or distribution partnerships?",
    answer:
      "Select “Distribution & Partnership” and share your organization and requirements. Availability and terms can be discussed after your enquiry is reviewed.",
  },
];

type FormValues = {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  enquiryType: string;
  productOrIndustry: string;
  message: string;
  consent: boolean;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  fullName: "",
  email: "",
  company: "",
  phone: "",
  enquiryType: "",
  productOrIndustry: "",
  message: "",
  consent: false,
};

function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^\+?[\d\s().-]+$/;

  if (!values.fullName.trim()) errors.fullName = "Enter your full name.";
  if (!values.email.trim()) {
    errors.email = "Enter your business email.";
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (values.phone.trim() && (!phonePattern.test(values.phone.trim()) || values.phone.replace(/\D/g, "").length < 7)) {
    errors.phone = "Enter a valid phone number or leave this field blank.";
  }
  if (!values.enquiryType) errors.enquiryType = "Choose an enquiry type.";
  if (!values.message.trim()) errors.message = "Tell us a little about your requirements.";
  if (!values.consent) errors.consent = "Please confirm that we may use your details to respond.";

  return errors;
}

async function submitEnquiry(): Promise<void> {
  // Replace this placeholder with the verified enquiry API endpoint before enabling delivery.
  throw new Error("Enquiry submission is not configured yet. Your message has not been sent.");
}

export function ContactUs() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateForm(values);
    setErrors(validationErrors);
    setFormMessage(null);

    if (Object.keys(validationErrors).length > 0) {
      document.getElementById(Object.keys(validationErrors)[0])?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await submitEnquiry();
      setFormMessage({ type: "success", text: "Your enquiry has been sent. Our team will be in touch." });
      setValues(initialValues);
      setErrors({});
    } catch (error) {
      setFormMessage({
        type: "error",
        text: error instanceof Error ? error.message : "We could not submit your enquiry. Your message has not been sent.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="contact-page">
      <section className="contact-hero relative isolate overflow-hidden">
        <div aria-hidden="true" className="contact-hero-pattern absolute inset-0 -z-10" />
        <Container className="grid items-center gap-10 py-14 sm:py-18 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:py-20">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
              Get in touch
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Let&apos;s Connect Your Business to a Smarter Future
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Have questions about our IoT products, industrial sensors, connected devices, or custom solutions? Our team is ready to understand your requirements and help you find the right technology for your business.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-100">
                <PlugZap aria-hidden="true" className="h-4 w-4 text-cyan-300" />
                Product &amp; Technical Enquiries
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-100">
                <BriefcaseBusiness aria-hidden="true" className="h-4 w-4 text-cyan-300" />
                Business &amp; Partnership Opportunities
              </span>
            </div>
            <a className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-cyan-200 transition hover:text-white" href="#contact-form">
              Tell us about your project <ArrowDownRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:justify-self-end">
            <div aria-hidden="true" className="absolute -inset-3 rounded-[1.75rem] border border-cyan-300/15" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-slate-800 shadow-2xl shadow-black/30">
              <Image
                alt="Engineer working with connected industrial hardware"
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                src="/about/hero-industrial.jpg"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#063f46]/65 via-[#063f46]/5 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">Connected technology</p>
                  <p className="mt-1 font-heading text-lg font-semibold text-white sm:text-xl">Let&apos;s find the right fit.</p>
                </div>
                <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section aria-label="Contact departments" className="contact-departments py-12 sm:py-16">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactOptions.map(({ title, description, emailRecipient, emailSubject, emailAriaLabel, icon: Icon }) => (
              <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg sm:p-6" key={title}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-[#087eae] transition group-hover:bg-sky-100">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-heading text-lg font-bold text-primary">{title}</h2>
                <p className="mt-2 min-h-10 text-sm leading-5 text-muted-text">{description}</p>
                {contactEmailRecipients[emailRecipient].trim() ? (
                  <a
                    aria-label={emailAriaLabel}
                    className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500 transition hover:text-[#087eae] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087eae] focus-visible:ring-offset-2"
                    href={buildContactMailto(contactEmailRecipients[emailRecipient].trim(), emailSubject)}
                  >
                    <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-[#087eae]" />
                    <span>{contactEmailRecipients[emailRecipient]}</span>
                  </a>
                ) : (
                  <div aria-label={`${title} email address needs configuration`} className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                    <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-[#087eae]" />
                    <span>Email address needs configuration</span>
                  </div>
                )}
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="contact-form-heading" className="contact-form-section bg-[#f5f8fc] py-14 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087eae]">We&apos;re ready to listen</p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl" id="contact-form-heading">Tell Us About Your Requirements</h2>
            <p className="mt-4 leading-7 text-muted-text">
              Share a few details about your project, product interest, or technical question. The form is prepared for integration with your enquiry service.
            </p>
            <div className="mt-7 rounded-xl border border-sky-100 bg-white p-5">
              <div className="flex gap-3">
                <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#087eae]" />
                <div>
                  <h3 className="text-sm font-bold text-primary">Your information</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-text">Details entered here remain in this browser and are not sent until a verified submission endpoint is connected.</p>
                </div>
              </div>
            </div>
          </div>

          <form className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-8" id="contact-form" noValidate onSubmit={handleSubmit}>
            <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
              <Field id="fullName" label="Full Name" error={errors.fullName}>
                <input
                  autoComplete="name"
                  className={inputClass(errors.fullName)}
                  id="fullName"
                  name="fullName"
                  onChange={(event) => updateField("fullName", event.target.value)}
                  required
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  value={values.fullName}
                />
              </Field>
              <Field id="email" label="Business Email" error={errors.email}>
                <input
                  autoComplete="email"
                  className={inputClass(errors.email)}
                  id="email"
                  name="email"
                  onChange={(event) => updateField("email", event.target.value)}
                  required
                  type="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  value={values.email}
                />
              </Field>
              <Field id="company" label="Company Name" optional>
                <input
                  autoComplete="organization"
                  className={inputClass()}
                  id="company"
                  name="company"
                  onChange={(event) => updateField("company", event.target.value)}
                  value={values.company}
                />
              </Field>
              <Field id="phone" label="Phone Number" error={errors.phone} optional>
                <input
                  autoComplete="tel"
                  className={inputClass(errors.phone)}
                  id="phone"
                  inputMode="tel"
                  name="phone"
                  onChange={(event) => updateField("phone", event.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  value={values.phone}
                />
              </Field>
              <Field id="enquiryType" label="Enquiry Type" error={errors.enquiryType}>
                <div className="relative">
                  <select
                    className={`${inputClass(errors.enquiryType)} appearance-none pr-10`}
                    id="enquiryType"
                    name="enquiryType"
                    onChange={(event) => updateField("enquiryType", event.target.value)}
                    required
                    aria-invalid={Boolean(errors.enquiryType)}
                    aria-describedby={errors.enquiryType ? "enquiryType-error" : undefined}
                    value={values.enquiryType}
                  >
                    <option value="">Select an enquiry type</option>
                    {enquiryTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                  <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </Field>
              <Field id="productOrIndustry" label="Product or Industry" optional>
                <input
                  className={inputClass()}
                  id="productOrIndustry"
                  name="productOrIndustry"
                  onChange={(event) => updateField("productOrIndustry", event.target.value)}
                  value={values.productOrIndustry}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field id="message" label="Message" error={errors.message}>
                  <textarea
                    className={`${inputClass(errors.message)} min-h-32 resize-y`}
                    id="message"
                    name="message"
                    onChange={(event) => updateField("message", event.target.value)}
                    required
                    rows={5}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    value={values.message}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-600" htmlFor="consent">
                  <input
                    checked={values.consent}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-[#087eae]"
                    id="consent"
                    name="consent"
                    onChange={(event) => updateField("consent", event.target.checked)}
                    required
                    type="checkbox"
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? "consent-error" : undefined}
                  />
                  <span>I agree that my details may be used to respond to this enquiry.</span>
                </label>
                {errors.consent ? <p className="mt-1 pl-7 text-sm text-red-700" id="consent-error">{errors.consent}</p> : null}
              </div>
              <div className="sm:col-span-2">
                <button
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#12365f] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? (
                    <>
                      <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" />
                      Sending…
                    </>
                  ) : (
                    <>Send Enquiry <Send aria-hidden="true" className="h-4 w-4" /></>
                  )}
                </button>
                {formMessage ? (
                  <p aria-live="polite" className={`mt-4 flex items-start gap-2 text-sm font-medium leading-6 ${formMessage.type === "success" ? "text-emerald-700" : "text-red-700"}`} role={formMessage.type === "error" ? "alert" : "status"}>
                    {formMessage.type === "success" ? <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0" /> : <CircleHelp aria-hidden="true" className="mt-1 h-4 w-4 shrink-0" />}
                    {formMessage.text}
                  </p>
                ) : null}
              </div>
            </div>
          </form>
        </Container>
      </section>

      <section aria-labelledby="office-heading" className="contact-office py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087eae]">Find us</p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl" id="office-heading">Visit Our Office</h2>
            <p className="mt-3 leading-7 text-muted-text">Office and contact details will be published here once verified.</p>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <OfficeDetail icon={MapPin} label="Company address" value="Add verified company address" />
              <OfficeDetail icon={Phone} label="Business phone" value="Add verified business phone" />
              <OfficeDetail icon={Mail} label="Official email" value="Add official company email" />
              <OfficeDetail icon={CircleHelp} label="Working hours" value="Add confirmed working hours" />
            </div>
            <div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[radial-gradient(ellipse_at_50%_30%,rgba(0,180,216,0.12),transparent_55%),linear-gradient(135deg,#f8fafc,#eef4f9)] p-8 text-center sm:min-h-72">
              <div aria-hidden="true" className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(11,31,58,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(11,31,58,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />
              <div className="relative max-w-sm">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#087eae] shadow-md"><MapPin aria-hidden="true" className="h-5 w-5" /></span>
                <h3 className="mt-4 font-heading text-lg font-bold text-primary">Location details coming soon</h3>
                <p className="mt-2 text-sm leading-6 text-muted-text">A map and directions will appear here when a verified office address is available.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="faq-heading" className="contact-faq bg-[#f5f8fc] py-14 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087eae]">Helpful information</p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl" id="faq-heading">Frequently Asked Questions</h2>
            <p className="mt-4 leading-7 text-muted-text">Some quick answers to help you prepare your enquiry.</p>
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
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-5 pr-10 text-sm leading-6 text-muted-text">{answer}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="contact-cta px-4 py-12 sm:px-6 sm:py-16">
        <Container className="relative isolate overflow-hidden rounded-2xl bg-primary px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_90%_20%,rgba(0,180,216,0.24),transparent_45%)]" />
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Let&apos;s explore what&apos;s possible</p>
              <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">Have an IoT Project in Mind?</h2>
              <p className="mt-4 leading-7 text-slate-300">Share your requirements with us, and let&apos;s explore the right connected solution for your business.</p>
            </div>
            <Link className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-primary transition hover:-translate-y-0.5 hover:bg-cyan-300" href="/products">
              Explore Our Products <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
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

function Field({
  id,
  label,
  error,
  optional = false,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-primary" htmlFor={id}>
        {label}
        {optional ? <span className="ml-1.5 text-xs font-normal text-slate-500">(optional)</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs font-medium text-red-700" id={`${id}-error`}>{error}</p> : null}
    </div>
  );
}

function OfficeDetail({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-[#087eae]"><Icon aria-hidden="true" className="h-4 w-4" /></span>
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</h3>
        <p className="mt-1 text-sm font-semibold text-primary">{value}</p>
      </div>
    </div>
  );
}
