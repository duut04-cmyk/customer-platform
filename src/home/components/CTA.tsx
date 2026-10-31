"use client";

import Button from "@/common/components/Button";
import { ArrowRightIcon } from "./icons";

export default function CTA({ onGetStarted }: { onGetStarted?: () => void }) {
  return (
    <section
      id="get-started"
      className="scroll-mt-20 bg-[#FFFBF5] pb-14 pt-4 sm:pb-16 sm:pt-6 md:pb-20 md:pt-8"
    >
      <div className="site-content">
        <div className="relative overflow-hidden rounded-[1.35rem] bg-[#171717] px-6 py-11 sm:rounded-[1.5rem] sm:px-10 md:px-12 md:py-14 lg:px-14">
          {/* Soft orange glow */}
          <div
            className="pointer-events-none absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#FF6B0A_0%,transparent_70%)] opacity-25 blur-2xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,#FF6B0A_0%,transparent_70%)] opacity-15 blur-xl"
            aria-hidden="true"
          />

          {/* Route / skyline decoration */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
            viewBox="0 0 1200 220"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 170 L50 145 L90 160 L140 120 L190 150 L240 100 L300 135 L360 85 L430 125 L510 70 L590 115 L670 90 L760 130 L840 65 L930 110 L1020 80 L1100 120 L1200 95"
              fill="none"
              stroke="#FF6B0A"
              strokeWidth="2"
            />
            <path
              d="M60 190 C 260 130, 400 170, 600 110 S 960 90, 1140 150"
              fill="none"
              stroke="#FF6B0A"
              strokeWidth="2.5"
              strokeDasharray="7 9"
              strokeLinecap="round"
            />
          </svg>

          <div className="relative z-10 flex flex-col items-center gap-8 text-center md:flex-row md:items-center md:justify-between md:gap-12 md:text-left">
            <div className="max-w-xl space-y-3">
              <h2 className="text-[1.5rem] font-bold leading-[1.3] tracking-tight text-white sm:text-[1.75rem] md:text-[2rem] md:leading-[1.28]">
                Your next{" "}
                <span className="inline-block text-accent">local delivery</span> starts
                here.
              </h2>
              <p className="text-body leading-relaxed text-white/65">
                Local deliveries, without the unnecessary complexity.
              </p>
            </div>
            <Button
              className="h-12 shrink-0 gap-2 px-8 text-body font-semibold shadow-[0_10px_28px_-8px_rgba(255,107,10,0.55)] md:h-[3.25rem] md:px-9"
              onClick={onGetStarted}
            >
              Get started
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
