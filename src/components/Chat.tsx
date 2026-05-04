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

  // Diff conversationHistory against textMessages — anything in history but not in
  // textMessages came from voice. Lets us tag voice-originated messages without
  // changing VoiceOrb's API.
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
    <div className="relative max-w-2xl mx-auto">
      {/* Ambient halo behind the card — gives the surface presence */}
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
            ? "bg-white/85 border-gray-200/80 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18),0_8px_24px_-8px_rgba(15,23,42,0.08)]"
            : "bg-[#0a0a0a]/85 border-white/[0.07] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7),0_8px_24px_-8px_rgba(0,0,0,0.4)]"
        }`}
      >
        {/* Identity header */}
        <div className={`relative px-5 py-3.5 flex items-center gap-3 border-b ${isLight ? "border-gray-100" : "border-white/[0.05]"}`}>
          <div className="relative">
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#6366f1]/40">
              <Image src="/headshot-ama.jpg" alt="Dico Angelo" fill sizes="32px" className="object-cover" />
            </div>
            <span
              aria-hidden="true"
              className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ${isLight ? "ring-white" : "ring-[#0a0a0a]"} bg-emerald-400`}
            >
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-[14.5px] leading-tight tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
              Dico Angelo
            </h3>
            <p className={`text-[11.5px] mt-0.5 tracking-[-0.005em] ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
              Voice-cloned AI · ask in voice or text
            </p>
          </div>

          {hasMessages && (
            <button
              onClick={handleClearHistory}
              aria-label="Clear conversation history"
              className={`text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-all ${
                isLight
                  ? "text-gray-400 hover:text-gray-700 hover:bg-gray-50 active:scale-[0.97]"
                  : "text-[#525252] hover:text-white hover:bg-white/[0.05] active:scale-[0.97]"
              }`}
            >
              New chat
            </button>
          )}
        </div>

        {/* Orb stage — focal element, shrinks when messages exist */}
        <div
          className={`relative transition-all duration-500 ease-out ${hasMessages ? "px-6 pt-5 pb-2" : "px-6 pt-9 pb-3"}`}
          style={{
            background: isLight
              ? "radial-gradient(ellipse 70% 90% at 50% 0%, rgba(99,102,241,0.07) 0%, rgba(99,102,241,0.02) 40%, transparent 70%)"
              : "radial-gradient(ellipse 70% 90% at 50% 0%, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.02) 40%, transparent 70%)",
          }}
        >
          <div className={`mx-auto transition-all duration-500 ease-out ${hasMessages ? "max-w-[200px] scale-[0.85] origin-top" : "max-w-[280px] scale-100"}`}>
            <VoiceOrb conversationHistory={conversationHistory} onAddToHistory={addToHistory} />
          </div>
        </div>

        {/* Message stream — only when messages exist */}
        {hasMessages && (
          <div
            ref={messagesContainerRef}
            className="overflow-y-auto px-5 pt-1 pb-3 space-y-4 scroll-smooth max-h-[420px] md:max-h-[480px]"
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
                            ? "bg-gray-50/80 text-gray-800 rounded-[18px] rounded-bl-[6px] border border-gray-100"
                            : "bg-white/[0.035] text-[#ededed] rounded-[18px] rounded-bl-[6px] border border-white/[0.06]"
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
                <div className={`px-4 py-3 rounded-[18px] rounded-bl-[6px] flex items-center gap-2 ${isLight ? "bg-gray-50/80 border border-gray-100" : "bg-white/[0.035] border border-white/[0.06]"}`}>
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
            className={`px-5 pt-2 pb-2 flex gap-2 overflow-x-auto ${hasMessages ? "border-t" : ""} ${isLight ? "border-gray-100" : "border-white/[0.05]"}`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendTextMessage(q)}
                className={`shrink-0 px-3 py-1.5 text-[12px] rounded-full whitespace-nowrap transition-all duration-200 hover:translate-y-[-1px] active:translate-y-0 ${
                  isLight
                    ? "bg-gray-50/80 border border-gray-200/80 hover:border-[#6366f1]/40 hover:bg-white hover:text-[#6366f1] text-gray-600"
                    : "bg-white/[0.03] border border-white/[0.07] hover:border-[#6366f1]/40 hover:bg-white/[0.06] hover:text-white text-[#a3a3a3]"
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
          className={`px-4 pt-2 pb-3.5 ${!showInlineStarters && hasMessages ? `border-t ${isLight ? "border-gray-100" : "border-white/[0.05]"}` : ""}`}
        >
          <label htmlFor="chat-input" className="sr-only">
            Ask a question about Dico's background and experience
          </label>

          <div
            className={`group flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-2xl transition-all duration-200 focus-within:ring-2 focus-within:ring-[#6366f1]/35 focus-within:border-[#6366f1]/40 ${
              isLight ? "bg-gray-50/70 border border-gray-200" : "bg-white/[0.035] border border-white/[0.08]"
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
                  isLight ? "bg-white border-gray-200 text-gray-400" : "bg-white/[0.04] border-white/10 text-[#737373]"
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
            <p className={`text-center text-[10.5px] mt-2.5 tracking-[-0.005em] ${isLight ? "text-gray-400" : "text-[#525252]"}`}>
              Voice replies use Dico&apos;s actual cloned voice. Press{" "}
              <kbd className={`px-1 py-0.5 font-mono text-[10px] rounded border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.04] border-white/10"}`}>/</kbd>{" "}
              to focus.
            </p>
          )}
        </form>
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
