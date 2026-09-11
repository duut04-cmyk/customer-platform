"use client";

import { useState } from "react";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import { MOCK_USER } from "../mockUser";
import SettingsCard from "./SettingsCard";

export default function ProfileSection() {
  const [name, setName] = useState(MOCK_USER.name);
  const [phone, setPhone] = useState(MOCK_USER.phone);
  const [saved, setSaved] = useState(false);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  return (
    <SettingsCard
      title="Profile"
      description="Update your personal information used for deliveries and notifications."
    >
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label
            htmlFor="profile-name"
            className="text-caption font-medium text-muted-foreground"
          >
            Full name
          </label>
          <Input
            id="profile-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <label
            htmlFor="profile-email"
            className="text-caption font-medium text-muted-foreground"
          >
            Email
          </label>
          <Input
            id="profile-email"
            type="email"
            value={MOCK_USER.email}
            readOnly
            disabled
            className="mt-1.5"
          />
          <p className="mt-1 text-caption text-muted-foreground">
            Contact support to change your email address.
          </p>
        </div>
        <div>
          <label
            htmlFor="profile-phone"
            className="text-caption font-medium text-muted-foreground"
          >
            Phone
          </label>
          <Input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="mt-1.5"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button
            type="submit"
            className="h-10 rounded-[6px] px-5 text-small font-semibold"
          >
            Save changes
          </Button>
          {saved && (
            <p className="text-small font-medium text-emerald-700" role="status">
              Profile saved successfully.
            </p>
          )}
        </div>
      </form>
    </SettingsCard>
  );
}
