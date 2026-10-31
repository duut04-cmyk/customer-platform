export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category:
    "getting-started" | "booking" | "payments" | "tracking" | "account" | "safety";
};

export const HELP_FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-is-doot",
    category: "getting-started",
    question: "What is Doot?",
    answer:
      "Doot is a hyperlocal delivery platform for individuals and local businesses. You enter pickup and drop-off details, get an eligible delivery quote, and Doot selects a recommended logistics partner automatically. You do not need to compare or contact individual courier companies yourself.",
  },
  {
    id: "who-can-use",
    category: "getting-started",
    question: "Who can use Doot?",
    answer:
      "Doot is built for everyday senders and local businesses arranging deliveries between supported addresses within operational service areas—such as homes, shops, offices, and other eligible destinations in the city.",
  },
  {
    id: "service-areas",
    category: "getting-started",
    question: "Where does Doot operate?",
    answer:
      "Deliveries are available within Doot’s supported service areas. Availability depends on pickup and drop-off locations and the logistics partners configured for that route. If a route is not serviceable, you will see that during quoting.",
  },
  {
    id: "how-to-book",
    category: "booking",
    question: "How do I create a delivery?",
    answer:
      "Sign in or create an account, then start a new delivery. Add pickup and drop-off details and contacts, describe your package (including photos when required), complete safety consent, review charges, pay, and confirm. Doot handles logistics partner selection for eligible options.",
  },
  {
    id: "partner-selection",
    category: "booking",
    question: "Do I choose the courier company?",
    answer:
      "No. Doot evaluates eligible logistics partners for your route and selects a recommended option. Third-party providers (for example, partners integrated with the platform) fulfill the physical delivery. Doot does not operate its own delivery fleet.",
  },
  {
    id: "pricing",
    category: "payments",
    question: "How are delivery prices calculated?",
    answer:
      "The amount shown before you confirm typically includes the logistics partner charge, applicable platform fees, and taxes such as GST where applicable. Always review the total on the review step before payment.",
  },
  {
    id: "payment",
    category: "payments",
    question: "How does payment work?",
    answer:
      "After you review your booking, you complete payment through the available checkout flow. Booking with the logistics partner proceeds according to platform rules once payment requirements are satisfied. Keep your order confirmation for your records.",
  },
  {
    id: "track",
    category: "tracking",
    question: "How do I track my delivery?",
    answer:
      "Open Deliveries from your account, select the delivery, and open tracking. You can follow available status updates there. Update frequency depends on partner and route configuration—continuous live GPS is not guaranteed for every shipment.",
  },
  {
    id: "otp",
    category: "tracking",
    question: "How does OTP verification work?",
    answer:
      "Where enabled for your booking, separate codes may be used for pickup and delivery handoff. Share the pickup OTP only with the assigned driver at collection, and the delivery OTP only with the intended recipient. Never post OTP codes publicly.",
  },
  {
    id: "cancel",
    category: "tracking",
    question: "Can I cancel a delivery?",
    answer:
      "You may be able to cancel before the package is picked up, from the delivery or tracking experience, by confirming a reason. Cancellation is generally not available after pickup. Any refunds or adjustments follow platform and partner rules for that booking.",
  },
  {
    id: "account",
    category: "account",
    question: "How do I manage my account?",
    answer:
      "After signing up and verifying your email (when required), use Account settings to update profile details. You can log in with your registered credentials or supported sign-in options configured for the platform.",
  },
  {
    id: "prohibited",
    category: "safety",
    question: "What items are prohibited?",
    answer:
      "Weapons, illegal drugs, hazardous materials, undeclared cash, live animals (unless explicitly supported), and other items banned under applicable Indian law are not allowed. You must declare your package accurately. See the Safety & compliance page for the full list and your responsibilities.",
  },
  {
    id: "packaging",
    category: "safety",
    question: "How should I pack my items?",
    answer:
      "Pack securely so items withstand normal handling in transit. Declare fragile, perishable, or high-value items honestly, provide accurate weight or dimensions when asked, and upload clear package photos when the booking flow requires them.",
  },
  {
    id: "support-contact",
    category: "account",
    question: "How do I contact support?",
    answer:
      "Email support@doot.com. Support hours are typically Monday–Saturday, 9 AM – 6 PM IST. For an active delivery, also check the tracking page for status and any driver contact details shown when available.",
  },
];

export const FAQ_CATEGORIES: { id: FaqItem["category"]; label: string }[] = [
  { id: "getting-started", label: "Getting started" },
  { id: "booking", label: "Booking" },
  { id: "payments", label: "Payments" },
  { id: "tracking", label: "Tracking & updates" },
  { id: "account", label: "Account" },
  { id: "safety", label: "Safety" },
];
