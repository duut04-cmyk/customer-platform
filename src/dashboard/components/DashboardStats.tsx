const stats = [
  {
    label: "Active deliveries",
    value: "0",
    helper: "Nothing currently on the way",
  },
  {
    label: "Completed",
    value: "0",
    helper: "Deliveries completed",
  },
  {
    label: "Total deliveries",
    value: "0",
    helper: "All your deliveries",
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-border bg-background p-5 shadow-sm"
        >
          <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            {stat.label}
          </p>
          <p className="mt-2 text-heading font-bold tracking-tight text-foreground">
            {stat.value}
          </p>
          <p className="mt-1.5 text-small text-muted-foreground">{stat.helper}</p>
        </div>
      ))}
    </div>
  );
}
