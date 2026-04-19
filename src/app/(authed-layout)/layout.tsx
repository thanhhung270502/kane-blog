import { Suspense } from "react";

import { Header } from "@/shared";

function HeaderFallback() {
  return (
    <div
      className="border-black-quaternary bg-black-secondary sticky top-0 right-0 left-0 z-50 h-16 border-b"
      aria-hidden
    />
  );
}

export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Suspense fallback={<HeaderFallback />}>
        <Header />
      </Suspense>
      {children}
    </div>
  );
}
