import { CREATE_DELIVERY_PATH } from "@/create-delivery/paths";
import { DASHBOARD_PATH } from "@/dashboard/paths";
import { DELIVERIES_PATH } from "@/deliveries/paths";

export const PRIVATE_IN_PAGE_HEADER_PATHS = [
  DASHBOARD_PATH,
  DELIVERIES_PATH,
  CREATE_DELIVERY_PATH,
] as const;
