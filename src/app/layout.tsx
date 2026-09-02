import type { Metadata } from "next";
import Script from "next/script";
import { Geist_Mono, Inter, Roboto_Condensed } from "next/font/google";
import { profile } from "@/data/resume";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Composed from resume.ts (DESIGN rule 3: resume facts have one source).
export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.metaDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoCondensed.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Block the first paint until the saved theme attributes are set so
            returning visitors never see a flash of the wrong theme.

            1. Terminal theme: TerminalThemeProvider reads the same key and
               injects the full palette CSS on mount. The static CSS fallback
               (globals.css) is Dracula.
            2. Site theme (light/dark): one data-site-theme attribute inverts
               --ink / --paper / --carbon (globals.css). Without a saved
               choice the OS preference is used. The theme-color meta keeps
               the browser chrome on the same ground; setSiteTheme
               (src/lib/site-theme.ts) keeps it in sync after toggles. */}
        <Script
          id="theme-flash-prevention"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('td-terminal-theme');if(t)document.documentElement.setAttribute('data-term-theme',t)}catch(e){};try{var s=localStorage.getItem('td-site-theme')}catch(e){var s=null};if(s!=='dark'&&s!=='light'){try{s=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch(e){s='light'}};try{document.documentElement.setAttribute('data-site-theme',s);var m=document.createElement('meta');m.name='theme-color';m.content=s==='dark'?'#0f0f0e':'#ffffff';document.head.appendChild(m)}catch(e){}`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
