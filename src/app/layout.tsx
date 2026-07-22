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
        {/* Block the first paint until the saved theme attribute is set so
            returning visitors never see a flash of the wrong theme. The
            TerminalThemeProvider reads the same key and injects the full
            palette CSS on mount. The static CSS fallback (globals.css) is
            Dracula, so first-time visitors see Dracula; returning visitors
            get their saved theme's attribute set before paint. */}
        <Script
          id="theme-flash-prevention"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('td-terminal-theme');if(t)document.documentElement.setAttribute('data-term-theme',t)}catch(e){}`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
