"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/common/components/Button";
import Logo from "@/common/components/Logo";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "For businesses", href: "#for-businesses" },
  { label: "About us", href: "#about" },
  { label: "Pricing", href: "#pricing" },
];

const linkClassName =
  "text-body font-medium text-foreground/85 whitespace-nowrap transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30";

type HeaderProps = {
  onLogin?: () => void;
  onGetStarted?: () => void;
};

export default function Header({ onLogin, onGetStarted }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const handleLogin = () => {
    closeMenu();
    onLogin?.();
  };

  const handleGetStarted = () => {
    closeMenu();
    onGetStarted?.();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="site-content relative flex h-20 items-center">
        <Link
          href="/"
          className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
        >
          <Logo className="text-2xl" />
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex lg:gap-10 xl:gap-12"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={linkClassName}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-8 lg:flex">
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
            <Button className="h-12 px-7 text-body" onClick={onGetStarted}>
              Get started
            </Button>
          ) : (
            <Link href="/?auth=signup">
              <Button className="h-12 px-7 text-body">Get started</Button>
            </Link>
          )}
        </div>

        <button
          type="button"
          className="ml-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-md text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30 lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="flex flex-col gap-1.5" aria-hidden="true">
            <span
              className={`block h-0.5 w-5 bg-foreground transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-foreground transition-opacity ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-foreground transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          className="border-t border-border bg-background lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="site-content flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`${linkClassName} rounded-md px-3 py-3 hover:bg-surface`}
                onClick={closeMenu}
              >
                {link.label}
              </a>
            ))}
            {onLogin ? (
              <button
                type="button"
                className={`${linkClassName} cursor-pointer rounded-md px-3 py-3 text-left hover:bg-surface`}
                onClick={handleLogin}
              >
                Login
              </button>
            ) : (
              <Link
                href="/?auth=login"
                className={`${linkClassName} rounded-md px-3 py-3 hover:bg-surface`}
                onClick={closeMenu}
              >
                Login
              </Link>
            )}
            <div className="pt-2">
              {onGetStarted ? (
                <Button className="w-full" onClick={handleGetStarted}>
                  Get started
                </Button>
              ) : (
                <Link href="/?auth=signup" onClick={closeMenu}>
                  <Button className="w-full">Get started</Button>
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
