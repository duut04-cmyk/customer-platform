import { describe, expect, it } from "vitest";
import { initialDeliveryFormData } from "@/create-delivery/types";
import { mapFormToCreateRequest } from "./delivery.mapper";

describe("mapFormToCreateRequest location fields", () => {
  it("includes pickup and drop coordinates when both lat/lng are set", () => {
    const request = mapFormToCreateRequest({
      ...initialDeliveryFormData,
      pickupAddress: "Pickup Street",
      pickupLatitude: 12.9716,
      pickupLongitude: 77.5946,
      dropAddress: "Drop Street",
      dropLatitude: 12.9352,
      dropLongitude: 77.6245,
      pickupContactName: "A",
      pickupContactPhone: "+919876543210",
      dropContactName: "B",
      dropContactPhone: "+919876543211",
      packageType: "food",
      weight: "1",
      timing: "asap",
      complianceConsent: true,
      consentAcceptedAt: new Date().toISOString(),
    });

    expect(request.pickup.latitude).toBe(12.9716);
    expect(request.pickup.longitude).toBe(77.5946);
    expect(request.drop.latitude).toBe(12.9352);
    expect(request.drop.longitude).toBe(77.6245);
  });

  it("omits coordinates when only address text is provided", () => {
    const request = mapFormToCreateRequest({
      ...initialDeliveryFormData,
      pickupAddress: "Pickup only",
      dropAddress: "Drop only",
      pickupContactName: "A",
      pickupContactPhone: "+919876543210",
      dropContactName: "B",
      dropContactPhone: "+919876543211",
      packageType: "food",
      weight: "1",
      timing: "asap",
      complianceConsent: true,
      consentAcceptedAt: new Date().toISOString(),
    });

    expect(request.pickup.latitude).toBeUndefined();
    expect(request.pickup.longitude).toBeUndefined();
    expect(request.drop.latitude).toBeUndefined();
    expect(request.drop.longitude).toBeUndefined();
  });
});
