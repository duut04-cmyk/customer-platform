"use client";

import Image from "next/image";
import Button from "@/common/components/Button";
import { ArrowRightIcon, PlayIcon, StarIcon } from "./icons";

const secondaryLinkClassName =
  "inline-flex h-11 cursor-pointer items-center justify-center gap-2 px-5 text-small font-semibold rounded-pill border border-border bg-background text-foreground transition-colors duration-150 hover:bg-surface active:bg-surface/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30 md:h-12 md:px-6 md:text-body";

const heroHeadlineLine1Width =
  "max-w-[21rem] sm:max-w-[23rem] md:max-w-md lg:max-w-none";
const heroHeadlineLine2Width =
  "max-w-[18rem] sm:max-w-[20rem] md:max-w-sm lg:max-w-none";
const heroHeadlineLine3Width =
  "max-w-[14rem] sm:max-w-[16rem] md:max-w-[18rem] lg:max-w-none";

const trustedAvatars = [
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    alt: "Doot customer portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    alt: "Doot customer portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    alt: "Doot customer portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    alt: "Doot customer portrait",
  },
];

export default function Hero({ onCreateDelivery }: { onCreateDelivery?: () => void }) {
  return (
    <section
      id="pricing"
      className="scroll-mt-20 overflow-x-hidden lg:min-h-[640px] xl:min-h-[720px]"
    >
      <div className="site-content flex flex-col items-center py-6 text-center sm:py-7 md:py-8 lg:min-h-[640px] lg:flex-row lg:items-center lg:gap-10 lg:py-0 lg:text-left xl:min-h-[720px]">
        <div className="w-full max-w-xl shrink-0 space-y-4 md:max-w-2xl lg:w-[46%] lg:max-w-none lg:space-y-8 lg:py-20 xl:w-[44%]">
          <div className="space-y-3 md:space-y-5 lg:space-y-6">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-accent md:text-caption md:tracking-[0.22em]">
              Delivery made simple
            </p>
            <h1 className="flex flex-col items-center gap-0 text-[1.875rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-[2.25rem] md:text-[2.5rem] lg:block lg:text-[2.75rem] xl:text-[3.75rem]">
              <span className={`block w-full ${heroHeadlineLine1Width} lg:inline`}>
                Your delivery.
              </span>
              <span className={`block w-full ${heroHeadlineLine2Width} lg:inline`}>
                <br className="hidden lg:block" />
                We find the <span className="text-accent">best</span>
                <span className="hidden lg:inline"> way there.</span>
              </span>
              <span className={`block w-full ${heroHeadlineLine3Width} lg:hidden`}>
                way there.
              </span>
            </h1>
            <p
              className={`mx-auto w-full text-body font-medium leading-relaxed text-foreground/70 lg:mx-0 lg:max-w-lg lg:text-body-lg ${heroHeadlineLine1Width}`}
            >
              Doot compares multiple delivery services in real time, recommends the best
              option with transparent pricing, and books only after you approve.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-3 lg:justify-start">
            <Button
              className="h-11 gap-2 px-6 text-small font-semibold md:h-12 md:px-8 md:text-body"
              onClick={onCreateDelivery}
            >
              Create a delivery
              <ArrowRightIcon />
            </Button>
            <a href="#how-it-works" className={secondaryLinkClassName}>
              <PlayIcon />
              See how it works
            </a>
          </div>

          <div className="space-y-3 pt-1 md:space-y-4 md:pt-2">
            <p className="text-small font-medium text-foreground/60">
              Trusted by businesses and individuals
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 lg:justify-start">
              <div className="flex -space-x-2">
                {trustedAvatars.map((avatar) => (
                  <div
                    key={avatar.src}
                    className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-hero-surface bg-background"
                  >
                    <Image
                      src={avatar.src}
                      alt={avatar.alt}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <div className="flex text-accent">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon key={index} className="h-4 w-4" />
                  ))}
                </div>
                <span className="text-small font-bold text-foreground">4.8/5</span>
                <span className="text-small font-medium text-foreground/60">
                  from 1,200+ users
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-8 hidden aspect-[16/11] w-full lg:mt-0 lg:block lg:min-h-[360px] lg:flex-1 xl:min-h-[420px]">
          <Image
            src="/pages/hero_section.png"
            alt="Doot compares delivery services and shows transparent pricing before you book"
            fill
            priority
            sizes="46vw"
            className="object-cover object-left"
          />
        </div>
      </div>

      <div className="relative hidden w-full md:block lg:hidden">
        <Image
          src="/pages/hero_section.png"
          alt="Doot compares delivery services and shows transparent pricing before you book"
          width={1440}
          height={990}
          priority
          sizes="100vw"
          className="h-auto w-full max-w-none"
        />
      </div>
    </section>
  );
}
