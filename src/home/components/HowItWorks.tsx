import { LocationPinIcon, PackageIcon, SearchIcon } from "./icons";
import HowItWorksIllustration from "./HowItWorksIllustration";

const steps = [
  {
    number: "1",
    title: "Enter your details",
    description:
      "Add your pickup and drop-off locations along with the required contact details.",
    Icon: LocationPinIcon,
    emphasize: false,
  },
  {
    number: "2",
    title: "Get your delivery quote",
    description:
      "Doot checks delivery availability and evaluates eligible logistics partners to find the best available option.",
    Icon: SearchIcon,
    emphasize: true,
  },
  {
    number: "3",
    title: "Confirm and track",
    description:
      "Review your delivery charges, complete payment, confirm your booking and follow available delivery updates.",
    Icon: PackageIcon,
    emphasize: false,
  },
] as const;

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 bg-[#F7F5F2] py-14 sm:py-16 md:py-20"
    >
      <div className="site-content">
        <div className="mx-auto max-w-2xl space-y-4 text-center sm:space-y-5 lg:mx-0 lg:max-w-xl lg:text-left">
          <div className="space-y-3">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-accent md:text-caption">
              How Doot works
            </p>
            <div
              className="mx-auto h-0.5 w-10 rounded-full bg-accent/40 lg:mx-0"
              aria-hidden="true"
            />
          </div>
          <h2 className="text-[1.75rem] font-bold leading-[1.25] tracking-tight text-foreground sm:text-[2rem] sm:leading-[1.28] md:text-[2.25rem] md:leading-[1.3] lg:text-[2.5rem] lg:leading-[1.3]">
            From pickup to delivery, made{" "}
            <span className="inline-block text-accent">simple.</span>
          </h2>
          <p className="text-small text-muted-foreground md:text-body">
            Three steps. One platform. No courier shopping.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 items-center gap-10 md:mt-12 lg:mt-14 lg:grid-cols-[minmax(0,45%)_minmax(0,55%)] lg:gap-12 xl:gap-16">
          <div className="order-1 mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            <HowItWorksIllustration className="aspect-[480/420] w-full" />
          </div>

          <ol className="order-2 relative mx-auto w-full max-w-lg space-y-0 lg:mx-0 lg:max-w-none">
            {/* Timeline line */}
            <div
              className="pointer-events-none absolute top-5 bottom-5 left-[1.15rem] w-px bg-gradient-to-b from-accent via-accent/40 to-border md:left-[1.35rem]"
              aria-hidden="true"
            />

            {steps.map((step) => (
              <li key={step.number} className="relative pl-14 md:pl-16">
                <span
                  className={`absolute top-5 left-0 z-10 flex h-9 w-9 items-center justify-center rounded-full text-caption font-bold shadow-sm md:top-6 md:h-11 md:w-11 md:text-small ${
                    step.emphasize
                      ? "bg-accent text-accent-foreground ring-4 ring-accent/15"
                      : "bg-white text-foreground ring-2 ring-border"
                  }`}
                >
                  {step.number}
                </span>

                <article
                  className={`mb-4 rounded-[1.25rem] border p-5 transition-shadow md:mb-5 md:rounded-[1.35rem] md:p-6 ${
                    step.emphasize
                      ? "border-accent/25 bg-white shadow-[0_12px_32px_-16px_rgba(255,107,10,0.35)]"
                      : "border-border bg-white/90 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        step.emphasize
                          ? "bg-surface-accent text-accent"
                          : "bg-[#F7F5F2] text-accent"
                      }`}
                    >
                      <step.Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-body font-bold text-foreground md:text-body-lg">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-small leading-relaxed text-muted-foreground md:text-[0.9375rem]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
