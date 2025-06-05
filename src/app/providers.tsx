"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

// This “Providers” component is now a pure Client Component.
// We can safely render <SessionProvider> here without errors.
export default function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
