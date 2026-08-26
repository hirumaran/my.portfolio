"use client";

import TerminalThemeProvider from "@/components/site/TerminalThemeProvider";
import { MusicPlayerProvider } from "@/components/site/MusicPlayerContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TerminalThemeProvider>
      <MusicPlayerProvider>{children}</MusicPlayerProvider>
    </TerminalThemeProvider>
  );
}
