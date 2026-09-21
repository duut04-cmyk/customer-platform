import { redirect } from "next/navigation";

type GetStartedPageProps = {
  searchParams: Promise<{ mode?: string; next?: string }>;
};

export default async function GetStartedRoute({ searchParams }: GetStartedPageProps) {
  const params = await searchParams;
  const mode = params.mode === "login" ? "login" : "signup";
  const query = new URLSearchParams({ auth: mode });
  if (params.next) {
    query.set("next", params.next);
  }
  redirect(`/?${query.toString()}`);
}
