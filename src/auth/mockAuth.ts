export function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

type DashboardRouter = {
  push: (href: string) => void;
};

export async function mockNavigateToDashboard(
  router: DashboardRouter,
  ms = 500,
) {
  await delay(ms);
  router.push("/dashboard");
}

export async function mockGoogleAuth(router: DashboardRouter, ms = 550) {
  const duration = ms + Math.floor(Math.random() * 150);
  await delay(duration);
  router.push("/dashboard");
}
