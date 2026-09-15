"use client";

import { useState } from "react";
import Button from "@/common/components/Button";
import SettingsCard from "./SettingsCard";

type NotificationPreferences = {
  deliveryUpdates: boolean;
  smsAlerts: boolean;
  emailAlerts: boolean;
  marketingEmails: boolean;
};

const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  deliveryUpdates: true,
  smsAlerts: true,
  emailAlerts: true,
  marketingEmails: false,
};

type ToggleRowProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-surface/40">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border bg-background transition-colors peer-checked:border-accent peer-checked:bg-accent"
      >
        <svg
          viewBox="0 0 12 12"
          className={`h-3 w-3 text-white transition-opacity ${checked ? "opacity-100" : "opacity-0"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block text-small font-semibold text-foreground">{label}</span>
        <span className="mt-0.5 block text-caption text-muted-foreground">
          {description}
        </span>
      </span>
    </label>
  );
}

export default function NotificationPreferences() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(
    DEFAULT_NOTIFICATION_PREFERENCES,
  );
  const [saved, setSaved] = useState(false);

  const update = (key: keyof NotificationPreferences, value: boolean) => {
    setPrefs((current) => ({ ...current, [key]: value }));
  };

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  return (
    <SettingsCard
      title="Notifications"
      description="Choose how you want to be notified about your deliveries."
    >
      <div className="space-y-3">
        <ToggleRow
          label="Delivery status updates"
          description="Get notified when your delivery status changes."
          checked={prefs.deliveryUpdates}
          onChange={(value) => update("deliveryUpdates", value)}
        />
        <ToggleRow
          label="SMS alerts"
          description="Receive text messages for important delivery events."
          checked={prefs.smsAlerts}
          onChange={(value) => update("smsAlerts", value)}
        />
        <ToggleRow
          label="Email alerts"
          description="Receive email updates for bookings and deliveries."
          checked={prefs.emailAlerts}
          onChange={(value) => update("emailAlerts", value)}
        />
        <ToggleRow
          label="Marketing emails"
          description="Offers, tips, and product updates from Doot."
          checked={prefs.marketingEmails}
          onChange={(value) => update("marketingEmails", value)}
        />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          className="h-10 rounded-[6px] px-5 text-small font-semibold"
          onClick={handleSave}
        >
          Save preferences
        </Button>
        {saved && (
          <p className="text-small font-medium text-emerald-700" role="status">
            Preferences saved.
          </p>
        )}
      </div>
    </SettingsCard>
  );
}
