/** Shared shell sizing for login, signup, and forgot-password modals. */
export const authModalShellClassName =
  "mt-8 flex max-h-[calc(100dvh-4rem)] min-h-[min(26rem,calc(100dvh-4rem))] w-full !max-w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden !rounded-[4px] !p-0 landscape:!max-w-[min(420px,calc(100dvh-2rem))] sm:mt-0 sm:max-h-[calc(100dvh-2rem)]";

export const authModalHeaderClassName = "relative shrink-0 px-5 pb-3 pt-7 md:pt-8";

export const authModalCompactHeaderClassName =
  "relative shrink-0 px-5 pb-1 pt-4 md:pt-5";

export const authModalBodyClassName =
  "min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-7 pt-1";

export const authModalCloseButtonClassName =
  "absolute right-3 top-4 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-foreground/45 transition-colors hover:border-foreground/25 hover:bg-surface-accent hover:text-foreground/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30 md:top-5";

export const authFormStackClassName = "space-y-6";
