import DashboardHeader from "./components/DashboardHeader";
import DashboardHero from "./components/DashboardHero";
import DashboardStats from "./components/DashboardStats";
import RecentDeliveries from "./components/RecentDeliveries";
import { DASHBOARD_MAIN } from "./components/layout";
import { getRecentDeliveries } from "./deliveries/mockDeliveries";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader activeNav="dashboard" />
      <main className={DASHBOARD_MAIN}>
        <div className="space-y-8">
          <DashboardHero />
          <DashboardStats />
          <RecentDeliveries deliveries={getRecentDeliveries(3)} />
        </div>
      </main>
    </div>
  );
}
