"use client";

import { motion } from "framer-motion";
import { ArrowUp, ArrowUpRight, Copy, FileText, Mail, MapPin, Phone } from "lucide-react";
import { profile, sections } from "@/lib/data";
import { GithubIcon, LeetcodeIcon, LinkedinIcon, Magnetic, Reveal, useCopy, useLocalTime } from "./ui";

export default function Contact() {
  const copy = useCopy();
  const time = useLocalTime(profile.timezone);

  const links = [
    { label: "LinkedIn", href: profile.links.linkedin, icon: <LinkedinIcon size={16} /> },
    { label: "GitHub", href: profile.links.github, icon: <GithubIcon size={16} /> },
    { label: "LeetCode", href: profile.links.leetcode, icon: <LeetcodeIcon size={16} /> },
    { label: "Résumé", href: profile.links.resume, icon: <FileText size={16} /> },
  ].filter((l) => l.href);

  return (
    <footer id="contact" className="relative overflow-hidden pt-24 sm:pt-32">
      <div className="pointer-events-none absolute left-1/2 top-40 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-lime/[0.08] blur-[140px]" />
      <div className="grid-bg mask-fade-b pointer-events-none absolute inset-0 opacity-50" />

      <div className="container-x relative">
        <Reveal>
          <div className="eyebrow flex items-center gap-3">
            <span className="text-lime">06</span><span className="h-px w-10 bg-white/20" />Contact
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-8 font-display text-[clamp(3rem,10vw,9rem)] font-semibold leading-[0.9] tracking-[-0.055em]">
            Have a hard<br />
            problem? <span className="font-serif font-normal italic tracking-[-0.03em] text-gradient">Let&apos;s talk.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-8 max-w-xl text-[16px] leading-relaxed text-muted">
            I&apos;m looking for software engineering roles where I can own backend systems end-to-end — APIs, data, infra and the AI layer on top.
            My inbox is always open.
          </p>
        </Reveal>

        <Reveal delay={0.22}>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Magnetic strength={0.25}>
              <a href={`mailto:${profile.email}`} className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full bg-lime py-3 pl-7 pr-3 text-ink transition-shadow hover:shadow-[0_0_60px_-10px_rgb(var(--lime))]">
                <span className="text-[17px] font-semibold">Start a conversation</span>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-lime transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={20} />
                </span>
              </a>
            </Magnetic>
            <button onClick={() => copy(profile.email, "Email copied — talk soon!")} className="btn btn-ghost !py-4">
              <Copy size={15} /> Copy email
            </button>
          </div>
        </Reveal>

        {/* Contact grid */}
        <Reveal delay={0.1}>
          <div className="mt-20 grid gap-px overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
            <a href={`mailto:${profile.email}`} className="group bg-ink p-6 transition-colors hover:bg-surface">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-dim"><span className="flex items-center gap-2"><Mail size={13} /> Email</span><ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" /></div>
              <div className="mt-3 break-all text-[15px] group-hover:text-lime">{profile.email}</div>
            </a>
            <a href={profile.phoneHref} className="group bg-ink p-6 transition-colors hover:bg-surface">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-dim"><span className="flex items-center gap-2"><Phone size={13} /> Phone</span><ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" /></div>
              <div className="mt-3 text-[15px] group-hover:text-lime">{profile.phone}</div>
            </a>
            <div className="bg-ink p-6">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-dim"><MapPin size={13} /> Based in</div>
              <div className="mt-3 text-[15px]">{profile.location}</div>
            </div>
            <div className="bg-ink p-6">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
                <span className="relative flex h-1.5 w-1.5"><span className="absolute inset-0 animate-ping2 rounded-full bg-lime" /><span className="relative h-1.5 w-1.5 rounded-full bg-lime" /></span>
                Local time
              </div>
              <div className="mt-3 text-[15px] tabular-nums" suppressHydrationWarning>{time || "—"} <span className="text-dim">IST · UTC+5:30</span></div>
            </div>
          </div>
        </Reveal>

        {links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="chip !px-4 !py-2 !text-[12px]">
                {l.icon} {l.label} <ArrowUpRight size={12} />
              </a>
            ))}
          </div>
        )}

        {/* Giant wordmark */}
        <div className="relative mt-24 select-none overflow-hidden" aria-hidden>
          <motion.div
            initial={{ y: "40%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="whitespace-nowrap bg-gradient-to-b from-white/[0.12] to-transparent bg-clip-text text-center font-display text-[19.5vw] font-bold leading-[0.8] tracking-[-0.07em] text-transparent xl:text-[250px]"
          >
            ATHARVA
          </motion.div>
        </div>

        <div className="flex flex-col items-center justify-between gap-5 border-t border-white/[0.07] py-8 text-[12px] text-dim sm:flex-row">
          <span>© {new Date().getFullYear()} {profile.name}. Designed &amp; engineered with intention.</span>
          <nav className="flex flex-wrap justify-center gap-5" aria-label="Footer">
            {sections.map((s) => <a key={s.id} href={`#${s.id}`} className="transition-colors hover:text-fg">{s.label}</a>)}
          </nav>
          <a href="#top" className="group inline-flex items-center gap-2 transition-colors hover:text-lime">
            Back to top <span className="grid h-7 w-7 place-items-center rounded-full border border-white/10 transition-transform group-hover:-translate-y-0.5"><ArrowUp size={13} /></span>
          </a>
        </div>
      </div>
    </footer>
  );
}
