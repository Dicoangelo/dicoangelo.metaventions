"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import VoiceOrb from "./VoiceOrb";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "What's the $800M+ TCV story?",
  "Tell me about Metaventions AI",
  "What multi-agent systems has he built?",
  "What's the Universal Cognitive Wallet?",
  "How did he drive $30M in cloud alliance revenue?",
  "What partnerships did he run at Contentsquare?",
  "Is he open to US relocation? What about visas?",
  "What does it mean that he directs AI agents to write code?",
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

export default function Chat() {
  // SHARED conversation history (used by both voice and text behind the scenes)
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);

  // Text-only UI state (separate display)
  const [textMessages, setTextMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTextLoading, setIsTextLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  // Hydrate text history + shared history from sessionStorage on first mount
  // so a refresh doesn't nuke the visitor's conversation.
  useEffect(() => {
    const stored = loadHistory();
    if (stored.length > 0) {
      setTextMessages(stored);
      setConversationHistory(stored);
    }
  }, []);

  // Persist on every text-message change
  useEffect(() => {
    if (textMessages.length > 0) saveHistory(textMessages);
  }, [textMessages]);

  // Prevent page scroll when input is focused (browser tries to scroll it into view)
  const handleInputFocus = () => {
    // Save current scroll position and restore it to prevent page jump
    const scrollY = window.scrollY;
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollY, behavior: "instant" });
    });
  };

  // Smooth scroll to bottom (within container only, not the whole page)
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
  }, [textMessages]);

  // Text-only send message (adds to both text UI and shared history)
  const sendTextMessage = async (text: string) => {
    if (!text.trim() || isTextLoading) return;

    const userMessage: Message = { role: "user", content: text };

    // Add to text UI
    const newTextMessages = [...textMessages, userMessage];
    setTextMessages(newTextMessages);

    // Add to shared history
    const newHistory = [...conversationHistory, userMessage];
    setConversationHistory(newHistory);

    setInput("");
    setIsTextLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }), // Use shared history for context
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

      // Add assistant response to shared history
      setConversationHistory([...newHistory, { role: "assistant", content: assistantContent }]);

    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = { role: "assistant", content: "Sorry, I encountered an error. Please try again." };
      setTextMessages([...newTextMessages, errorMsg]);
    } finally {
      setIsTextLoading(false);
    }
  };

  // Voice adds to shared history (called from VoiceOrb)
  const addToHistory = (message: Message) => {
    setConversationHistory(prev => [...prev, message]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendTextMessage(input);
  };

  const handleRegenerate = () => {
    if (textMessages.length === 0 || isTextLoading) return;
    // Find the last user turn and re-fire it. Trim everything after that
    // user turn so the regen replaces the bad assistant reply.
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
      // clipboard can be blocked — silently degrade
    }
  };

  const handleClearHistory = () => {
    setTextMessages([]);
    setConversationHistory([]);
    if (typeof window !== "undefined") sessionStorage.removeItem(STORAGE_KEY);
  };

  const isLight = theme === "light";

  return (
    <div className="card max-w-5xl mx-auto overflow-hidden">
      {/* Header */}
      <div className={`p-4 border-b transition-colors duration-300 ${
        isLight
          ? 'border-gray-200 bg-gradient-to-r from-indigo-50 to-transparent'
          : 'border-[#262626] bg-gradient-to-r from-[#6366f1]/10 to-transparent'
      }`}>
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#6366f1]/20">
            <Image src="/headshot-ama.jpg" alt="Dico Angelo" fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold">Ask Me Anything</h3>
            <p className={`text-sm transition-colors ${isLight ? 'text-gray-500' : 'text-[#737373]'}`}>
              Voice or text. Context is shared across both.
            </p>
          </div>
          {textMessages.length > 0 && (
            <button
              onClick={handleClearHistory}
              aria-label="Clear conversation history"
              className={`text-xs px-2.5 py-1.5 rounded-md transition-colors ${
                isLight
                  ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  : 'text-[#737373] hover:text-white hover:bg-[#1f1f1f]'
              }`}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Side-by-side layout */}
      <div className="flex flex-col lg:flex-row min-h-[450px]">
        {/* Voice Panel - Left (has live transcription, shares context) */}
        <div className={`lg:w-1/2 p-6 flex flex-col items-center justify-center relative transition-colors duration-300 ${
          isLight
            ? 'bg-gradient-to-b from-white via-gray-50/50 to-gray-100/30'
            : 'bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#111]'
        } lg:border-r ${isLight ? 'lg:border-gray-200' : 'lg:border-[#262626]'}`}>
          <VoiceOrb
            conversationHistory={conversationHistory}
            onAddToHistory={addToHistory}
          />
        </div>

        {/* Text Chat Panel - Right (has scrolling messages, shares context) */}
        <div className={`lg:w-1/2 flex flex-col border-t lg:border-t-0 transition-colors duration-300 ${
          isLight ? 'border-gray-200 bg-white' : 'border-[#262626] bg-[#0a0a0a]'
        }`}>
          {/* Fixed height messages container with scroll */}
          <div
            ref={messagesContainerRef}
            className="h-[280px] md:h-[350px] overflow-y-auto p-4 space-y-3 scroll-smooth"
            style={{ scrollbarWidth: 'thin', scrollbarColor: isLight ? '#d1d5db #f3f4f6' : '#404040 #1f1f1f' }}
          >
            {textMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center px-3">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
                  isLight ? 'bg-gradient-to-br from-blue-100 to-purple-100' : 'bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20'
                }`}>
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#6366f1]">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <h4 className={`mb-2 text-base font-semibold ${isLight ? 'text-gray-800' : 'text-white'}`}>
                  Ask About Anything
                </h4>
                <p className={`mb-5 text-sm text-center max-w-[320px] ${isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}`}>
                  Real-time semantic search over Dico's portfolio, partnerships, and projects. Start with a suggestion or ask your own.
                </p>
                <div className="w-full max-w-[340px]">
                  <p className={`text-xs font-semibold mb-3 text-center ${isLight ? 'text-gray-500' : 'text-[#737373]'}`}>
                    💡 Suggested Questions
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendTextMessage(q)}
                        className={`px-3 py-2 text-xs rounded-lg transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] hover:shadow-md ${
                          isLight
                            ? 'bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-gray-700'
                            : 'bg-[#1f1f1f] hover:bg-[#6366f1]/20 border border-[#262626] hover:border-[#6366f1]/50 text-gray-300'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {textMessages.map((message, i) => {
                  const isLastAssistant =
                    message.role === "assistant" && i === textMessages.length - 1;
                  const isStreamingNow = isLastAssistant && isTextLoading;
                  const showActions =
                    message.role === "assistant" && message.content.length > 0 && !isStreamingNow;
                  return (
                    <div
                      key={i}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                      style={{ animationDelay: `${Math.min(i, 5) * 50}ms` }}
                    >
                      <div className="max-w-[85%] flex flex-col gap-1.5">
                        <div
                          className={`px-4 py-2.5 rounded-2xl transition-all duration-200 ${
                            message.role === "user"
                              ? "bg-[#6366f1] text-white rounded-br-md"
                              : isLight
                                ? "bg-gray-100 text-gray-800 rounded-bl-md"
                                : "bg-[#1f1f1f] text-[#ededed] rounded-bl-md"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">
                            {message.content}
                            {isStreamingNow && (
                              <span
                                aria-hidden="true"
                                className="inline-block w-[2px] h-[1em] ml-0.5 align-[-2px] bg-current animate-pulse"
                              />
                            )}
                          </p>
                        </div>
                        {showActions && (
                          <div className={`flex gap-3 px-1 text-[11px] ${isLight ? 'text-gray-500' : 'text-[#737373]'}`}>
                            <button
                              type="button"
                              onClick={() => handleCopy(message.content, i)}
                              className="hover:text-[#6366f1] transition-colors"
                            >
                              {copiedIndex === i ? "Copied" : "Copy"}
                            </button>
                            {isLastAssistant && (
                              <button
                                type="button"
                                onClick={handleRegenerate}
                                disabled={isTextLoading}
                                className="hover:text-[#6366f1] transition-colors disabled:opacity-50"
                              >
                                Regenerate
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {isTextLoading && textMessages[textMessages.length - 1]?.role === "user" && (
                  <div className="flex justify-start animate-in fade-in duration-200">
                    <div className={`px-4 py-3 rounded-2xl rounded-bl-md ${isLight ? 'bg-gray-100' : 'bg-[#1f1f1f]'}`}>
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-[#6366f1] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-[#6366f1] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-[#6366f1] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input - fixed at bottom */}
          <form
            onSubmit={handleSubmit}
            className={`p-3 border-t transition-colors duration-300 ${isLight ? 'border-gray-200 bg-gray-50/50' : 'border-[#262626] bg-[#0d0d0d]'}`}
          >
            <label htmlFor="chat-input" className="sr-only">
              Ask a question about my background and experience
            </label>
            <div className="flex gap-2">
              <input
                id="chat-input"
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={handleInputFocus}
                placeholder="Type your question..."
                aria-label="Ask a question"
                aria-describedby="chat-help"
                className={`flex-1 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 text-sm transition-all duration-200 ${
                  isLight
                    ? 'bg-white border border-gray-200 text-gray-800 placeholder-gray-400'
                    : 'bg-[#1f1f1f] border border-[#262626] text-white placeholder-gray-500'
                }`}
                disabled={isTextLoading}
              />
              <button
                type="submit"
                disabled={isTextLoading || !input.trim()}
                className="btn-primary min-h-[44px] min-w-[44px]"
              >
                Send
              </button>
            </div>
            <p
              id="chat-help"
              className={`mt-2 text-[10px] text-center ${isLight ? 'text-gray-400' : 'text-[#525252]'}`}
            >
              Powered by DeepSeek V4 with semantic retrieval over Dico's portfolio. May make mistakes.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
