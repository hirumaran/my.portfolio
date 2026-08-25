"use client";

import TerminalThemeProvider from "@/components/site/TerminalThemeProvider";
import { MusicPlayerProvider } from "@/components/site/MusicPlayerContext";
import MusicIsland from "@/components/site/MusicIsland";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TerminalThemeProvider>
      <MusicPlayerProvider>
        {children}
        <MusicIsland />
      </MusicPlayerProvider>
    </TerminalThemeProvider>
  );
}
