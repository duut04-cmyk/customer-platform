"use client";

import { useState } from "react";
import { IconChevronDown } from "@/dashboard/components/icons";
import { HELP_FAQ_ITEMS } from "../faqContent";

export default function HelpFaqSection() {
  const [openId, setOpenId] = useState<string | null>(HELP_FAQ_ITEMS[0]?.id ?? null);

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background p-5 shadow-sm md:p-6">
      <h2 className="text-body-lg font-bold text-foreground">
        Frequently asked questions
      </h2>
      <p className="mt-1 text-small text-muted-foreground">
        Quick answers to common questions about deliveries on Doot.
      </p>

      <div className="mt-5 divide-y divide-border border-t border-border">
        {HELP_FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div key={item.id} className="py-4">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full cursor-pointer items-start justify-between gap-3 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-small font-semibold text-foreground">
                  {item.question}
                </span>
                <IconChevronDown
                  className={`mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <p className="mt-3 text-small leading-relaxed text-muted-foreground">
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
