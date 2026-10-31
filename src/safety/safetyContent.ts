import {
  CUSTOMER_RESPONSIBILITIES,
  PROHIBITED_ITEMS,
} from "@/compliance/prohibitedItems";

export { CUSTOMER_RESPONSIBILITIES, PROHIBITED_ITEMS };

export const SAFETY_INTRO = {
  title: "Our commitment",
  body: [
    "Doot is a hyperlocal delivery coordination platform. We connect individuals and local businesses with eligible third-party logistics partners for supported routes. Doot does not operate its own delivery fleet or employ its own drivers.",
    "Every booking must comply with applicable transport, logistics, and consumer protection requirements. We do not knowingly accept illegal, dangerous, or undeclared prohibited items.",
  ],
} as const;

export const PACKAGING_GUIDANCE = [
  "Use sturdy packaging appropriate for the item and expected handling.",
  "Seal packages securely; cushion fragile goods and mark them clearly when relevant.",
  "Provide accurate descriptions, dimensions, and weight when requested.",
  "Upload clear package photos when the booking flow asks for them.",
  "Declare high-value, fragile, or perishable items honestly before confirming.",
] as const;

export const OTP_SAFETY = {
  title: "OTP & handoff safety",
  body: "Where pickup or delivery OTP codes are issued for your booking, they verify that the right person hands over or receives the package. Share codes only with the assigned driver at pickup and the intended recipient at delivery. Never post OTP codes on social media or share them with unknown third parties.",
} as const;

export const LIABILITY_NOTE = {
  title: "Responsibility & liability",
  body: [
    "You are responsible for the contents of your package, accurate declarations, and safe packaging. Sending prohibited or illegal items may result in refusal, cancellation, or other action as required by law or partner policy.",
    "By confirming a booking, you agree that you have read the safety requirements and that you indemnify Doot against claims arising from illegal, prohibited, or undeclared items, consistent with the consent step in the create-delivery flow.",
    "Logistics partners perform physical transportation under their own operating rules. Availability, timelines, and tracking detail can vary by partner and route.",
  ],
} as const;

export const WHEN_TO_CONTACT = {
  title: "When to contact support",
  items: [
    "You cannot complete booking or payment for a valid serviceable route.",
    "Status updates appear incorrect or stuck after a reasonable wait.",
    "You have a safety concern about a pickup or drop-off location.",
    "You need help with account access or verification.",
  ],
  contact: "Email support@doot.com (Mon–Sat, 9 AM – 6 PM IST).",
} as const;

export const SAFETY_DISCLAIMER =
  "This page summarizes platform safety expectations for customers. It is not legal advice. Applicable laws and partner policies may change. Always declare packages accurately and follow instructions shown during booking.";
