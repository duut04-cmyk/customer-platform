import Link from "next/link";
import Button from "@/common/components/Button";
import Logo from "@/common/components/Logo";
import { HELP_SUPPORT_PATH } from "@/help/paths";
import { SAFETY_COMPLIANCE_PATH } from "@/safety/paths";

function ArrowRightIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const linkClassName =
  "text-small text-muted-foreground transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30";

const headingClassName =
  "mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-foreground";

type FooterProps = {
  onLogin?: () => void;
  onGetStarted?: () => void;
};

export default function Footer({ onLogin, onGetStarted }: FooterProps) {
  return (
    <footer className="overflow-x-hidden border-t border-border bg-[#FFFBF5]">
      <div className="site-content py-12 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
            >
              <Logo className="text-2xl" />
            </Link>
            <p className="max-w-xs text-small leading-relaxed text-muted-foreground">
              Making inner-city deliveries simpler for individuals and local businesses.
            </p>
            <span className="inline-flex items-center rounded-pill bg-surface-accent px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-accent">
              Inner-city delivery
            </span>
          </div>

          {/* Product */}
          <div>
            <h3 className={headingClassName}>
              <span className="inline-block border-b-2 border-accent/50 pb-1">
                Product
              </span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#how-it-works" className={linkClassName}>
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/#for-individuals" className={linkClassName}>
                  For individuals
                </Link>
              </li>
              <li>
                <Link href="/#for-businesses" className={linkClassName}>
                  For businesses
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className={headingClassName}>
              <span className="inline-block border-b-2 border-accent/50 pb-1">
                Support
              </span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href={HELP_SUPPORT_PATH} className={linkClassName}>
                  Help
                </Link>
              </li>
              <li>
                <Link href={SAFETY_COMPLIANCE_PATH} className={linkClassName}>
                  Safety &amp; compliance
                </Link>
              </li>
            </ul>
          </div>

          {/* Account — single place for auth actions */}
          <div>
            <h3 className={headingClassName}>
              <span className="inline-block border-b-2 border-accent/50 pb-1">
                Account
              </span>
            </h3>
            <ul className="space-y-3">
              <li>
                {onLogin ? (
                  <button type="button" onClick={onLogin} className={linkClassName}>
                    Log in
                  </button>
                ) : (
                  <Link href="/?auth=login" className={linkClassName}>
                    Log in
                  </Link>
                )}
              </li>
              <li className="pt-1">
                {onGetStarted ? (
                  <Button
                    className="h-10 gap-1.5 px-5 text-small font-semibold"
                    onClick={onGetStarted}
                  >
                    Get started
                    <ArrowRightIcon />
                  </Button>
                ) : (
                  <Link href="/?auth=signup">
                    <Button className="h-10 gap-1.5 px-5 text-small font-semibold">
                      Get started
                      <ArrowRightIcon />
                    </Button>
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-caption text-muted-foreground">
            &copy; {new Date().getFullYear()} Doot. All rights reserved.
          </p>
          <p className="text-caption text-muted-foreground/80">
            Built for local deliveries
          </p>
        </div>
      </div>
    </footer>
  );
}
