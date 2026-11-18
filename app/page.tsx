import About from "@/components/about";
import Achievements from "@/components/achievements";
import CommandPalette from "@/components/command-palette";
import Contact from "@/components/contact";
import Experience from "@/components/experience";
import Hero from "@/components/hero";
import Impact from "@/components/impact";
import Nav from "@/components/nav";
import Projects from "@/components/projects";
import Skills from "@/components/skills";
import { Toaster } from "@/components/ui";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Impact />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Achievements />
      </main>
      <Contact />
      <CommandPalette />
      <Toaster />
    </>
  );
}
