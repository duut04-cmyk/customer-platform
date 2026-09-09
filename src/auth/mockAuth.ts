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
  redirectTo = "/dashboard",
  ms = 500,
) {
  await delay(ms);
  router.push(redirectTo);
}

export async function mockGoogleAuth(
  router: DashboardRouter,
  redirectTo = "/dashboard",
  ms = 550,
) {
  const duration = ms + Math.floor(Math.random() * 150);
  await delay(duration);
  router.push(redirectTo);
}
