"use client";

import ThemeProvider from "@/components/site/ThemeProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
