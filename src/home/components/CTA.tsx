"use client";

import Button from "@/common/components/Button";
import { ArrowRightIcon } from "./icons";

export default function CTA({ onCreateDelivery }: { onCreateDelivery?: () => void }) {
  return (
    <section id="get-started" className="bg-background py-10 md:py-14">
      <div className="site-content">
        <div className="relative overflow-hidden rounded-2xl bg-cta-surface px-6 py-10 md:flex md:items-center md:justify-between md:gap-8 md:px-12 md:py-12 lg:px-14">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 1200 160"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M80 100 C 280 40, 420 120, 620 80 S 980 60, 1120 90"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="2"
              strokeDasharray="5 7"
            />
          </svg>

          <svg
            className="pointer-events-none absolute left-8 top-1/2 h-5 w-5 -translate-y-1/2 text-white/20 md:left-12"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M2 10 18 2l-3 8 3 8-16-8z" />
          </svg>

          <svg
            className="pointer-events-none absolute right-24 top-1/2 h-5 w-5 -translate-y-1/2 text-accent/60 md:right-56"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 17s5-3.5 5-8a5 5 0 1 0-10 0c0 4.5 5 8 5 8z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="10" cy="9" r="1.5" fill="currentColor" />
          </svg>

          <div className="relative z-10 max-w-xl md:pl-4">
            <h2 className="text-heading font-bold tracking-tight text-white md:text-heading-md">
              Ready to <span className="text-accent">send something</span>?
            </h2>
            <p className="mt-2 text-body-lg text-white/65">
              Let Dutt figure out the rest.
            </p>
          </div>

          <div className="relative z-10 mt-6 shrink-0 md:mt-0">
            <Button
              className="h-12 gap-2 px-7 text-body font-semibold"
              onClick={onCreateDelivery}
            >
              Create a delivery
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
