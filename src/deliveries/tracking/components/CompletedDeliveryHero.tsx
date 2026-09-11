import { IconCheck } from "@/dashboard/components/icons";

export default function CompletedDeliveryHero() {
  return (
    <div className="flex flex-col items-center py-2 text-center sm:py-4">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
        <IconCheck className="h-8 w-8" />
      </span>
    </div>
  );
}
