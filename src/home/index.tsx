import { Suspense } from "react";
import HomePage from "./HomePage";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomePage />
    </Suspense>
  );
}
