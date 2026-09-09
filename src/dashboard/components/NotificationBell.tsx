import { IconBell } from "./icons";

export default function NotificationBell() {
  return (
    <button
      type="button"
      className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label="Notifications (3 unread)"
    >
      <IconBell className="h-5 w-5" />
      <span
        className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background"
        aria-hidden="true"
      />
    </button>
  );
}
