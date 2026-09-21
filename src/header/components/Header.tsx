"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { VscThreeBars } from "react-icons/vsc";
import { getUserInitials } from "@/auth/user-display";
import Button from "@/common/components/Button";
import Logo from "@/common/components/Logo";
import { DASHBOARD_PATH } from "@/dashboard/paths";
import { useAuthStore } from "@/stores/auth.store";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "For businesses", href: "#for-businesses" },
  { label: "About us", href: "#about" },
  { label: "Pricing", href: "#pricing" },
];

const linkClassName =
  "text-small font-medium text-foreground/85 whitespace-nowrap transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30 lg:text-body";

const mobileNavLinkClassName =
  "flex min-h-10 w-full items-center rounded-lg text-body font-medium text-foreground/55 transition-colors hover:bg-surface-accent hover:text-foreground/75 active:text-foreground/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30";

const mobileLoginClassName =
  "flex min-h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-border bg-background text-body font-medium text-foreground/75 transition-colors hover:border-foreground/20 hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30";

const DRAWER_TRANSITION_MS = 300;

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

type HeaderProps = {
  onLogin?: () => void;
  onGetStarted?: () => void;
};

function UserAvatar({ name }: { name: string }) {
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-[13px] font-semibold leading-none text-accent-foreground"
      aria-hidden="true"
    >
      {getUserInitials(name)}
    </span>
  );
}

export default function Header({ onLogin, onGetStarted }: HeaderProps) {
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const showAuthenticatedActions = !isInitializing && isAuthenticated && user;

  const openMenu = useCallback(() => {
    setMenuMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setMenuVisible(true));
    });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuVisible(false);
    window.setTimeout(() => setMenuMounted(false), DRAWER_TRANSITION_MS);
  }, []);

  useEffect(() => {
    if (!menuMounted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuMounted, closeMenu]);

  const handleLogin = () => {
    closeMenu();
    onLogin?.();
  };

  const handleGetStarted = () => {
    closeMenu();
    onGetStarted?.();
  };

  return (
    <header
      className={`sticky top-0 border-b border-border bg-background ${menuMounted ? "z-60" : "z-40"}`}
    >
      <div className="site-content relative flex h-14 items-center md:h-16">
        <Link
          href="/"
          className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
        >
          <Logo className="text-xl md:text-2xl" />
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex xl:gap-10"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={linkClassName}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 lg:flex lg:gap-4">
          {showAuthenticatedActions ? (
            <>
              <Link
                href={DASHBOARD_PATH}
                className="inline-flex items-center gap-2 rounded-[10px] px-2 py-1.5 transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
                aria-label={`Open dashboard for ${user.name}`}
              >
                <UserAvatar name={user.name} />
                <span className="hidden max-w-[8rem] truncate text-small font-medium text-foreground xl:inline">
                  {user.name}
                </span>
              </Link>
              <Link href={DASHBOARD_PATH}>
                <Button className="h-11 px-5 text-small lg:h-12 lg:px-7 lg:text-body">
                  Dashboard
                </Button>
              </Link>
            </>
          ) : !isInitializing ? (
            <>
              {onLogin ? (
                <button
                  type="button"
                  onClick={onLogin}
                  className={`${linkClassName} cursor-pointer`}
                >
                  Login
                </button>
              ) : (
                <Link href="/?auth=login" className={linkClassName}>
                  Login
                </Link>
              )}
              {onGetStarted ? (
                <Button
                  className="h-9 px-4 text-small lg:h-10 lg:px-5"
                  onClick={onGetStarted}
                >
                  Get started
                </Button>
              ) : (
                <Link href="/?auth=signup">
                  <Button className="h-9 px-4 text-small lg:h-10 lg:px-5">
                    Get started
                  </Button>
                </Link>
              )}
            </>
          ) : null}
        </div>

        {!menuMounted && (
          <button
            type="button"
            className="ml-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] border border-border bg-background text-foreground/50 transition-colors hover:border-foreground/20 hover:bg-surface hover:text-foreground/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30 lg:hidden"
            aria-expanded={menuVisible}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            onClick={openMenu}
          >
            <VscThreeBars className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {menuMounted && (
        <>
          <button
            type="button"
            className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
              menuVisible ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-label="Close menu"
            aria-hidden={!menuVisible}
            tabIndex={menuVisible ? 0 : -1}
            onClick={closeMenu}
          />
          <nav
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className={`fixed inset-y-0 right-0 z-51 flex h-dvh w-[75%] flex-col border-l border-border bg-hero-surface shadow-xl transition-transform duration-300 ease-out md:portrait:w-[30%] lg:hidden ${
              menuVisible ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border/80 bg-background px-5 pb-3 pt-[17px]">
              <Link
                href="/"
                onClick={closeMenu}
                className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
              >
                <Logo className="text-xl" />
              </Link>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-foreground/45 transition-colors hover:border-foreground/25 hover:bg-surface hover:text-foreground/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col px-5">
              <ul className="flex flex-col gap-1.5 pt-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={mobileNavLinkClassName}
                      onClick={closeMenu}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-auto shrink-0 space-y-3 border-t border-border/60 bg-background/60 px-5 py-5 -mx-5">
                {showAuthenticatedActions ? (
                  <>
                    <div className="flex items-center gap-2.5 px-1">
                      <UserAvatar name={user.name} />
                      <span className="truncate text-small font-medium text-foreground">
                        {user.name}
                      </span>
                    </div>
                    <Link href={DASHBOARD_PATH} onClick={closeMenu}>
                      <Button className="h-12 w-full text-body font-semibold">
                        Dashboard
                      </Button>
                    </Link>
                  </>
                ) : !isInitializing ? (
                  <>
                    {onLogin ? (
                      <button
                        type="button"
                        className={mobileLoginClassName}
                        onClick={handleLogin}
                      >
                        Login
                      </button>
                    ) : (
                      <Link
                        href="/?auth=login"
                        className={mobileLoginClassName}
                        onClick={closeMenu}
                      >
                        Login
                      </Link>
                    )}
                    {onGetStarted ? (
                      <Button
                        className="h-12 w-full text-body font-semibold"
                        onClick={handleGetStarted}
                      >
                        Get started
                      </Button>
                    ) : (
                      <Link href="/?auth=signup" onClick={closeMenu}>
                        <Button className="h-12 w-full text-body font-semibold">
                          Get started
                        </Button>
                      </Link>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
