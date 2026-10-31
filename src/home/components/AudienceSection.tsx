"use client";

import type { ReactNode } from "react";
import Button from "@/common/components/Button";
import { ArrowRightIcon } from "./icons";

type AudienceSectionProps = {
  onGetStarted?: () => void;
};

function BagIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full max-h-44" aria-hidden="true">
      <defs>
        <radialGradient id="aud-bag-glow" cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="#FFE8D4" />
          <stop offset="100%" stopColor="#FFF5EB" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="108" r="78" fill="url(#aud-bag-glow)" />
      <ellipse cx="100" cy="168" rx="52" ry="10" fill="#E8D9C8" opacity="0.35" />
      <path
        d="M58 72h84l10 78H48L58 72z"
        fill="#FFFFFF"
        stroke="#EAE7E3"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M72 72c0-18 12-30 28-30s28 12 28 30"
        fill="none"
        stroke="#FF6B0A"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle
        cx="100"
        cy="108"
        r="18"
        fill="#FFF5EB"
        stroke="#FF6B0A"
        strokeWidth="2.5"
      />
      <path
        d="M100 96v24M88 108h24"
        stroke="#FF6B0A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Soft floating chip */}
      <g transform="translate(132, 48)">
        <rect
          width="56"
          height="24"
          rx="12"
          fill="#FFF"
          stroke="#EAE7E3"
          strokeWidth="1.5"
        />
        <circle cx="14" cy="12" r="4" fill="#FF6B0A" />
        <text
          x="36"
          y="16"
          textAnchor="middle"
          fill="#191919"
          fontSize="10"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
        >
          Home
        </text>
      </g>
    </svg>
  );
}

function StoreIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full max-h-44" aria-hidden="true">
      <defs>
        <radialGradient id="aud-store-glow" cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="#FFE8D4" />
          <stop offset="100%" stopColor="#FFF5EB" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="108" r="78" fill="url(#aud-store-glow)" />
      <ellipse cx="100" cy="168" rx="56" ry="10" fill="#E8D9C8" opacity="0.35" />
      <path d="M42 88h116v62H42z" fill="#FFF" stroke="#EAE7E3" strokeWidth="2.5" />
      <path d="M36 88h128l-12-26H48L36 88z" fill="#FF6B0A" />
      <rect
        x="82"
        y="108"
        width="36"
        height="42"
        rx="2"
        fill="#FFF5EB"
        stroke="#EAE7E3"
        strokeWidth="1.5"
      />
      <rect
        x="54"
        y="100"
        width="22"
        height="20"
        rx="2"
        fill="#FFF0E3"
        stroke="#EAE7E3"
        strokeWidth="1.5"
      />
      <rect
        x="124"
        y="100"
        width="22"
        height="20"
        rx="2"
        fill="#FFF0E3"
        stroke="#EAE7E3"
        strokeWidth="1.5"
      />
      <rect
        x="130"
        y="128"
        width="30"
        height="22"
        rx="4"
        fill="#FFF"
        stroke="#FF6B0A"
        strokeWidth="1.75"
      />
      <path
        d="M145 128v22M130 139h30"
        stroke="#FF6B0A"
        strokeWidth="1.25"
        opacity="0.55"
      />
      <g transform="translate(28, 52)">
        <rect
          width="64"
          height="24"
          rx="12"
          fill="#FFF"
          stroke="#EAE7E3"
          strokeWidth="1.5"
        />
        <circle cx="14" cy="12" r="4" fill="#FF6B0A" />
        <text
          x="40"
          y="16"
          textAnchor="middle"
          fill="#191919"
          fontSize="10"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
        >
          Shop
        </text>
      </g>
    </svg>
  );
}

function AudienceCard({
  id,
  label,
  heading,
  description,
  onCta,
  illustration,
}: {
  id: string;
  label: string;
  heading: string;
  description: string;
  onCta?: () => void;
  illustration: ReactNode;
}) {
  return (
    <article
      id={id}
      className="scroll-mt-24 group flex flex-col overflow-hidden rounded-[1.35rem] border border-border bg-white shadow-[0_12px_40px_-24px_rgba(23,23,23,0.2)] transition-shadow duration-200 hover:shadow-[0_18px_48px_-20px_rgba(255,107,10,0.22)] md:rounded-[1.5rem] lg:min-h-[280px] lg:flex-row"
    >
      {/* Illustration — left on desktop */}
      <div className="relative flex items-center justify-center bg-[#FFF8F1] px-6 py-8 lg:w-[42%] lg:px-5 lg:py-6">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,#FFE8D4_0%,transparent_60%)] opacity-80"
          aria-hidden="true"
        />
        <div className="relative z-10 h-36 w-full max-w-[200px] sm:h-40">
          {illustration}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center p-6 md:p-7 lg:p-8">
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-accent">
          {label}
        </p>
        <h3 className="mt-2.5 text-[1.2rem] font-bold leading-snug tracking-tight text-foreground md:text-[1.35rem]">
          {heading}
        </h3>
        <p className="mt-2.5 flex-1 text-small leading-relaxed text-muted-foreground md:text-[0.9375rem]">
          {description}
        </p>
        <div className="mt-6">
          <Button
            className="h-11 gap-2 px-6 text-small font-semibold shadow-[0_6px_16px_-6px_rgba(255,107,10,0.4)] md:h-12 md:text-body"
            onClick={onCta}
          >
            Get started
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </article>
  );
}

export default function AudienceSection({ onGetStarted }: AudienceSectionProps) {
  return (
    <section className="bg-[#FFFBF5] py-14 sm:py-16 md:py-20">
      <div className="site-content">
        <div className="mx-auto max-w-2xl space-y-4 text-center sm:space-y-5">
          <div className="space-y-3">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-accent md:text-caption">
              For everyone
            </p>
            <div
              className="mx-auto h-0.5 w-10 rounded-full bg-accent/40"
              aria-hidden="true"
            />
          </div>
          <h2 className="text-[1.75rem] font-bold leading-[1.28] tracking-tight text-foreground sm:text-[2rem] sm:leading-[1.3] md:text-[2.25rem] md:leading-[1.32] lg:text-[2.5rem] lg:leading-[1.3]">
            Made for everyday deliveries and{" "}
            <span className="inline-block text-accent">local businesses.</span>
          </h2>
          <p className="mx-auto max-w-lg text-small text-muted-foreground md:text-body">
            Whether you&apos;re sending personally or fulfilling local orders, Doot
            keeps logistics simple.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-14 md:gap-7 lg:grid-cols-2 lg:gap-8">
          <AudienceCard
            id="for-individuals"
            label="For individuals"
            heading="Send from home or anywhere in the city."
            description="Deliver packages, gifts and everyday items to friends, family, offices and other supported destinations."
            onCta={onGetStarted}
            illustration={<BagIllustration />}
          />
          <AudienceCard
            id="for-businesses"
            label="For businesses"
            heading="Deliver more simply with Doot."
            description="Arrange deliveries from your shop or business location to customers and other supported destinations through one connected platform."
            onCta={onGetStarted}
            illustration={<StoreIllustration />}
          />
        </div>
      </div>
    </section>
  );
}
