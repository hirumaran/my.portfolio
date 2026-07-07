"use client";

import TerminalThemeProvider from "@/components/site/TerminalThemeProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <TerminalThemeProvider>{children}</TerminalThemeProvider>;
}
