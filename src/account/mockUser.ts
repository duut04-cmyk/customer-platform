export type NotificationPreferences = {
  deliveryUpdates: boolean;
  smsAlerts: boolean;
  emailAlerts: boolean;
  marketingEmails: boolean;
};

export type MockUser = {
  name: string;
  email: string;
  phone: string;
  initials: string;
  memberSince: string;
  notifications: NotificationPreferences;
};

export const MOCK_USER: MockUser = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+91 98765 43210",
  initials: "JD",
  memberSince: "Jan 2024",
  notifications: {
    deliveryUpdates: true,
    smsAlerts: true,
    emailAlerts: true,
    marketingEmails: false,
  },
};
