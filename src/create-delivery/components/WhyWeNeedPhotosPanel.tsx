import { IconPackageFilled, IconShieldFilled } from "@/dashboard/components/icons";

export default function WhyWeNeedPhotosPanel() {
  return (
    <div className="flex h-full min-h-28 items-center gap-4 rounded-[10px] border border-accent/15 bg-[#FFF8F1] px-4 py-4 lg:px-5">
      <div className="relative shrink-0" aria-hidden="true">
        <span className="flex h-14 w-14 items-center justify-center rounded-[10px] bg-white text-accent shadow-sm ring-1 ring-accent/10">
          <IconPackageFilled className="h-7 w-7" />
        </span>
        <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-2 ring-[#FFF8F1]">
          <IconShieldFilled className="h-3 w-3" />
        </span>
      </div>
      <div className="min-w-0">
        <h4 className="text-small font-bold text-foreground">Why we need photos?</h4>
        <p className="mt-1 text-caption leading-snug text-muted-foreground">
          Photos help us verify the item, support safe handling, and meet applicable
          delivery compliance expectations.
        </p>
      </div>
    </div>
  );
}
