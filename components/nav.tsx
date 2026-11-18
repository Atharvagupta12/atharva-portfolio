"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Command, FileText, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { profile, sections } from "@/lib/data";
import { GithubIcon, LeetcodeIcon, LinkedinIcon, ease } from "./ui";

export function openPalette() {
  window.dispatchEvent(new Event("ag:palette"));
}

export default function Nav() {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    const onTop = () => window.scrollY < 300 && setActive("");
    window.addEventListener("scroll", onTop, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("scroll", onTop); io.disconnect(); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-lime via-lime to-cyan" />
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className={`transition-all duration-500 ${scrolled ? "border-b border-white/[0.06] bg-ink/70 backdrop-blur-xl" : "border-b border-transparent"}`}>
          <div className="container-x flex h-[72px] items-center justify-between gap-4">
            <a href="#top" className="group flex items-center gap-2.5" aria-label="Atharva Gupta — home">
              <span className="flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-xl border border-white/10 bg-white/[0.04] font-display text-[13px] font-bold leading-none tracking-tight transition-colors group-hover:border-lime/50">
                AG<span className="text-lime">.</span>
              </span>
              <span className="hidden text-sm font-medium tracking-tight sm:block">{profile.name}</span>
            </a>

            <nav className="hidden items-center rounded-full border border-white/[0.08] bg-surface/60 p-1 backdrop-blur-xl md:flex" aria-label="Primary">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className={`relative rounded-full px-4 py-2 text-[13px] transition-colors ${active === s.id ? "text-ink" : "text-fg/70 hover:text-fg"}`}>
                  {active === s.id && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-lime" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                  )}
                  <span className="relative">{s.label}</span>
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={openPalette}
                className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[11px] text-muted transition-colors hover:border-white/25 hover:text-fg lg:flex"
                aria-label="Open command menu"
              >
                {isMac ? <Command size={12} /> : <span>Ctrl</span>}
                <span>K</span>
              </button>
              {profile.links.resume && (
                <a href={profile.links.resume} target="_blank" rel="noreferrer" className="btn btn-ghost !px-3.5 !py-2 !text-[13px] sm:!px-4">
                  <FileText size={14} /> <span className="sm:hidden">CV</span><span className="hidden sm:inline">Résumé</span>
                </a>
              )}
              <a href={`mailto:${profile.email}`} className="btn btn-primary hidden !py-2 !text-[13px] sm:inline-flex">
                Let&apos;s talk <ArrowUpRight size={15} />
              </a>
              <button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 md:hidden" aria-label="Toggle menu" aria-expanded={open}>
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink/95 backdrop-blur-2xl md:hidden"
          >
            <nav className="container-x flex h-full flex-col justify-center gap-2" aria-label="Mobile">
              {sections.map((s, i) => (
                <motion.a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.5, ease }}
                  className="flex items-baseline gap-4 border-b border-white/[0.06] py-4 font-display text-4xl font-semibold tracking-tight"
                >
                  <span className="font-mono text-xs text-lime">0{i + 1}</span>
                  {s.label}
                </motion.a>
              ))}
              <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                href={`mailto:${profile.email}`}
                className="btn btn-primary mt-8 self-start"
              >
                {profile.email} <ArrowUpRight size={15} />
              </motion.a>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="mt-4 flex items-center gap-2"
              >
                {[
                  { href: profile.links.github, label: "GitHub", icon: <GithubIcon size={17} /> },
                  { href: profile.links.linkedin, label: "LinkedIn", icon: <LinkedinIcon size={17} /> },
                  { href: profile.links.leetcode, label: "LeetCode", icon: <LeetcodeIcon size={17} /> },
                  { href: profile.links.resume, label: "Résumé", icon: <FileText size={17} /> },
                ].filter((s) => s.href).map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-fg/80 hover:border-lime/40 hover:text-lime">
                    {s.icon}
                  </a>
                ))}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
