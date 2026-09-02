"use client";

import Image from "next/image";
import Button from "@/common/components/Button";
import { ArrowRightIcon, PlayIcon, StarIcon } from "./icons";

const secondaryLinkClassName =
  "inline-flex h-12 cursor-pointer items-center justify-center gap-2 px-6 text-body font-semibold rounded-pill border border-border bg-background text-foreground transition-colors duration-150 hover:bg-surface active:bg-surface/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30";

const trustedAvatars = [
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    alt: "Dutt customer portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    alt: "Dutt customer portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    alt: "Dutt customer portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    alt: "Dutt customer portrait",
  },
];

export default function Hero({ onCreateDelivery }: { onCreateDelivery?: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-hero-surface lg:min-h-[640px] xl:min-h-[720px]">
      <div className="site-content relative z-10 py-12 md:py-16 lg:flex lg:items-center lg:py-0">
        <div className="max-w-xl space-y-8 lg:w-[46%] lg:max-w-none lg:shrink-0 lg:py-20 xl:w-[44%]">
          <div className="space-y-6">
            <p className="text-caption font-bold uppercase tracking-[0.22em] text-accent">
              Smart delivery orchestration
            </p>
            <h1 className="text-[2.25rem] font-bold leading-[1.08] tracking-tight text-foreground sm:text-heading-md md:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.75rem]">
              Your delivery.
              <br />
              We find the <span className="text-accent">best</span> way there.
            </h1>
            <p className="max-w-lg text-body-lg font-medium leading-relaxed text-foreground/70">
              Dutt compares multiple delivery services in real time, selects
              the best option for your package, and books it for you. All you
              do is track.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              className="h-12 gap-2 px-8 text-body font-semibold"
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

          <div className="space-y-4 pt-2">
            <p className="text-small font-medium text-foreground/60">
              Trusted by businesses and individuals
            </p>
            <div className="flex flex-wrap items-center gap-4">
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
              <div className="flex items-center gap-2">
                <div className="flex text-accent">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon key={index} className="h-4 w-4" />
                  ))}
                </div>
                <span className="text-small font-bold text-foreground">
                  4.8/5
                </span>
                <span className="text-small font-medium text-foreground/60">
                  from 1,200+ users
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-10 aspect-[4/3] w-full max-w-lg sm:aspect-[16/11] lg:absolute lg:inset-y-0 lg:right-0 lg:mx-0 lg:mt-0 lg:max-w-none lg:w-[56%] xl:w-[54%]">
        <Image
          src="/pages/hero_section.png"
          alt="Dutt compares delivery services in real time and books the best option for your package"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 56vw"
          className="object-contain object-center lg:object-cover lg:object-left"
        />
      </div>
    </section>
  );
}
