import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { MainPage } from "@/modules/main";
import { CookieKeys } from "@/shared";

export default async function Page() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(CookieKeys.ACCESS_TOKEN)?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  return <MainPage />;
}
