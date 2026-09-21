"use client";

import { useId, useState, type ChangeEventHandler } from "react";
import Input from "@/common/components/Input";
import { EyeClosedIcon, EyeOpenIcon } from "./icons";

type PasswordInputProps = {
  id?: string;
  name: string;
  placeholder: string;
  error?: boolean;
  autoComplete?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

export default function PasswordInput({
  id: idProp,
  name,
  placeholder,
  error = false,
  autoComplete = "current-password",
  value,
  onChange,
}: PasswordInputProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        error={error}
        autoComplete={autoComplete}
        className="pr-11"
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          <EyeClosedIcon className="h-5 w-5" />
        ) : (
          <EyeOpenIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
