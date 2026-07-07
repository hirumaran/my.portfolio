import Providers from "@/components/site/Providers";
import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import Experience from "@/components/site/Experience";
import Impact from "@/components/site/Impact";
import Skills from "@/components/site/Skills";
import About from "@/components/site/About";
import Contact from "@/components/site/Contact";

export default function Home() {
  return (
    <Providers>
      <a
        href="#work"
        className="label sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-ink focus:px-5 focus:py-3 focus:text-paper"
      >
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <Experience />
        <Impact />
        <Skills />
        <About />
        <Contact />
      </main>
    </Providers>
  );
}
