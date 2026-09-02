import SectionTitle from "./SectionTitle";
import { ClockCheckIcon, PriceTagIcon, ShieldCheckIcon } from "./icons";

const benefits = [
  {
    title: "Better Prices",
    description:
      "We find cost-effective options so you save more on every delivery.",
    Icon: PriceTagIcon,
  },
  {
    title: "Better Availability",
    description:
      "Real-time checks ensure we pick a service that's available right now.",
    Icon: ClockCheckIcon,
  },
  {
    title: "Zero Decision Fatigue",
    description:
      "No more comparing, calling, or guessing. Dutt handles it all for you.",
    Icon: ShieldCheckIcon,
  },
];

export default function WhyDutt() {
  return (
    <section
      id="for-businesses"
      className="bg-background py-10 md:py-14"
    >
      <div className="site-content">
        <SectionTitle before="Why choose " highlight="Dutt" after="?" />

        <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="flex gap-5 rounded-2xl border border-border/80 bg-background p-6 sm:p-8"
            >
              <div className="shrink-0 text-accent">
                <benefit.Icon className="h-14 w-14" />
              </div>
              <div>
                <h3 className="text-body-lg font-bold text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-body font-medium leading-relaxed text-foreground/65">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
