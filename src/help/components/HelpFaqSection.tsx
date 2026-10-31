"use client";

import { useMemo, useState } from "react";
import { IconChevronDown } from "@/dashboard/components/icons";
import { FAQ_CATEGORIES, HELP_FAQ_ITEMS, type FaqItem } from "../faqContent";

export default function HelpFaqSection() {
  const [activeCategory, setActiveCategory] = useState<FaqItem["category"] | "all">(
    "all",
  );
  const [openId, setOpenId] = useState<string | null>(HELP_FAQ_ITEMS[0]?.id ?? null);

  const items = useMemo(() => {
    if (activeCategory === "all") return HELP_FAQ_ITEMS;
    return HELP_FAQ_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="overflow-hidden rounded-[1.25rem] border border-border bg-white p-5 shadow-sm md:p-7">
      <h2 className="text-body-lg font-bold text-foreground md:text-[1.35rem]">
        Frequently asked questions
      </h2>
      <p className="mt-1 text-small text-muted-foreground">
        Clear answers about booking, payments, tracking, and safety on Doot.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`rounded-pill px-3.5 py-1.5 text-caption font-semibold transition-colors ${
            activeCategory === "all"
              ? "bg-accent text-accent-foreground"
              : "bg-surface text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        {FAQ_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategory(category.id)}
            className={`rounded-pill px-3.5 py-1.5 text-caption font-semibold transition-colors ${
              activeCategory === category.id
                ? "bg-accent text-accent-foreground"
                : "bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="mt-5 divide-y divide-border border-t border-border">
        {items.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div key={item.id} className="py-4">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full cursor-pointer items-start justify-between gap-3 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-small font-semibold text-foreground md:text-body">
                  {item.question}
                </span>
                <IconChevronDown
                  className={`mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <p className="mt-3 text-small leading-relaxed text-muted-foreground md:text-[0.9375rem]">
                  {item.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
