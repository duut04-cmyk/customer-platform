import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

type BackButtonProps = {
  href: string;
  label: string;
};

export default function BackButton({ href, label }: BackButtonProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
    >
      <IoArrowBack className="h-5 w-5" aria-hidden="true" />
    </Link>
  );
}
