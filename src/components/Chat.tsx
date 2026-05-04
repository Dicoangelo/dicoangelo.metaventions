"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import VoiceOrb from "./VoiceOrb";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "What's the $800M+ TCV story?",
  "What is the Universal Cognitive Wallet?",
  "What multi-agent systems has he built?",
  "Is he open to US relocation?",
];

const PROFILE_METRICS: { value: string; label: string }[] = [
  { value: "58", label: "MCP tools shipped" },
  { value: "44", label: "Production repos" },
  { value: "8", label: "arXiv → production" },
  { value: "4,035", label: "Claude sessions" },
];

const PROFILE_LINKS: { label: string; href: string }[] = [
  { label: "GitHub", href: "https://github.com/Dicoangelo" },
  { label: "LinkedIn", href: "https://linkedin.com/in/dico-angelo" },
  { label: "Email", href: "mailto:dicoangelo@metaventionsai.com" },
];

const CAREER_STAGES: { label: string; detail: string; state: "done" | "active" }[] = [
  { label: "Operations IC", detail: "Rocket Mortgage · process automation", state: "done" },
  { label: "Sr. Partner Systems & Ops", detail: "Contentsquare · OneCRM, 6 platforms wired", state: "done" },
  { label: "Cloud Alliance Lead", detail: "AWS + MSFT · 2x Partner of the Year", state: "done" },
  { label: "Sovereign AI Builder", detail: "Metaventions · multi-agent orchestration", state: "done" },
  { label: "Frontier Operator role", detail: "Open to staff/principal partner-AI seats", state: "active" },
];

const STORAGE_KEY = "dicoangelo-chat-history-v1";

function loadHistory(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(messages: Message[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // sessionStorage can fail on private browsing — silently degrade
  }
}

const MicGlyph = ({ className = "" }: { className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="9" y="3" width="6" height="12" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
  </svg>
);

export default function Chat() {
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [textMessages, setTextMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTextLoading, setIsTextLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showStarters, setShowStarters] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    const stored = loadHistory();
    if (stored.length > 0) {
      setTextMessages(stored);
      setConversationHistory(stored);
    }
  }, []);

  useEffect(() => {
    if (textMessages.length > 0) saveHistory(textMessages);
  }, [textMessages]);

  // "/" focuses the input, like Linear / GitHub / Vercel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleInputFocus = () => {
    const scrollY = window.scrollY;
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollY, behavior: "instant" });
    });
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [textMessages, conversationHistory]);

  const unifiedMessages = useMemo(() => {
    const key = (m: Message) => `${m.role}::${m.content}`;
    const textCount = new Map<string, number>();
    for (const m of textMessages) {
      const k = key(m);
      textCount.set(k, (textCount.get(k) ?? 0) + 1);
    }
    return conversationHistory.map((m) => {
      const k = key(m);
      const remaining = textCount.get(k) ?? 0;
      const isVoice = remaining === 0;
      if (!isVoice) textCount.set(k, remaining - 1);
      return { ...m, isVoice };
    });
  }, [conversationHistory, textMessages]);

  const sendTextMessage = async (text: string) => {
    if (!text.trim() || isTextLoading) return;

    const userMessage: Message = { role: "user", content: text };
    const newTextMessages = [...textMessages, userMessage];
    setTextMessages(newTextMessages);

    const newHistory = [...conversationHistory, userMessage];
    setConversationHistory(newHistory);

    setInput("");
    setIsTextLoading(true);
    setShowStarters(false);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let assistantContent = "";

      setTextMessages([...newTextMessages, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        assistantContent += decoder.decode(value, { stream: true });
        setTextMessages([...newTextMessages, { role: "assistant", content: assistantContent }]);
      }

      setConversationHistory([...newHistory, { role: "assistant", content: assistantContent }]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = { role: "assistant", content: "Sorry, I encountered an error. Please try again." };
      setTextMessages([...newTextMessages, errorMsg]);
    } finally {
      setIsTextLoading(false);
    }
  };

  const addToHistory = (message: Message) => {
    setConversationHistory((prev) => [...prev, message]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendTextMessage(input);
  };

  const handleRegenerate = () => {
    if (textMessages.length === 0 || isTextLoading) return;
    const lastUserIndex = [...textMessages].reverse().findIndex((m) => m.role === "user");
    if (lastUserIndex === -1) return;
    const cutAt = textMessages.length - 1 - lastUserIndex;
    const trimmedText = textMessages.slice(0, cutAt);
    const trimmedHistory = conversationHistory.slice(0, conversationHistory.findIndex((m) => m === textMessages[cutAt]));
    const lastUserText = textMessages[cutAt].content;
    setTextMessages(trimmedText);
    setConversationHistory(trimmedHistory.length > 0 ? trimmedHistory : []);
    sendTextMessage(lastUserText);
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      // clipboard can be blocked
    }
  };

  const handleClearHistory = () => {
    setTextMessages([]);
    setConversationHistory([]);
    setShowStarters(false);
    if (typeof window !== "undefined") sessionStorage.removeItem(STORAGE_KEY);
  };

  const hasMessages = unifiedMessages.length > 0;
  const showInlineStarters = !hasMessages || showStarters;

  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Ambient halo behind the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-16 h-64 blur-3xl opacity-60"
        style={{
          background: isLight
            ? "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.18), transparent 70%)"
            : "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.22), transparent 70%)",
        }}
      />

      <div
        className={`relative rounded-[28px] overflow-hidden border backdrop-blur-2xl transition-colors ${
          isLight
            ? "bg-white/55 border-gray-200/80 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.22),0_8px_24px_-8px_rgba(15,23,42,0.08)]"
            : "bg-[#0a0a0a]/55 border-white/[0.07] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7),0_8px_24px_-8px_rgba(0,0,0,0.4)]"
        }`}
      >
        {/* Brand backdrop — z-0 layer, content stacks above via relative z-10 */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden z-0">
          <Image
            src="/chat-brand-bg.jpg"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority={false}
            className="object-cover object-center scale-[1.05]"
            style={{ filter: "blur(2px) saturate(1.2)", opacity: isLight ? 0.22 : 0.38 }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: isLight
                ? "linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.88) 30%, rgba(255,255,255,0.94) 60%, rgba(255,255,255,0.88) 100%)"
                : "linear-gradient(180deg, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.88) 30%, rgba(10,10,10,0.94) 60%, rgba(10,10,10,0.85) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: isLight
                ? "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.06), transparent 70%)"
                : "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.10), transparent 70%)",
            }}
          />
        </div>

        {/* Content stacks above bg via z-10 */}
        <div className="relative z-10 grid lg:grid-cols-[minmax(300px,360px)_1fr]">
          {/* ─────────── Profile column ─────────── */}
          <aside
            className={`flex flex-col gap-5 px-6 py-7 lg:border-r border-b lg:border-b-0 ${
              isLight ? "border-gray-200/70" : "border-white/[0.06]"
            }`}
          >
            {/* Photo + name */}
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-1 ring-[#6366f1]/40 shadow-[0_4px_14px_-4px_rgba(99,102,241,0.4)]">
                  <Image src="/headshot-ama.jpg" alt="Dico Angelo" fill sizes="64px" className="object-cover" />
                </div>
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ${
                    isLight ? "ring-white" : "ring-[#0a0a0a]"
                  } bg-emerald-400`}
                >
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
                </span>
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <h2
                  className={`font-bold text-[18px] leading-tight tracking-tight ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  Dico Angelo
                </h2>
                <p
                  className={`text-[12.5px] mt-1 leading-snug ${
                    isLight ? "text-gray-600" : "text-[#a3a3a3]"
                  }`}
                >
                  Founder, Metaventions AI
                </p>
                <p
                  className={`text-[11.5px] mt-0.5 leading-snug ${
                    isLight ? "text-gray-500" : "text-[#737373]"
                  }`}
                >
                  Cloud Alliance Ops · Sovereign AI Infra
                </p>
              </div>
            </div>

            {/* Status badge — gold gradient, the "FOUNDER OPEN TO OPPORTUNITIES" pill */}
            <div className="relative">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#1a1208] shadow-[0_2px_10px_-2px_rgba(215,178,109,0.5)]"
                style={{
                  background: "linear-gradient(135deg, #F9D976 0%, #D7B26D 50%, #B38728 100%)",
                }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 rounded-full bg-emerald-600 animate-ping opacity-75" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-700" />
                </span>
                Founder · Open to opportunities
              </span>
            </div>

            {/* Metrics 2x2 grid */}
            <div className="grid grid-cols-2 gap-3">
              {PROFILE_METRICS.map((m) => (
                <div
                  key={m.label}
                  className={`px-3 py-2.5 rounded-xl border ${
                    isLight
                      ? "bg-white/60 border-gray-200/80"
                      : "bg-white/[0.025] border-white/[0.07]"
                  }`}
                >
                  <div
                    className={`text-[18px] font-bold leading-none tracking-tight ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}
                    style={{ fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', ui-monospace, monospace)" }}
                  >
                    {m.value}
                  </div>
                  <div
                    className={`text-[10px] mt-1.5 leading-tight uppercase tracking-[0.06em] ${
                      isLight ? "text-gray-500" : "text-[#737373]"
                    }`}
                  >
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Career XP meter — replaces redundant pills/links (footer has them) */}
            <div
              className={`relative overflow-hidden p-4 rounded-2xl border ${
                isLight ? "bg-white/60 border-gray-200/80" : "bg-white/[0.025] border-white/[0.07]"
              }`}
            >
              {/* Top hairline */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-4 -top-px h-px"
                style={{ background: "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.7) 50%, transparent 100%)" }}
              />

              {/* Header: level + xp */}
              <div className="flex items-baseline justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[9.5px] font-semibold uppercase tracking-[0.16em] ${isLight ? "text-[#6366f1]/70" : "text-[#818cf8]/80"}`}>
                    Level
                  </span>
                  <span
                    className="text-[15px] font-bold leading-none tabular-nums"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', ui-monospace, monospace)",
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    5/5
                  </span>
                </div>
                <span
                  className="inline-flex items-center gap-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] px-2 py-0.5 rounded-md"
                  style={{
                    background: "linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.08) 100%)",
                    color: isLight ? "#047857" : "#34d399",
                    border: `1px solid ${isLight ? "rgba(16,185,129,0.3)" : "rgba(16,185,129,0.35)"}`,
                  }}
                >
                  <span className="relative flex h-1 w-1">
                    <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-70" />
                    <span className="relative h-1 w-1 rounded-full bg-emerald-500" />
                  </span>
                  Active
                </span>
              </div>

              {/* XP bar */}
              <div className={`relative h-1.5 rounded-full overflow-hidden mb-4 ${isLight ? "bg-gray-200/60" : "bg-white/[0.06]"}`}>
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: "100%",
                    background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
                    boxShadow: "0 0 12px rgba(99,102,241,0.45)",
                  }}
                />
              </div>

              {/* Stage list */}
              <ul className="space-y-2.5">
                {CAREER_STAGES.map((s, i) => {
                  const isActive = s.state === "active";
                  return (
                    <li key={s.label} className="flex items-start gap-2.5">
                      <span className="relative flex shrink-0 items-center justify-center w-3.5 h-3.5 mt-[3px]">
                        {isActive ? (
                          <>
                            <span
                              className="absolute inset-0 rounded-full opacity-50 animate-ping"
                              style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
                            />
                            <span
                              className="relative w-2 h-2 rounded-full"
                              style={{
                                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                                boxShadow: "0 0 8px rgba(99,102,241,0.7)",
                              }}
                            />
                          </>
                        ) : (
                          <span
                            className="relative w-2.5 h-2.5 rounded-full flex items-center justify-center"
                            style={{
                              background: isLight ? "rgba(16,185,129,0.18)" : "rgba(16,185,129,0.22)",
                              border: `1px solid ${isLight ? "rgba(16,185,129,0.4)" : "rgba(16,185,129,0.45)"}`,
                            }}
                          >
                            <svg width="6" height="6" viewBox="0 0 12 12" fill="none" stroke={isLight ? "#047857" : "#34d399"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2.5 6.5l2.5 2.5 4.5-5.5" />
                            </svg>
                          </span>
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-1.5">
                          <span
                            className={`text-[10px] font-semibold tabular-nums ${
                              isActive ? (isLight ? "text-[#6366f1]" : "text-[#818cf8]") : isLight ? "text-gray-400" : "text-[#525252]"
                            }`}
                            style={{ fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', ui-monospace, monospace)" }}
                          >
                            0{i + 1}
                          </span>
                          <span className={`text-[12px] font-semibold leading-tight ${isLight ? "text-gray-900" : "text-white"}`}>
                            {s.label}
                          </span>
                        </div>
                        <div className={`text-[10.5px] leading-snug mt-0.5 ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
                          {s.detail}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* ─────────── Chat column ─────────── */}
          <section className="flex flex-col min-w-0">
            {/* Conversation header bar */}
            <div
              className={`flex items-center justify-between px-5 py-3 border-b ${
                isLight ? "border-gray-200/70" : "border-white/[0.06]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`inline-block w-1.5 h-1.5 rounded-full ${
                    hasMessages ? "bg-[#6366f1]" : "bg-gray-400"
                  }`}
                />
                <p
                  className={`text-[11.5px] font-medium uppercase tracking-[0.14em] ${
                    isLight ? "text-gray-500" : "text-[#737373]"
                  }`}
                >
                  Ask anything · voice or text
                </p>
              </div>
              {hasMessages && (
                <button
                  onClick={handleClearHistory}
                  aria-label="Clear conversation history"
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all ${
                    isLight
                      ? "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                      : "text-[#525252] hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  New chat
                </button>
              )}
            </div>

            {/* Orb stage — focal element, shrinks when messages exist */}
            <div
              className={`relative transition-all duration-500 ease-out ${
                hasMessages ? "px-6 pt-4 pb-2" : "px-6 pt-7 pb-3"
              }`}
              style={{
                background: isLight
                  ? "radial-gradient(ellipse 70% 90% at 50% 0%, rgba(99,102,241,0.05) 0%, transparent 60%)"
                  : "radial-gradient(ellipse 70% 90% at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 60%)",
              }}
            >
              <div
                className={`mx-auto transition-all duration-500 ease-out ${
                  hasMessages ? "max-w-[180px] scale-[0.85] origin-top" : "max-w-[260px] scale-100"
                }`}
              >
                <VoiceOrb conversationHistory={conversationHistory} onAddToHistory={addToHistory} />
              </div>
            </div>

            {/* Message stream — only when messages exist */}
            {hasMessages && (
              <div
                ref={messagesContainerRef}
                className="overflow-y-auto px-5 pt-1 pb-3 space-y-4 scroll-smooth max-h-[380px] md:max-h-[440px]"
                style={{ scrollbarWidth: "thin", scrollbarColor: isLight ? "#e5e7eb transparent" : "#262626 transparent" }}
              >
                {unifiedMessages.map((message, i) => {
                  const isLastAssistant = message.role === "assistant" && i === unifiedMessages.length - 1;
                  const isStreamingNow = isLastAssistant && isTextLoading;
                  const showActions = message.role === "assistant" && message.content.length > 0 && !isStreamingNow;
                  const isUser = message.role === "user";

                  return (
                    <div
                      key={i}
                      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                      style={{ animationDelay: `${Math.min(i, 4) * 30}ms` }}
                    >
                      <div className={`flex flex-col gap-1.5 ${isUser ? "items-end max-w-[85%]" : "items-start max-w-[92%]"}`}>
                        {message.isVoice && (
                          <div className={`flex items-center gap-1.5 px-1 text-[10px] font-medium uppercase tracking-[0.12em] ${isLight ? "text-[#6366f1]/70" : "text-[#818cf8]/80"}`}>
                            <MicGlyph className="w-2.5 h-2.5" />
                            <span>Voice</span>
                          </div>
                        )}

                        <div
                          className={`relative px-4 py-2.5 transition-all duration-200 ${
                            isUser
                              ? "bg-gradient-to-br from-[#6366f1] to-[#5558e3] text-white rounded-[18px] rounded-br-[6px] shadow-[0_4px_14px_-4px_rgba(99,102,241,0.45)]"
                              : isLight
                                ? "bg-white/85 text-gray-800 rounded-[18px] rounded-bl-[6px] border border-gray-200/80 backdrop-blur-sm"
                                : "bg-[#0a0a0a]/70 text-[#ededed] rounded-[18px] rounded-bl-[6px] border border-white/[0.07] backdrop-blur-sm"
                          }`}
                        >
                          <p className={`whitespace-pre-wrap ${isUser ? "text-[14px] leading-[1.5] font-[450]" : "text-[14px] leading-[1.65] font-normal"}`}>
                            {message.content}
                            {isStreamingNow && (
                              <span aria-hidden="true" className="inline-block w-[2px] h-[1em] ml-0.5 align-[-2px] bg-current opacity-70 animate-pulse" />
                            )}
                          </p>

                          {isStreamingNow && message.content.length === 0 && (
                            <div className="flex items-center gap-2 py-0.5">
                              <span className={`block h-[1px] w-16 rounded-full overflow-hidden ${isLight ? "bg-gray-200" : "bg-white/10"}`}>
                                <span className="block h-full w-1/2 bg-gradient-to-r from-transparent via-[#6366f1] to-transparent" style={{ animation: "shimmer 1.2s linear infinite" }} />
                              </span>
                              <span className={`text-[11px] ${isLight ? "text-gray-400" : "text-[#525252]"}`}>thinking</span>
                            </div>
                          )}
                        </div>

                        {showActions && (
                          <div className={`flex gap-3 px-1 text-[10.5px] font-medium ${isLight ? "text-gray-400" : "text-[#525252]"}`}>
                            <button type="button" onClick={() => handleCopy(message.content, i)} className="hover:text-[#6366f1] transition-colors">
                              {copiedIndex === i ? "Copied" : "Copy"}
                            </button>
                            {isLastAssistant && (
                              <button type="button" onClick={handleRegenerate} disabled={isTextLoading} className="hover:text-[#6366f1] transition-colors disabled:opacity-40">
                                Regenerate
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isTextLoading && unifiedMessages[unifiedMessages.length - 1]?.role === "user" && (
                  <div className="flex justify-start animate-in fade-in duration-200">
                    <div className={`px-4 py-3 rounded-[18px] rounded-bl-[6px] flex items-center gap-2 backdrop-blur-sm ${isLight ? "bg-white/85 border border-gray-200/80" : "bg-[#0a0a0a]/70 border border-white/[0.07]"}`}>
                      <span className={`block h-[1px] w-12 rounded-full overflow-hidden ${isLight ? "bg-gray-200" : "bg-white/10"}`}>
                        <span className="block h-full w-1/2 bg-gradient-to-r from-transparent via-[#6366f1] to-transparent" style={{ animation: "shimmer 1.2s linear infinite" }} />
                      </span>
                      <span className={`text-[11px] ${isLight ? "text-gray-400" : "text-[#525252]"}`}>thinking</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Starter prompts rail */}
            {showInlineStarters && (
              <div
                className={`px-5 pt-2 pb-2 flex gap-2 overflow-x-auto ${hasMessages ? "border-t" : ""} ${isLight ? "border-gray-200/70" : "border-white/[0.06]"}`}
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendTextMessage(q)}
                    className={`shrink-0 px-3 py-1.5 text-[12px] rounded-full whitespace-nowrap transition-all duration-200 hover:translate-y-[-1px] active:translate-y-0 backdrop-blur-sm ${
                      isLight
                        ? "bg-white/75 border border-gray-200/80 hover:border-[#6366f1]/40 hover:bg-white hover:text-[#6366f1] text-gray-700"
                        : "bg-white/[0.04] border border-white/[0.08] hover:border-[#6366f1]/40 hover:bg-white/[0.07] hover:text-white text-[#a3a3a3]"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Composer */}
            <form
              onSubmit={handleSubmit}
              className={`px-4 pt-2 pb-3.5 ${!showInlineStarters && hasMessages ? `border-t ${isLight ? "border-gray-200/70" : "border-white/[0.06]"}` : ""}`}
            >
              <label htmlFor="chat-input" className="sr-only">
                Ask a question about Dico&apos;s background and experience
              </label>

              <div
                className={`group flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-2xl transition-all duration-200 focus-within:ring-2 focus-within:ring-[#6366f1]/35 focus-within:border-[#6366f1]/40 backdrop-blur-sm ${
                  isLight ? "bg-white/75 border border-gray-200/80" : "bg-white/[0.04] border border-white/[0.08]"
                }`}
              >
                <input
                  id="chat-input"
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={handleInputFocus}
                  placeholder={hasMessages ? "Continue the conversation..." : "Ask anything, or tap the orb"}
                  aria-label="Ask a question"
                  className={`flex-1 bg-transparent text-[14px] outline-none ${isLight ? "text-gray-900 placeholder-gray-400" : "text-white placeholder-[#525252]"}`}
                  disabled={isTextLoading}
                />

                {!input && (
                  <kbd
                    aria-hidden="true"
                    className={`hidden sm:inline-flex items-center justify-center w-5 h-5 text-[10px] font-mono font-medium rounded border transition-opacity group-focus-within:opacity-0 ${
                      isLight ? "bg-white border-gray-200 text-gray-400" : "bg-white/[0.05] border-white/10 text-[#737373]"
                    }`}
                  >
                    /
                  </kbd>
                )}

                {hasMessages && (
                  <button
                    type="button"
                    onClick={() => setShowStarters((s) => !s)}
                    aria-label="Toggle starter prompts"
                    className={`hidden sm:flex shrink-0 items-center justify-center w-8 h-8 rounded-xl transition-all ${
                      showStarters
                        ? isLight
                          ? "text-[#6366f1] bg-[#6366f1]/10"
                          : "text-[#818cf8] bg-[#6366f1]/15"
                        : isLight
                          ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                          : "text-[#525252] hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isTextLoading || !input.trim()}
                  aria-label="Send message"
                  className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 active:scale-95 ${
                    input.trim() && !isTextLoading
                      ? "bg-gradient-to-br from-[#6366f1] to-[#5558e3] text-white shadow-[0_4px_14px_-4px_rgba(99,102,241,0.5)] hover:shadow-[0_6px_18px_-4px_rgba(99,102,241,0.6)]"
                      : isLight
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white/[0.06] text-[#525252] cursor-not-allowed"
                  }`}
                >
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>

              {!hasMessages && (
                <p className={`text-center text-[10.5px] mt-2.5 tracking-[-0.005em] ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
                  Voice replies use Dico&apos;s actual cloned voice. Press{" "}
                  <kbd className={`px-1 py-0.5 font-mono text-[10px] rounded border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.05] border-white/10"}`}>/</kbd>{" "}
                  to focus.
                </p>
              )}
            </form>
          </section>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
