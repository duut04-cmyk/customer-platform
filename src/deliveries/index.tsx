import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import DeliveriesHistoryContent from "./components/DeliveriesHistoryContent";

export default function DeliveriesHistory() {
  return (
    <main className={`${DASHBOARD_MAIN} bg-white`}>
      <DeliveriesHistoryContent />
    </main>
  );
}
