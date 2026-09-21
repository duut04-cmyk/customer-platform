import SectionTitle from "./SectionTitle";
import { AwardIcon, LocationPinIcon, PackageIcon, SearchIcon } from "./icons";

const steps = [
  {
    number: "1",
    title: "You tell us",
    description: "Enter pickup, drop-off locations and package details.",
    Icon: LocationPinIcon,
  },
  {
    number: "2",
    title: "We compare",
    description: "Doot checks multiple delivery services in real time.",
    Icon: SearchIcon,
  },
  {
    number: "3",
    title: "We choose",
    description:
      "We pick the best option based on price, speed, availability and suitability.",
    Icon: AwardIcon,
  },
  {
    number: "4",
    title: "You approve & track",
    description: "Book when you're ready, then track your delivery live in one place.",
    Icon: PackageIcon,
  },
];

function StepConnector() {
  return (
    <div
      className="pointer-events-none absolute top-[44px] z-0 hidden items-center xl:flex xl:left-[calc(50%-1.75rem)] xl:w-[calc(100%-5.5rem+2rem)]"
      aria-hidden="true"
    >
      <span className="h-px flex-1 border-t border-dashed border-foreground/20" />
      <svg
        className="ml-1 h-3.5 w-3.5 shrink-0 text-foreground/35"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M3 8h9M9 4.5 8 8l1.5 3.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 py-5 sm:py-6 md:py-8 lg:py-12 xl:py-14"
    >
      <div className="site-content">
        <SectionTitle before="How " highlight="Doot" after=" works" />

        <div className="mx-auto mt-5 grid w-full max-w-xl grid-cols-1 gap-0 sm:mt-6 md:max-w-none md:mt-6 md:grid-cols-2 md:gap-x-6 md:gap-y-5 lg:mt-8 lg:gap-y-6 xl:grid-cols-4 xl:gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative flex w-full min-w-0 gap-3 border-b border-border/60 py-6 first:pt-0 last:border-b-0 md:gap-3.5 md:border-0 md:py-0 xl:flex-col xl:items-center xl:gap-0"
            >
              {index < steps.length - 1 && <StepConnector />}

              <div className="flex w-full min-w-0 gap-3 md:gap-3.5 xl:max-w-[14.5rem] xl:flex-col xl:items-start xl:gap-0">
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-surface shadow-sm sm:h-16 sm:w-16 md:h-[60px] md:w-[60px] xl:h-[88px] xl:w-[88px]">
                  <step.Icon className="h-6 w-6 text-foreground sm:h-7 sm:w-7 md:h-7 md:w-7 xl:h-9 xl:w-9" />
                </div>

                <div className="min-w-0 flex-1 xl:mt-6 xl:w-full xl:flex-none">
                  <div className="flex items-start gap-2 md:items-center xl:items-start">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-[0.6875rem] font-bold text-accent-foreground md:mt-0 md:h-7 md:w-7 md:text-caption xl:h-8 xl:w-8 xl:text-small">
                      {step.number}
                    </span>
                    <h3 className="text-small font-bold text-foreground md:text-body xl:whitespace-nowrap xl:text-body-lg">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-1.5 text-pretty text-caption font-medium leading-snug text-foreground/65 md:mt-2 md:text-small xl:mt-2 xl:text-body xl:leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
