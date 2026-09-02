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
            2. Display mode: data-site-theme-preference stores system/light/
               dark while data-site-theme carries the resolved light/dark
               paint. System follows prefers-color-scheme live after mount. */}
        <Script
          id="theme-flash-prevention"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('td-terminal-theme');if(t)document.documentElement.setAttribute('data-term-theme',t)}catch(e){};try{var p=localStorage.getItem('td-site-theme')}catch(e){var p=null};if(p!=='system'&&p!=='dark'&&p!=='light')p='system';try{var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var s=p==='system'?(d?'dark':'light'):p;var r=document.documentElement;r.setAttribute('data-site-theme-preference',p);r.setAttribute('data-site-theme',s);var m=document.querySelector('meta[name="theme-color"]')||document.createElement('meta');m.name='theme-color';m.content=s==='dark'?'#0f0f0e':'#ffffff';if(!m.parentNode)document.head.appendChild(m)}catch(e){}`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
