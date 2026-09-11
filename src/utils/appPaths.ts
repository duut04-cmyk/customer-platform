import { ACCOUNT_SETTINGS_PATH } from "@/account/paths";
import { CREATE_DELIVERY_PATH } from "@/create-delivery/paths";
import { DASHBOARD_PATH } from "@/dashboard/paths";
import { DELIVERIES_PATH } from "@/deliveries/paths";
import { HELP_SUPPORT_PATH } from "@/help/paths";
import { SAFETY_COMPLIANCE_PATH } from "@/safety/paths";

export const PRIVATE_IN_PAGE_HEADER_PATHS = [
  DASHBOARD_PATH,
  DELIVERIES_PATH,
  CREATE_DELIVERY_PATH,
  ACCOUNT_SETTINGS_PATH,
  HELP_SUPPORT_PATH,
  SAFETY_COMPLIANCE_PATH,
] as const;

const DELIVERY_DETAIL_PATH_PATTERN = /^\/deliveries\/[^/]+(\/tracking)?$/;

export function usesPrivateInPageHeader(pathname: string): boolean {
  if (
    PRIVATE_IN_PAGE_HEADER_PATHS.includes(
      pathname as (typeof PRIVATE_IN_PAGE_HEADER_PATHS)[number],
    )
  ) {
    return true;
  }

  return DELIVERY_DETAIL_PATH_PATTERN.test(pathname);
}
