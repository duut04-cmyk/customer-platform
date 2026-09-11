"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/common/components/Button";
import {
  formatNotificationTime,
  MOCK_NOTIFICATIONS,
  type AppNotification,
} from "../mockNotifications";
import { IconArrowLeft, IconBell } from "./icons";

function NotificationIcon({ type }: { type: AppNotification["type"] }) {
  const colors: Record<AppNotification["type"], string> = {
    delivery_status: "bg-blue-50 text-blue-600",
    otp: "bg-violet-50 text-violet-600",
    booking: "bg-emerald-50 text-emerald-600",
    delivered: "bg-emerald-50 text-emerald-700",
    system: "bg-surface text-muted-foreground",
  };

  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-caption font-bold ${colors[type]}`}
      aria-hidden="true"
    >
      {type === "otp" ? "#" : type === "delivered" ? "✓" : "•"}
    </span>
  );
}

export default function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((item) => !item.read).length;
  const selected = notifications.find((item) => item.id === selectedId) ?? null;

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSelectedId(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (selectedId) {
          setSelectedId(null);
        } else {
          setOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, selectedId]);

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  };

  const handleSelect = (notification: AppNotification) => {
    markAsRead(notification.id);
    setSelectedId(notification.id);
  };

  const handleOpenNotification = () => {
    if (!selected) return;
    setOpen(false);
    setSelectedId(null);
    router.push(selected.href);
  };

  const toggleOpen = () => {
    setOpen((value) => {
      if (value) setSelectedId(null);
      return !value;
    });
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="relative cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label={
          unreadCount > 0 ? `Notifications (${unreadCount} unread)` : "Notifications"
        }
        aria-expanded={open}
        aria-haspopup="true"
        onClick={toggleOpen}
      >
        <IconBell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background"
            aria-hidden="true"
          />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(100vw-2rem,360px)] overflow-hidden rounded-xl border border-border bg-background shadow-md">
          {!selected ? (
            <>
              <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
                <h2 className="text-body font-bold text-foreground">Notifications</h2>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="cursor-pointer text-caption font-semibold text-accent hover:text-accent/80"
                    onClick={markAllAsRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <ul className="max-h-80 overflow-y-auto py-1" role="list">
                {notifications.length === 0 ? (
                  <li className="px-4 py-8 text-center text-small text-muted-foreground">
                    No notifications yet.
                  </li>
                ) : (
                  notifications.map((notification) => (
                    <li key={notification.id}>
                      <button
                        type="button"
                        className={`flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface/60 ${
                          !notification.read ? "bg-surface/30" : ""
                        }`}
                        onClick={() => handleSelect(notification)}
                      >
                        <NotificationIcon type={notification.type} />
                        <span className="min-w-0 flex-1">
                          <span
                            className={`block text-small ${notification.read ? "font-medium text-foreground" : "font-semibold text-foreground"}`}
                          >
                            {notification.title}
                          </span>
                          <span className="mt-0.5 block truncate text-caption text-muted-foreground">
                            {notification.body}
                          </span>
                          <span className="mt-1 block text-caption text-muted-foreground">
                            {formatNotificationTime(notification.createdAt)}
                          </span>
                        </span>
                        {!notification.read && (
                          <span
                            className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent"
                            aria-label="Unread"
                          />
                        )}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </>
          ) : (
            <div className="p-4">
              <button
                type="button"
                className="mb-4 inline-flex cursor-pointer items-center gap-1.5 text-caption font-semibold text-muted-foreground hover:text-foreground"
                onClick={() => setSelectedId(null)}
              >
                <IconArrowLeft className="h-3.5 w-3.5" />
                Back to notifications
              </button>

              <div className="flex items-start gap-3">
                <NotificationIcon type={selected.type} />
                <div className="min-w-0 flex-1">
                  <h3 className="text-body font-bold text-foreground">
                    {selected.title}
                  </h3>
                  <p className="mt-2 text-small leading-relaxed text-muted-foreground">
                    {selected.body}
                  </p>
                  <p className="mt-3 text-caption text-muted-foreground">
                    {formatNotificationTime(selected.createdAt)}
                  </p>
                  {selected.deliveryId && (
                    <p className="mt-1 text-caption font-medium text-foreground">
                      Delivery ID: {selected.deliveryId}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="button"
                className="mt-5 h-10 w-full rounded-[6px] text-small font-semibold"
                onClick={handleOpenNotification}
              >
                {selected.deliveryId ? "View delivery" : "Open"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
