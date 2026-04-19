import { Suspense } from "react";

import { LoginPage } from "@/modules/auth";

export default function Page() {
  return (
    <Suspense fallback={<div className="bg-black-primary min-h-screen" aria-hidden />}>
      <LoginPage />
    </Suspense>
  );
}
