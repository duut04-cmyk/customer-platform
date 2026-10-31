import Link from "next/link";
import { CREATE_DELIVERY_PATH } from "@/create-delivery/paths";
import { SAFETY_COMPLIANCE_PATH } from "@/safety/paths";

const steps = [
  {
    number: "1",
    title: "Enter pickup and drop-off",
    description:
      "Add locations, contacts, and package details for your local delivery.",
  },
  {
    number: "2",
    title: "Get a quote",
    description:
      "Doot checks availability and selects a recommended logistics partner for eligible routes.",
  },
  {
    number: "3",
    title: "Pay, confirm, and follow updates",
    description:
      "Review charges, complete payment, confirm booking, and follow available delivery updates in your account.",
  },
] as const;

export default function HelpGettingStarted() {
  return (
    <section className="overflow-hidden rounded-[1.25rem] border border-border bg-white p-5 shadow-sm md:p-7">
      <h2 className="text-body-lg font-bold text-foreground md:text-[1.35rem]">
        Getting started
      </h2>
      <p className="mt-1 text-small text-muted-foreground">
        Three steps to arrange a local delivery through Doot.
      </p>

      <ol className="mt-6 space-y-4">
        {steps.map((step) => (
          <li key={step.number} className="flex gap-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-caption font-bold text-accent-foreground">
              {step.number}
            </span>
            <div>
              <h3 className="text-small font-bold text-foreground md:text-body">
                {step.title}
              </h3>
              <p className="mt-1 text-small leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
        <Link
          href={CREATE_DELIVERY_PATH}
          className="inline-flex h-10 items-center rounded-pill bg-accent px-5 text-small font-semibold text-accent-foreground transition-colors hover:bg-[var(--color-saffron-hover)]"
        >
          Create a delivery
        </Link>
        <Link
          href={SAFETY_COMPLIANCE_PATH}
          className="inline-flex h-10 items-center rounded-pill border border-border bg-white px-5 text-small font-semibold text-foreground transition-colors hover:bg-surface"
        >
          Safety &amp; compliance
        </Link>
      </div>
    </section>
  );
}
