import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

const baseClasses =
  "w-full h-10 px-3 text-small bg-background text-foreground border border-border rounded-[6px] placeholder:text-muted-foreground/55 transition-colors duration-150 hover:border-foreground/25 focus:border-foreground focus:ring-1 focus:ring-foreground/10 focus:outline-none disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60 aria-[invalid=true]:border-foreground aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-foreground/20 md:px-3.5";

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = "", error = false, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`${baseClasses} ${className}`}
      aria-invalid={error || undefined}
      {...props}
    />
  );
});

export default Input;
