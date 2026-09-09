import { IconRadioDot } from "@/dashboard/components/icons";

export default function ReadyToGoNowPanel() {
  return (
    <div className="flex items-start gap-3 rounded-[8px] border border-accent/30 bg-[#fff7ed] px-4 py-3">
      <IconRadioDot className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
      <div>
        <p className="text-small font-semibold text-accent">Ready to go now</p>
        <p className="mt-0.5 text-caption leading-relaxed text-muted-foreground">
          Doot will look for the best available option based on your pickup and drop-off
          details.
        </p>
      </div>
    </div>
  );
}
