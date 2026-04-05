import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { MainPage } from "@/modules/main";
import { AuthService } from "@/services/auth.service";
import { CookieKeys } from "@/shared";

export default async function Page() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(CookieKeys.ACCESS_TOKEN)?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  const user = await AuthService.getMe(sessionToken);
  if (!user) {
    redirect("/login");
  }

  return <MainPage currentUser={user} />;
}
