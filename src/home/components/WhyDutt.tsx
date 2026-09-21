import SectionTitle from "./SectionTitle";
import { ClockCheckIcon, PriceTagIcon, ShieldCheckIcon } from "./icons";

const benefits = [
  {
    title: "Better Prices",
    description: "We find cost-effective options so you save more on every delivery.",
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
      "No more comparing, calling, or guessing. Doot handles it all for you.",
    Icon: ShieldCheckIcon,
  },
];

export default function WhyDutt() {
  return (
    <section
      id="for-businesses"
      className="scroll-mt-20 py-5 sm:py-6 md:py-8 lg:py-12 xl:py-14"
    >
      <div className="site-content">
        <SectionTitle before="Why choose " highlight="Doot" after="?" />

        <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 md:mt-6 md:grid-cols-3 md:gap-3 lg:mt-8 lg:gap-4 xl:gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="flex flex-col items-center gap-2.5 rounded-2xl border border-border/80 bg-background p-4 text-center md:p-4 lg:gap-3 lg:p-5 xl:flex-row xl:items-start xl:gap-5 xl:p-8 xl:text-left"
            >
              <div className="shrink-0 text-accent">
                <benefit.Icon className="h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 xl:h-14 xl:w-14" />
              </div>
              <div className="min-w-0">
                <h3 className="text-small font-bold text-foreground md:text-body lg:whitespace-nowrap xl:whitespace-normal xl:text-body-lg">
                  {benefit.title}
                </h3>
                <p className="mt-1 text-caption font-medium leading-snug text-foreground/65 lg:mt-1.5 lg:text-small xl:mt-2 xl:text-body xl:leading-relaxed">
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
