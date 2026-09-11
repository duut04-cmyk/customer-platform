import DashboardInPageTopSection from "@/dashboard/components/DashboardInPageTopSection";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import AccountSettingsHeader from "./components/AccountSettingsHeader";
import AccountSummaryCard from "./components/AccountSummaryCard";
import NotificationPreferences from "./components/NotificationPreferences";
import ProfileSection from "./components/ProfileSection";
import SecuritySection from "./components/SecuritySection";

export default function AccountSettings() {
  return (
    <main className={`${DASHBOARD_MAIN} bg-white`}>
      <div className="space-y-4 lg:space-y-5">
        <DashboardInPageTopSection />
        <AccountSettingsHeader />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-x-5">
          <div className="flex flex-col gap-4">
            <ProfileSection />
            <NotificationPreferences />
            <SecuritySection />
          </div>

          <aside className="flex flex-col gap-4">
            <AccountSummaryCard />
          </aside>
        </div>
      </div>
    </main>
  );
}
