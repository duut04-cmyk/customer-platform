import { IconCheck, IconShieldFilled } from "@/dashboard/components/icons";

const steps = [
  "Driver will be assigned and get in touch.",
  "Pickup OTP will be shared for verification.",
  "Delivery OTP will be shared on delivery.",
  "Track your delivery in real-time.",
] as const;

export default function ConfirmedWhatHappensNextCard() {
  return (
    <section className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <IconShieldFilled className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body font-bold text-emerald-700">What happens next?</h3>
          <ul className="mt-3 space-y-2.5">
            {steps.map((step) => (
              <li key={step} className="flex items-start gap-2.5">
                <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span className="text-small leading-relaxed text-muted-foreground">
                  {step}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
