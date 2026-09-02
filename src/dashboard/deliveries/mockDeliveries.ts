import {
  buildDefaultTimeline,
  type Delivery,
  type DeliveryFilter,
  type DeliveryStatus,
} from "./types";

export const MOCK_DELIVERIES: Delivery[] = [
  {
    id: "DUTT-1042",
    status: "in_transit",
    statusLabel: "In transit",
    pickup: { city: "Mumbai", address: "Koramangala, 12th Main Road" },
    dropoff: { city: "Mumbai", address: "Indiranagar, 100 Feet Road" },
    packageType: "Parcel",
    weight: "2.5 kg",
    dimensions: "30 × 20 × 15 cm",
    requirements: ["Handle with care"],
    dateLabel: "Today",
    estimatedArrival: "12:15 PM",
    driverInitials: "JD",
    timeline: buildDefaultTimeline("in_transit"),
  },
  {
    id: "DUTT-1041",
    status: "delivered",
    statusLabel: "Delivered",
    pickup: { city: "Mumbai", address: "Andheri West, Link Road" },
    dropoff: { city: "Thane", address: "Ghodbunder Road" },
    packageType: "Document",
    weight: "0.4 kg",
    dimensions: "30 × 22 × 2 cm",
    requirements: [],
    dateLabel: "Yesterday",
    estimatedArrival: "Delivered 4:20 PM",
    driverInitials: "JD",
    timeline: buildDefaultTimeline("delivered"),
  },
  {
    id: "DUTT-1040",
    status: "delivered",
    statusLabel: "Delivered",
    pickup: { city: "Mumbai", address: "Lower Parel, Senapati Bapat Marg" },
    dropoff: { city: "Navi Mumbai", address: "Vashi, Sector 17" },
    packageType: "Box",
    weight: "5 kg",
    dimensions: "40 × 30 × 25 cm",
    requirements: ["Fragile"],
    dateLabel: "Aug 30",
    estimatedArrival: "Delivered 2:10 PM",
    driverInitials: "JD",
    timeline: buildDefaultTimeline("delivered"),
  },
  {
    id: "DUTT-1039",
    status: "cancelled",
    statusLabel: "Cancelled",
    pickup: { city: "Mumbai", address: "Colaba, Gateway area" },
    dropoff: { city: "Andheri", address: "Andheri East, MIDC" },
    packageType: "Parcel",
    weight: "1.8 kg",
    dimensions: "25 × 18 × 12 cm",
    requirements: [],
    dateLabel: "Aug 29",
    estimatedArrival: "—",
    driverInitials: "JD",
    timeline: buildDefaultTimeline("cancelled"),
  },
  {
    id: "DUTT-1038",
    status: "delivered",
    statusLabel: "Delivered",
    pickup: { city: "Mumbai", address: "Worli, Annie Besant Road" },
    dropoff: { city: "Bandra", address: "Bandra West, Hill Road" },
    packageType: "Parcel",
    weight: "3.2 kg",
    dimensions: "35 × 25 × 18 cm",
    requirements: ["Keep upright"],
    dateLabel: "Aug 28",
    estimatedArrival: "Delivered 11:45 AM",
    driverInitials: "JD",
    timeline: buildDefaultTimeline("delivered"),
  },
];

export function getDeliveryById(id: string): Delivery | undefined {
  return MOCK_DELIVERIES.find((d) => d.id === id);
}

export function getRecentDeliveries(limit = 3): Delivery[] {
  return MOCK_DELIVERIES.slice(0, limit);
}

export function filterDeliveries(
  deliveries: Delivery[],
  filter: DeliveryFilter,
): Delivery[] {
  if (filter === "all") return deliveries;
  if (filter === "delivered") {
    return deliveries.filter((d) => d.status === "delivered");
  }
  if (filter === "cancelled") {
    return deliveries.filter((d) => d.status === "cancelled");
  }
  return deliveries.filter((d) =>
    (["in_transit", "picked_up", "driver_assigned", "booked"] as DeliveryStatus[]).includes(
      d.status,
    ),
  );
}

export function deliveryRoutePath(id: string) {
  return `/dashboard/deliveries/${id}`;
}

export function deliveryTrackingPath(id: string) {
  return `/dashboard/deliveries/${id}/tracking`;
}
