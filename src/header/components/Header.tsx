"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { VscThreeBars } from "react-icons/vsc";
import { getUserInitials } from "@/auth/user-display";
import Button from "@/common/components/Button";
import Logo from "@/common/components/Logo";
import { CREATE_DELIVERY_PATH } from "@/create-delivery/paths";
import { DASHBOARD_PATH } from "@/dashboard/paths";
import { useAuthStore } from "@/stores/auth.store";

/** Homepage section anchors — work from any public page. */
const navLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "For individuals", href: "/#for-individuals" },
  { label: "For businesses", href: "/#for-businesses" },
] as const;

const linkClassName =
  "text-small font-medium text-muted-foreground whitespace-nowrap transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/40";

const mobileNavLinkClassName =
  "flex min-h-11 w-full items-center rounded-xl px-3 text-body font-medium text-foreground/70 transition-colors hover:bg-surface-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30";

const mobileLoginClassName =
  "flex min-h-11 w-full cursor-pointer items-center justify-center rounded-pill border border-border bg-white text-body font-medium text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30";

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
  const [scrolled, setScrolled] = useState(false);
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
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      className={`sticky top-0 border-b bg-white/95 backdrop-blur-md transition-shadow duration-200 ${
        scrolled
          ? "border-border shadow-[0_4px_20px_-8px_rgba(23,23,23,0.12)]"
          : "border-border/80"
      } ${menuMounted ? "z-60" : "z-40"}`}
    >
      {/* 3-zone grid: logo | centered nav | actions */}
      <div className="site-content grid h-16 grid-cols-[1fr_auto] items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <div className="flex min-w-0 items-center justify-start">
          <Link
            href="/"
            className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
          >
            <Logo className="text-[1.35rem] md:text-[1.5rem]" />
          </Link>
        </div>

        <nav
          className="hidden items-center justify-center gap-8 lg:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClassName}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center justify-end gap-3 lg:flex">
          {showAuthenticatedActions ? (
            <>
              <Link
                href={DASHBOARD_PATH}
                className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
                aria-label={`Open dashboard for ${user.name}`}
              >
                <UserAvatar name={user.name} />
                <span className="hidden max-w-[8rem] truncate text-small font-medium text-foreground xl:inline">
                  {user.name}
                </span>
              </Link>
              <Link href={CREATE_DELIVERY_PATH}>
                <Button className="h-10 gap-1.5 px-5 text-small font-semibold">
                  Send a delivery
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
                  Log in
                </button>
              ) : (
                <Link href="/?auth=login" className={linkClassName}>
                  Log in
                </Link>
              )}
              {onGetStarted ? (
                <Button
                  className="h-10 gap-1.5 px-5 text-small font-semibold shadow-[0_6px_14px_-6px_rgba(255,107,10,0.45)]"
                  onClick={onGetStarted}
                >
                  Get started
                  <span aria-hidden="true">→</span>
                </Button>
              ) : (
                <Link href="/?auth=signup">
                  <Button className="h-10 gap-1.5 px-5 text-small font-semibold shadow-[0_6px_14px_-6px_rgba(255,107,10,0.45)]">
                    Get started
                    <span aria-hidden="true">→</span>
                  </Button>
                </Link>
              )}
            </>
          ) : null}
        </div>

        {!menuMounted && (
          <button
            type="button"
            className="justify-self-end flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-white text-foreground/55 transition-colors hover:border-foreground/20 hover:bg-surface hover:text-foreground lg:hidden"
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
            className={`fixed inset-y-0 right-0 z-51 flex h-dvh w-[min(100%,20rem)] flex-col border-l border-border bg-[#FFFBF5] shadow-xl transition-transform duration-300 ease-out lg:hidden ${
              menuVisible ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border/80 bg-white px-5 py-3.5">
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
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border bg-white text-foreground/50 transition-colors hover:bg-surface hover:text-foreground"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col px-4">
              <ul className="flex flex-col gap-1 pt-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={mobileNavLinkClassName}
                      onClick={closeMenu}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-auto shrink-0 space-y-3 border-t border-border/60 bg-white/80 px-4 py-5 -mx-4">
                {showAuthenticatedActions ? (
                  <>
                    <div className="flex items-center gap-2.5 px-1">
                      <UserAvatar name={user.name} />
                      <span className="truncate text-small font-medium text-foreground">
                        {user.name}
                      </span>
                    </div>
                    <Link href={CREATE_DELIVERY_PATH} onClick={closeMenu}>
                      <Button className="h-12 w-full text-body font-semibold">
                        Send a delivery
                      </Button>
                    </Link>
                    <Link href={DASHBOARD_PATH} onClick={closeMenu}>
                      <Button
                        variant="secondary"
                        className="h-12 w-full text-body font-semibold"
                      >
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
                        Log in
                      </button>
                    ) : (
                      <Link
                        href="/?auth=login"
                        className={mobileLoginClassName}
                        onClick={closeMenu}
                      >
                        Log in
                      </Link>
                    )}
                    {onGetStarted ? (
                      <Button
                        className="h-12 w-full text-body font-semibold"
                        onClick={handleGetStarted}
                      >
                        Get started →
                      </Button>
                    ) : (
                      <Link href="/?auth=signup" onClick={closeMenu}>
                        <Button className="h-12 w-full text-body font-semibold">
                          Get started →
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
