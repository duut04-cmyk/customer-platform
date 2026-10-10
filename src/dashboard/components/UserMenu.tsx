"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { ACCOUNT_SETTINGS_PATH } from "@/account/paths";
import { performLogout } from "@/auth/logout";
import { getUserInitials } from "@/auth/user-display";
import Button from "@/common/components/Button";
import { HELP_SUPPORT_PATH } from "@/help/paths";
import { useAuthStore } from "@/stores/auth.store";

function UserChevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type UserMenuProps = {
  compact?: boolean;
};

export default function UserMenu({ compact = false }: UserMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open, updateMenuPosition]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || dropdownRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    setOpen(false);
    try {
      await performLogout(router);
    } finally {
      setLoggingOut(false);
    }
  };

  if (!user) {
    return null;
  }

  const initials = getUserInitials(user.name);

  const dropdown =
    open && menuPosition
      ? createPortal(
          <div
            ref={dropdownRef}
            role="menu"
            className="fixed z-[100] w-64 rounded-xl border border-border bg-background p-2 shadow-md"
            style={{ top: menuPosition.top, right: menuPosition.right }}
          >
            <div className="border-b border-border px-3 py-3">
              <p className="text-body font-semibold text-foreground">{user.name}</p>
              <p className="mt-0.5 text-small text-muted-foreground">{user.email}</p>
            </div>
            <div className="py-1">
              <button
                type="button"
                role="menuitem"
                className={`w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-small font-medium transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30 ${
                  pathname === ACCOUNT_SETTINGS_PATH
                    ? "bg-surface text-foreground"
                    : "text-foreground"
                }`}
                onClick={() => {
                  setOpen(false);
                  router.push(ACCOUNT_SETTINGS_PATH);
                }}
              >
                Account settings
              </button>
              <button
                type="button"
                role="menuitem"
                className={`w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-small font-medium transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30 ${
                  pathname === HELP_SUPPORT_PATH
                    ? "bg-surface text-foreground"
                    : "text-foreground"
                }`}
                onClick={() => {
                  setOpen(false);
                  router.push(HELP_SUPPORT_PATH);
                }}
              >
                Help & support
              </button>
            </div>
            <div className="border-t border-border p-2">
              <Button
                type="button"
                variant="secondary"
                className="h-10 w-full text-small font-semibold"
                onClick={handleLogout}
                disabled={loggingOut}
                aria-busy={loggingOut}
              >
                {loggingOut ? "Logging out..." : "Log out"}
              </Button>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="relative" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-[10px] transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30 ${compact ? "px-1.5 py-1.5" : "px-3 py-2"}`}
        aria-label="Open account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-[13px] font-semibold leading-none text-accent-foreground"
            aria-hidden="true"
          >
            {initials}
          </span>
          {!compact && (
            <span className="hidden max-w-[7rem] truncate text-small font-medium text-foreground sm:inline sm:max-w-none sm:overflow-visible sm:whitespace-nowrap">
              {user.name}
            </span>
          )}
        </span>
        {!compact && <UserChevron open={open} />}
      </button>

      {dropdown}
    </div>
  );
}
