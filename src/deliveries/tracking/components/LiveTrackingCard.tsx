import { getTrackingHeroSubtitle, getTrackingHeroTitle } from "../../customerCopy";
import type { Delivery } from "../../types";
import TrackingMap from "./TrackingMap";

type LiveTrackingCardProps = {
  delivery: Delivery;
};

function PackageIllustration() {
  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50"
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none">
        <path
          d="M8 16l16-8 16 8v20l-16 8-16-8V16Z"
          fill="#dbeafe"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M24 8v32M8 16l16 8 16-8" stroke="#3b82f6" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export default function LiveTrackingCard({ delivery }: LiveTrackingCardProps) {
  const showMap = delivery.status !== "booked" && Boolean(delivery.driver);

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div className="space-y-4 p-5 md:p-6">
        <h2 className="text-body-lg font-bold text-foreground">Live tracking</h2>

        <div className="flex items-start gap-3 border-b border-border pb-4">
          <PackageIllustration />
          <div className="min-w-0 flex-1">
            <p className="text-body font-bold text-foreground">
              {getTrackingHeroTitle(delivery.status)}
            </p>
            <p className="mt-1 text-small text-muted-foreground">
              {getTrackingHeroSubtitle(delivery.status)}
            </p>
          </div>
        </div>

        {showMap ? (
          <TrackingMap delivery={delivery} />
        ) : (
          <div className="flex h-[280px] items-center justify-center rounded-xl border border-dashed border-border bg-surface/40 sm:h-[360px]">
            <p className="max-w-xs px-4 text-center text-small text-muted-foreground">
              Live map will appear here once your delivery partner is on the way.
            </p>
          </div>
        )}

        <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50/70 px-4 py-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
            i
          </span>
          <p className="text-caption leading-relaxed text-muted-foreground">
            We&apos;ll keep you updated with real-time tracking and notifications.
          </p>
        </div>
      </div>
    </section>
  );
}
