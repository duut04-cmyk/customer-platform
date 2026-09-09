import { Suspense } from "react";
import GetStartedPage from "@/auth/components/GetStartedPage";

export default function GetStartedRoute() {
  return (
    <Suspense fallback={null}>
      <GetStartedPage />
    </Suspense>
  );
}
