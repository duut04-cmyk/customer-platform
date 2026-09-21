/** Sidebar width token — keep in sync with DashboardSidebar */
export const DASHBOARD_SIDEBAR_WIDTH = "w-60";

/** Inner padding for dashboard page content — full width beside sidebar */
export const DASHBOARD_CONTENT =
  "w-full min-w-0 max-w-full px-4 md:px-6 lg:px-6 xl:px-8";

export const DASHBOARD_MAIN = `${DASHBOARD_CONTENT} py-4 lg:py-6`;

/** Legacy alias — pages use full width inside shell */
export const DASHBOARD_SHELL = DASHBOARD_CONTENT;

/** Dashboard / deliveries: main column + sidebar cards (xl+ only) */
export const DASHBOARD_TWO_COL_GRID =
  "min-w-0 w-full max-w-full xl:grid-cols-[minmax(0,1fr)_320px]";

/**
 * Sidebar cards below main content:
 * - mobile: stack
 * - tablet portrait: 2-col (network + performance)
 * - tablet landscape (lg–xl): 3-col row
 * - xl+: vertical stack in fixed sidebar column
 */
export const DASHBOARD_SIDEBAR_STACK =
  "grid w-full min-w-0 max-w-full grid-cols-1 gap-4 md:portrait:grid-cols-2 lg:landscape:grid-cols-3 xl:flex xl:flex-col";

/** Span full width when sidebar stack uses 2-col grid (tablet portrait) */
export const DASHBOARD_SIDEBAR_FULL_SPAN = "md:portrait:col-span-2 xl:col-span-auto";

/** Create delivery: form + summary sidebar (xl+ only) */
export const CREATE_DELIVERY_GRID =
  "min-w-0 w-full max-w-full xl:grid-cols-[minmax(0,1fr)_minmax(360px,22%)]";
