"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";

interface ContactSectionProps {
  isLight: boolean;
}

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

  const inputClass = `w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
    isLight
      ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
      : "bg-[#0a0a0a] border-[#262626] text-white placeholder-gray-500"
  }`;

  return (
    <AnimatedSection id="contact" className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Deployment Ready</h2>
        <div className={`mb-8 max-w-2xl mx-auto ${isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}`}>
          <p className="mb-4 text-lg">
            I am currently open to new opportunities at the intersection of <strong>AI systems</strong> and <strong>operations leadership</strong>.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <span className={`px-3 py-1 rounded-full border font-medium ${isLight ? 'bg-green-100 text-green-700 border-green-200' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
              TN Visa Eligible
            </span>
            <span className={`px-3 py-1 rounded-full border font-medium ${isLight ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
              Open to Relocation (SF, NYC, Austin)
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a
            href="mailto:dico.angelo97@gmail.com"
            className="px-6 py-3 bg-[#6366f1] hover:bg-[#5558e3] rounded-lg font-medium transition-colors text-white"
          >
            dico.angelo97@gmail.com
          </a>
          <a
            href="tel:+15199996099"
            className={`px-6 py-3 border rounded-lg font-medium transition-colors ${isLight
                ? 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-800'
                : 'bg-[#141414] hover:bg-[#1f1f1f] border-[#262626]'
              }`}
          >
            519-999-6099
          </a>
        </div>

        {/* Contact Form */}
        <div className="max-w-lg mx-auto mb-8">
          <h3 className={`text-xl font-medium mb-4 ${isLight ? 'text-gray-700' : 'text-[#a3a3a3]'}`}>
            Send a Message
          </h3>

          {status === "sent" ? (
            <div className={`p-6 rounded-xl border text-center ${
              isLight ? 'bg-green-50 border-green-200' : 'bg-green-500/10 border-green-500/20'
            }`}>
              <p className={`text-lg font-medium mb-1 ${isLight ? 'text-green-800' : 'text-green-400'}`}>
                Message sent!
              </p>
              <p className={`text-sm ${isLight ? 'text-green-600' : 'text-green-500/80'}`}>
                I&apos;ll get back to you shortly.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className={`mt-4 text-sm underline ${isLight ? 'text-green-700' : 'text-green-400'}`}
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
                className={inputClass}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                required
              />
              <textarea
                placeholder="Your message..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                className={`${inputClass} resize-y`}
                required
              />
              {status === "error" && (
                <p className="text-red-500 text-sm">Failed to send. Please try again or email directly.</p>
              )}
              <button
                type="submit"
                disabled={!canSubmit || status === "sending"}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  canSubmit && status !== "sending"
                    ? "bg-[#6366f1] hover:bg-[#5558e3] text-white cursor-pointer"
                    : isLight
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#262626] text-gray-500 cursor-not-allowed"
                }`}
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>

        <div className="flex gap-6 justify-center">
          <a href="https://www.linkedin.com/in/dico-angelo/" target="_blank" className={`transition-colors ${isLight ? 'text-gray-500 hover:text-gray-900' : 'text-[#737373] hover:text-white'}`}>
            LinkedIn
          </a>
          <a href="https://github.com/Dicoangelo" target="_blank" className={`transition-colors ${isLight ? 'text-gray-500 hover:text-gray-900' : 'text-[#737373] hover:text-white'}`}>
            GitHub
          </a>
          <a href="https://x.com/dicoangelo" target="_blank" className={`transition-colors ${isLight ? 'text-gray-500 hover:text-gray-900' : 'text-[#737373] hover:text-white'}`}>
            X
          </a>
          <a href="https://metaventionsai.com" target="_blank" className={`transition-colors ${isLight ? 'text-gray-500 hover:text-gray-900' : 'text-[#737373] hover:text-white'}`}>
            Metaventions AI
          </a>
        </div>
      </div>
    </AnimatedSection>
  );
}
