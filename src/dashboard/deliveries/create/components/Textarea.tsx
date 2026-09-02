import type { TextareaHTMLAttributes } from "react";

const textareaClasses =
  "w-full min-h-[96px] resize-y px-4 py-3 text-body bg-background text-foreground border border-border rounded-md placeholder:text-muted-foreground transition-colors duration-150 hover:border-foreground/25 focus:border-foreground focus:ring-1 focus:ring-foreground/10 focus:outline-none disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};

export default function Textarea({
  className = "",
  error = false,
  ...props
}: TextareaProps) {
  return (
    <textarea
      className={`${textareaClasses} ${error ? "border-foreground ring-1 ring-foreground/20" : ""} ${className}`}
      aria-invalid={error || undefined}
      {...props}
    />
  );
}
