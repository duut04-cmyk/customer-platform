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
      className="pointer-events-none absolute left-[92px] top-[44px] hidden w-[calc(100%-72px)] -translate-y-1/2 items-center lg:flex"
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
    <section id="how-it-works" className="bg-background py-10 md:py-14">
      <div className="site-content">
        <SectionTitle before="How " highlight="Doot" after=" works" />

        <div className="mt-10 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && <StepConnector />}

              <div className="flex h-[88px] w-[88px] items-center justify-center rounded-2xl bg-surface shadow-sm">
                <step.Icon className="h-9 w-9 text-foreground" />
              </div>

              <div className="mt-6 flex items-start gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-small font-bold text-accent-foreground">
                  {step.number}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-body-lg font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-body font-medium leading-relaxed text-foreground/65">
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
