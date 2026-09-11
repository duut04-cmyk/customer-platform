"use client";

import { useState } from "react";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import SettingsCard from "./SettingsCard";

export default function SecuritySection() {
  const [saved, setSaved] = useState(false);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  return (
    <SettingsCard
      title="Security"
      description="Update your password to keep your account secure."
    >
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label
            htmlFor="current-password"
            className="text-caption font-medium text-muted-foreground"
          >
            Current password
          </label>
          <Input
            id="current-password"
            type="password"
            className="mt-1.5"
            autoComplete="current-password"
          />
        </div>
        <div>
          <label
            htmlFor="new-password"
            className="text-caption font-medium text-muted-foreground"
          >
            New password
          </label>
          <Input
            id="new-password"
            type="password"
            className="mt-1.5"
            autoComplete="new-password"
          />
        </div>
        <div>
          <label
            htmlFor="confirm-password"
            className="text-caption font-medium text-muted-foreground"
          >
            Confirm new password
          </label>
          <Input
            id="confirm-password"
            type="password"
            className="mt-1.5"
            autoComplete="new-password"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button
            type="submit"
            className="h-10 rounded-[6px] px-5 text-small font-semibold"
          >
            Update password
          </Button>
          {saved && (
            <p className="text-small font-medium text-emerald-700" role="status">
              Password updated successfully.
            </p>
          )}
        </div>
      </form>
    </SettingsCard>
  );
}
