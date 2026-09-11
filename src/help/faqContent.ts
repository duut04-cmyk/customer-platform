export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const HELP_FAQ_ITEMS: FaqItem[] = [
  {
    id: "track",
    question: "How do I track my delivery?",
    answer:
      "Open Deliveries from the sidebar, select your delivery, and tap Track delivery. You’ll see live progress, OTP verification, and estimated arrival time on the tracking page.",
  },
  {
    id: "cancel",
    question: "Can I cancel before pickup?",
    answer:
      "Yes. You can cancel a delivery before the package is picked up from the tracking page. Choose a reason and confirm — cancellation is not available after pickup.",
  },
  {
    id: "otp",
    question: "How does OTP verification work?",
    answer:
      "You receive separate codes for pickup and delivery. Share the pickup OTP with your driver when they collect the package, and the delivery OTP with the recipient when it arrives.",
  },
  {
    id: "prohibited",
    question: "What items are prohibited?",
    answer:
      "We do not allow weapons, illegal drugs, hazardous materials, cash, live animals, or other items banned under Indian law. You must declare your package accurately when booking.",
  },
  {
    id: "pricing",
    question: "How are delivery prices calculated?",
    answer:
      "Pricing includes the delivery partner charge, platform fee, and GST. The final amount is shown before you confirm your booking on the review step.",
  },
];
