"use client";

import Button from "@/common/components/Button";
import { ArrowRightIcon, LocationPinIcon, PlayIcon, ShieldCheckIcon } from "./icons";
import HeroDeliveryIllustration from "./HeroDeliveryIllustration";

function BoltIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const benefits = [
  { label: "Local pickup and delivery", Icon: LocationPinIcon },
  { label: "Transparent delivery quotes", Icon: ShieldCheckIcon },
  { label: "Automatic partner selection", Icon: BoltIcon },
] as const;

const secondaryLinkClassName =
  "inline-flex h-12 cursor-pointer items-center justify-center gap-2.5 rounded-pill border border-border bg-white px-5 text-small font-semibold text-foreground shadow-sm transition-colors duration-150 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30 md:h-[3.25rem] md:px-6 md:text-body";

export default function Hero({ onGetStarted }: { onGetStarted?: () => void }) {
  return (
    <section id="home" className="scroll-mt-20 overflow-x-hidden bg-[#FFFBF5]">
      <div className="site-content grid grid-cols-1 items-center gap-8 py-10 sm:gap-10 sm:py-12 md:py-14 lg:min-h-[min(72vh,720px)] lg:grid-cols-[minmax(0,46%)_minmax(0,54%)] lg:gap-x-10 lg:gap-y-0 lg:py-16 xl:gap-x-14 xl:py-20">
        {/* Headline block */}
        <div className="space-y-4 text-center md:space-y-5 lg:col-start-1 lg:row-start-1 lg:text-left">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-accent md:text-caption md:tracking-[0.22em]">
            Local delivery, simplified
          </p>
          <h1 className="text-[2.125rem] font-bold leading-[1.08] tracking-tight text-foreground sm:text-[2.5rem] md:text-[3rem] lg:text-[3.25rem] xl:text-[3.5rem]">
            Send anything locally. We&apos;ll handle the{" "}
            <span className="text-accent">delivery.</span>
          </h1>
          <p className="mx-auto max-w-md text-[0.9375rem] font-medium leading-relaxed text-muted-foreground sm:text-body md:max-w-lg lg:mx-0 lg:text-body-lg">
            From your home or business to another address in your city. Get a delivery
            quote and let Doot select the best available logistics partner for you.
          </p>
        </div>

        {/* Visual — under headline on mobile; right column on desktop */}
        <figure className="mx-auto w-full min-w-0 max-w-md lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:max-w-none lg:self-center">
          <HeroDeliveryIllustration ariaLabel="Phone map connecting pickup to delivery through Doot" />
        </figure>

        {/* Benefits + CTAs */}
        <div className="space-y-6 text-center lg:col-start-1 lg:row-start-2 lg:space-y-7 lg:text-left">
          <ul className="mx-auto grid max-w-md grid-cols-1 gap-3 text-left sm:grid-cols-2 sm:gap-x-5 sm:gap-y-3.5 lg:mx-0 lg:max-w-none">
            {benefits.map(({ label, Icon }) => (
              <li
                key={label}
                className="flex items-center gap-2.5 text-small font-medium text-foreground/85 sm:text-[0.9375rem]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-accent text-accent ring-1 ring-accent/10">
                  <Icon className="h-[1.125rem] w-[1.125rem]" />
                </span>
                <span>{label}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
            <Button
              className="h-12 gap-2 px-8 text-body font-semibold shadow-[0_8px_20px_-6px_rgba(255,107,10,0.45)] md:h-[3.25rem]"
              onClick={onGetStarted}
            >
              Get started
              <ArrowRightIcon />
            </Button>
            <a href="#how-it-works" className={secondaryLinkClassName}>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-accent text-accent">
                <PlayIcon className="h-2.5 w-2.5 translate-x-px" />
              </span>
              How it works
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
