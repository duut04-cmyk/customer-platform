import { IconPackageFilled, IconShieldFilled } from "@/dashboard/components/icons";

export default function WhyWeNeedPhotosPanel() {
  return (
    <div className="flex h-28 items-center gap-4 rounded-xl bg-slate-50 px-4 py-3 lg:px-5">
      <div className="relative shrink-0" aria-hidden="true">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#fff7ed] text-accent shadow-sm">
          <IconPackageFilled className="h-7 w-7" />
        </span>
        <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-2 ring-slate-50">
          <IconShieldFilled className="h-3 w-3" />
        </span>
      </div>
      <div className="min-w-0">
        <h4 className="text-small font-bold text-foreground">Why we need photos?</h4>
        <p className="mt-1 text-caption leading-snug text-muted-foreground">
          Photos help us verify the item, ensure safe handling and comply with Indian
          delivery regulations.
        </p>
      </div>
    </div>
  );
}
