"use client";

import { useId, useState } from "react";

export default function CaptchaPlaceholder() {
  const id = useId();
  const [checked, setChecked] = useState(false);

  return (
    // TODO: Replace with real CAPTCHA during authentication implementation.
    <div className="rounded-md border border-border bg-surface/50 px-3 py-2.5">
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center justify-between gap-3"
      >
        <span className="flex items-center gap-2.5">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
            className="h-4 w-4 rounded border-border text-accent focus:ring-accent/30"
          />
          <span className="text-small text-foreground">
            {checked ? "✓  I'm not a robot" : "I'm not a robot"}
          </span>
        </span>
        <span className="text-caption font-medium uppercase tracking-wide text-muted-foreground">
          Captcha
        </span>
      </label>
    </div>
  );
}
