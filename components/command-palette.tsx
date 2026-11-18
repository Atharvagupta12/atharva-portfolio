"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Briefcase, Copy, FileText, FolderGit2, Home, Mail, Phone, Search, Sparkles, User, Wrench } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { profile } from "@/lib/data";
import { GithubIcon, LeetcodeIcon, LinkedinIcon, ease, useCopy } from "./ui";

type Item = { id: string; group: string; label: string; hint?: string; icon: ReactNode; run: () => void };

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const copy = useCopy();

  const items = useMemo<Item[]>(() => {
    const go = (id: string) => () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    const ext = (url: string) => () => window.open(url, "_blank", "noopener,noreferrer");
    const list: Item[] = [
      { id: "top", group: "Navigate", label: "Home", icon: <Home size={16} />, run: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
      { id: "about", group: "Navigate", label: "About me", icon: <User size={16} />, run: go("about") },
      { id: "exp", group: "Navigate", label: "Experience", icon: <Briefcase size={16} />, run: go("experience") },
      { id: "work", group: "Navigate", label: "Projects", hint: "Attendify · GROEI · Dispatch", icon: <FolderGit2 size={16} />, run: go("work") },
      { id: "skills", group: "Navigate", label: "Skills & toolkit", icon: <Wrench size={16} />, run: go("skills") },
      { id: "awards", group: "Navigate", label: "Achievements & education", icon: <Sparkles size={16} />, run: go("achievements") },
      { id: "contact", group: "Navigate", label: "Contact", icon: <Mail size={16} />, run: go("contact") },
      { id: "copy", group: "Actions", label: "Copy email address", hint: profile.email, icon: <Copy size={16} />, run: () => copy(profile.email, "Email copied") },
      { id: "mail", group: "Actions", label: "Send an email", icon: <Mail size={16} />, run: () => (window.location.href = `mailto:${profile.email}`) },
      { id: "call", group: "Actions", label: "Call", hint: profile.phone, icon: <Phone size={16} />, run: () => (window.location.href = profile.phoneHref) },
    ];
    if (profile.links.resume) list.push({ id: "resume", group: "Actions", label: "Download résumé", icon: <FileText size={16} />, run: ext(profile.links.resume) });
    if (profile.links.github) list.push({ id: "gh", group: "Links", label: "GitHub", icon: <GithubIcon size={16} />, run: ext(profile.links.github) });
    if (profile.links.linkedin) list.push({ id: "li", group: "Links", label: "LinkedIn", icon: <LinkedinIcon size={16} />, run: ext(profile.links.linkedin) });
    if (profile.links.leetcode) list.push({ id: "lc", group: "Links", label: "LeetCode", icon: <LeetcodeIcon size={16} />, run: ext(profile.links.leetcode) });
    return list;
  }, [copy]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? items.filter((i) => `${i.label} ${i.hint ?? ""} ${i.group}`.toLowerCase().includes(s)) : items;
  }, [q, items]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
      else if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("ag:palette", onOpen);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("ag:palette", onOpen); };
  }, []);

  useEffect(() => {
    if (open) { setQ(""); setIdx(0); setTimeout(() => inputRef.current?.focus(), 30); }
  }, [open]);

  useEffect(() => setIdx(0), [q]);

  const run = (it: Item) => { setOpen(false); setTimeout(it.run, 60); };

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(filtered.length - 1, i + 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
    if (e.key === "Enter" && filtered[idx]) { e.preventDefault(); run(filtered[idx]); }
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center bg-ink/70 px-4 pt-[14vh] backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command menu"
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease }}
            className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-white/10 bg-raised/95 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
            onKeyDown={onListKey}
          >
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-4">
              <Search size={16} className="text-muted" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Type a command or search…"
                className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-dim"
                aria-label="Search commands"
              />
              <kbd className="rounded-md border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-muted">ESC</kbd>
            </div>
            <div className="max-h-[52vh] overflow-y-auto p-2">
              {filtered.length === 0 && <div className="px-3 py-10 text-center text-sm text-muted">No results for “{q}”</div>}
              {filtered.map((it, i) => {
                const header = it.group !== lastGroup ? it.group : null;
                lastGroup = it.group;
                return (
                  <div key={it.id}>
                    {header && <div className="px-3 pb-1.5 pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">{header}</div>}
                    <button
                      onMouseEnter={() => setIdx(i)}
                      onClick={() => run(it)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${i === idx ? "bg-white/[0.07] text-fg" : "text-fg/75"}`}
                    >
                      <span className={`grid h-8 w-8 place-items-center rounded-lg border ${i === idx ? "border-lime/40 text-lime" : "border-white/10 text-muted"}`}>{it.icon}</span>
                      <span className="flex-1">{it.label}</span>
                      {it.hint && <span className="hidden truncate font-mono text-[11px] text-dim sm:block">{it.hint}</span>}
                      {i === idx && <ArrowRight size={14} className="text-lime" />}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between border-t border-white/[0.07] px-4 py-2.5 font-mono text-[10px] text-dim">
              <span>↑↓ navigate · ↵ select</span>
              <span>{profile.name}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
