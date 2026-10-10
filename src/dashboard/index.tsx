import { DASHBOARD_MAIN } from "./components/layout";
import DashboardContent from "./components/DashboardContent";

export default function Dashboard() {
  return (
    <main className={`${DASHBOARD_MAIN} bg-white`}>
      <DashboardContent />
    </main>
  );
}
