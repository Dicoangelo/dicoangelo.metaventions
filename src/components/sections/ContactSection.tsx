"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";

interface ContactSectionProps {
  isLight: boolean;
}

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/dico-angelo/" },
  { label: "GitHub", href: "https://github.com/Dicoangelo" },
  { label: "X", href: "https://x.com/dicoangelo" },
  { label: "Metaventions AI", href: "https://metaventionsai.com" },
];

export function ContactSection({ isLight }: ContactSectionProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const canSubmit = form.name.trim() && form.email.trim() && form.message.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || status === "sending") return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const fieldBase = `w-full px-4 py-3 rounded-xl text-[14px] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#6366f1]/35 focus:border-[#6366f1]/40 ${
    isLight
      ? "bg-white/80 border border-gray-200 text-gray-900 placeholder-gray-400 backdrop-blur-sm"
      : "bg-white/[0.035] border border-white/[0.08] text-white placeholder-[#525252] backdrop-blur-sm"
  }`;

  return (
    <AnimatedSection id="contact" className="relative py-24 px-6">
      {/* Ambient brand wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[70%] blur-3xl opacity-50"
        style={{
          background: isLight
            ? "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(99,102,241,0.10), transparent 70%)"
            : "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(99,102,241,0.16), transparent 70%)",
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <span
          className={`inline-block text-[11px] font-semibold uppercase tracking-[0.2em] mb-4 ${
            isLight ? "text-[#6366f1]/80" : "text-[#818cf8]"
          }`}
        >
          Get in touch
        </span>
        <h2 className={`text-4xl md:text-5xl font-bold tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
          Deployment ready.
        </h2>
        <p className={`mt-5 max-w-2xl mx-auto text-[16px] leading-relaxed ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>
          Open to roles at the intersection of <strong className={isLight ? "text-gray-900" : "text-white"}>AI systems</strong> and{" "}
          <strong className={isLight ? "text-gray-900" : "text-white"}>operations leadership</strong>.
        </p>

        {/* Status pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1a1208] shadow-[0_2px_10px_-2px_rgba(215,178,109,0.5)]"
            style={{ background: "linear-gradient(135deg, #F9D976 0%, #D7B26D 50%, #B38728 100%)" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-emerald-600 animate-ping opacity-75" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-700" />
            </span>
            Open to opportunities
          </span>
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-medium ${
              isLight ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            }`}
          >
            TN visa eligible
          </span>
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-medium ${
              isLight ? "bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/30" : "bg-[#6366f1]/15 text-[#818cf8] border border-[#6366f1]/30"
            }`}
          >
            Remote · SF · NYC · Austin
          </span>
        </div>

        {/* Direct contact buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="mailto:dico.angelo97@gmail.com"
            className="group inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-br from-[#6366f1] to-[#5558e3] hover:from-[#5558e3] hover:to-[#4548c7] rounded-xl text-[14px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.55)] hover:shadow-[0_10px_28px_-8px_rgba(99,102,241,0.7)] transition-all duration-200 active:scale-[0.98]"
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-10 5L2 7" />
            </svg>
            dico.angelo97@gmail.com
          </a>
          <a
            href="tel:+15199996099"
            className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 active:scale-[0.98] ${
              isLight
                ? "bg-white/80 hover:bg-white border border-gray-200 text-gray-800 backdrop-blur-sm"
                : "bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white backdrop-blur-sm"
            }`}
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.72A2 2 0 0 1 22 16.92z" />
            </svg>
            519-999-6099
          </a>
        </div>

        {/* Form card */}
        <div
          className={`mt-12 max-w-xl mx-auto p-6 md:p-7 rounded-2xl border backdrop-blur-xl ${
            isLight
              ? "bg-white/70 border-gray-200/80 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)]"
              : "bg-[#0a0a0a]/70 border-white/[0.07] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]"
          }`}
        >
          <h3 className={`text-left text-[12px] font-semibold uppercase tracking-[0.16em] mb-5 ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
            Or send a message
          </h3>

          {status === "sent" ? (
            <div
              className={`p-6 rounded-xl border text-center ${
                isLight ? "bg-emerald-50 border-emerald-200" : "bg-emerald-500/10 border-emerald-500/20"
              }`}
            >
              <p className={`text-[15px] font-semibold mb-1 ${isLight ? "text-emerald-800" : "text-emerald-400"}`}>Message sent.</p>
              <p className={`text-[13px] ${isLight ? "text-emerald-600" : "text-emerald-500/80"}`}>I&apos;ll get back to you shortly.</p>
              <button
                onClick={() => setStatus("idle")}
                className={`mt-4 text-[12px] font-medium underline ${isLight ? "text-emerald-700" : "text-emerald-400"}`}
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-left">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={fieldBase}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={fieldBase}
                required
              />
              <textarea
                placeholder="Your message..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                className={`${fieldBase} resize-y`}
                required
              />
              {status === "error" && (
                <p className="text-red-500 text-[13px]">Failed to send. Please try again or email directly.</p>
              )}
              <button
                type="submit"
                disabled={!canSubmit || status === "sending"}
                className={`w-full py-3 px-6 rounded-xl text-[14px] font-semibold transition-all duration-200 active:scale-[0.99] ${
                  canSubmit && status !== "sending"
                    ? "bg-gradient-to-br from-[#6366f1] to-[#5558e3] hover:from-[#5558e3] hover:to-[#4548c7] text-white shadow-[0_4px_14px_-4px_rgba(99,102,241,0.5)] hover:shadow-[0_6px_18px_-4px_rgba(99,102,241,0.65)]"
                    : isLight
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white/[0.06] text-[#525252] cursor-not-allowed"
                }`}
              >
                {status === "sending" ? "Sending..." : "Send message"}
              </button>
            </form>
          )}
        </div>

        {/* Social rail */}
        <div className={`mt-12 flex items-center justify-center gap-6 text-[13px] ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors hover:text-[#6366f1] ${isLight ? "" : "hover:text-white"}`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
