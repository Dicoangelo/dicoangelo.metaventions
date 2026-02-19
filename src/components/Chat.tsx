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
  "What did the UCW figure out about him?",
  "What multi-agent systems has he built?",
  "What's his cognitive fingerprint?",
  "Is he open to relocation to the US?",
  "What are his 72 coherence moments?",
  "Show me metrics from his Contentsquare role",
  "Why does he work at 3 AM?",
];

export default function Chat() {
  // SHARED conversation history (used by both voice and text behind the scenes)
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);

  // Text-only UI state (separate display)
  const [textMessages, setTextMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTextLoading, setIsTextLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

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
          <div>
            <h3 className="font-bold">Ask Me Anything</h3>
            <p className={`text-sm transition-colors ${isLight ? 'text-gray-500' : 'text-[#737373]'}`}>
              Voice or text — context is shared
            </p>
          </div>
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
                  700+ career dossier chunks indexed with semantic search. Start with a suggestion or ask your own question.
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
                {textMessages.map((message, i) => (
                  <div
                    key={i}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    style={{ animationDelay: `${Math.min(i, 5) * 50}ms` }}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl transition-all duration-200 ${
                        message.role === "user"
                          ? "bg-[#6366f1] text-white rounded-br-md"
                          : isLight
                            ? "bg-gray-100 text-gray-800 rounded-bl-md"
                            : "bg-[#1f1f1f] text-[#ededed] rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
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
          </form>
        </div>
      </div>
    </div>
  );
}
