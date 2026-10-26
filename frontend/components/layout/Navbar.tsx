"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products", hasMenu: true },
  { label: "Lab Solutions", href: "/lab-solutions", hasMenu: true },
  { label: "Industries", href: "/industries", hasMenu: true },
  { label: "About Us", href: "/about" },
  { label: "Resources", href: "/resources", hasMenu: true },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6 lg:px-8">
        <Link className="shrink-0" href="/" onClick={() => setIsOpen(false)}>
          <span className="block font-heading text-xl font-extrabold tracking-tight text-primary">
            AKSHUNN<span className="text-accent">.</span>
          </span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-text">
            Intelligent technology
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-muted-text transition-colors hover:bg-muted hover:text-primary"
              href={item.href}
              key={item.label}
            >
              {item.label}
              {item.hasMenu ? <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" /> : null}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            className="inline-flex items-center gap-2 rounded-lg bg-accent-2 px-4 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 hover:shadow-lg"
            href="/quote"
          >
            Request a Quote
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          className="rounded-lg p-2 text-primary hover:bg-muted lg:hidden"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          {isOpen ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
        </button>
      </div>

      {isOpen ? (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-border bg-white px-6 py-4 lg:hidden"
          id="mobile-navigation"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map((item) => (
              <Link
                className="rounded-lg px-3 py-3 text-base font-semibold text-primary hover:bg-muted"
                href={item.href}
                key={item.label}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-accent-2 px-4 py-3 text-sm font-bold text-white"
              href="/quote"
              onClick={() => setIsOpen(false)}
            >
              Request a Quote
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
