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

  it("maps full create snapshot including addresses and uploaded photos", () => {
    const request = mapFormToCreateRequest({
      ...initialDeliveryFormData,
      pickupAddress: "221B Baker Street",
      pickupLatitude: 12.97,
      pickupLongitude: 77.59,
      dropAddress: "10 Downing Street",
      dropLatitude: 12.93,
      dropLongitude: 77.62,
      pickupContactName: "Alice",
      pickupContactPhone: "+919876543210",
      dropContactName: "Bob",
      dropContactPhone: "+919876543211",
      packageType: "document",
      packageSizeTier: "small",
      weight: "0.5",
      timing: "asap",
      instructions: "Ring the bell",
      complianceConsent: true,
      consentAcceptedAt: new Date().toISOString(),
      packagePhotos: [
        {
          id: "p1",
          previewUrl: "blob:1",
          mimeType: "image/jpeg",
          fileSizeBytes: 1024,
          objectKey: "staging/c/batch/photos/a.jpg",
          storageProvider: "CLOUDFLARE_R2",
        },
      ],
    });

    expect(request.pickup.addressText).toBe("221B Baker Street");
    expect(request.drop.addressText).toBe("10 Downing Street");
    expect(request.pickup.contactName).toBe("Alice");
    expect(request.specialInstructions).toBe("Ring the bell");
    expect(request.package.weightKg).toBe(0.5);
    expect(request.package.sizeTier).toBe("SMALL");
    expect(request.package.photos).toEqual([
      {
        objectKey: "staging/c/batch/photos/a.jpg",
        storageProvider: "CLOUDFLARE_R2",
        mimeType: "image/jpeg",
        fileSizeBytes: 1024,
      },
    ]);
  });

  it("defaults food small to tier max weight and category dimension preset", () => {
    const request = mapFormToCreateRequest({
      ...initialDeliveryFormData,
      pickupAddress: "Pickup",
      dropAddress: "Drop",
      pickupContactName: "A",
      pickupContactPhone: "+919876543210",
      dropContactName: "B",
      dropContactPhone: "+919876543211",
      packageType: "food",
      packageSizeTier: "small",
      weight: "",
      timing: "asap",
      complianceConsent: true,
      consentAcceptedAt: new Date().toISOString(),
    });

    expect(request.package.weightKg).toBe(0.5);
    expect(request.package.sizeTier).toBe("SMALL");
    expect(request.package.lengthCm).toBe(25);
    expect(request.package.widthCm).toBe(25);
    expect(request.package.heightCm).toBe(10);
  });
});
