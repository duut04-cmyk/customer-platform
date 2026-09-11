import type { ReactNode } from "react";

type SettingsCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function SettingsCard({
  title,
  description,
  children,
}: SettingsCardProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background p-5 shadow-sm md:p-6">
      <div className="mb-5">
        <h2 className="text-body-lg font-bold text-foreground">{title}</h2>
        {description && (
          <p className="mt-1 text-small text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
