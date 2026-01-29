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
  "What projects has Dico built?",
  "Tell me about his enterprise experience",
  "What makes him unique?",
  "Is he open to relocation?",
];

export default function Chat() {
  // SHARED conversation history (used by both voice and text behind the scenes)
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);

  // Text-only UI state (separate display)
  const [textMessages, setTextMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTextLoading, setIsTextLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Smooth scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
            <Image src="/headshot.png" alt="Dico Angelo" fill className="object-cover" />
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
            className="h-[350px] overflow-y-auto p-4 space-y-3 scroll-smooth"
            style={{ scrollbarWidth: 'thin', scrollbarColor: isLight ? '#d1d5db #f3f4f6' : '#404040 #1f1f1f' }}
          >
            {textMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                  isLight ? 'bg-gray-100' : 'bg-[#1f1f1f]'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={isLight ? 'text-gray-400' : 'text-gray-600'}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <p className={`mb-4 text-sm text-center ${isLight ? 'text-gray-500' : 'text-[#737373]'}`}>
                  Type a question below
                </p>
                <div className="flex flex-wrap gap-2 justify-center max-w-[280px]">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendTextMessage(q)}
                      className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                        isLight
                          ? 'bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700'
                          : 'bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#262626] text-gray-300'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
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
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input - fixed at bottom */}
          <form
            onSubmit={handleSubmit}
            className={`p-3 border-t transition-colors duration-300 ${isLight ? 'border-gray-200 bg-gray-50/50' : 'border-[#262626] bg-[#0d0d0d]'}`}
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
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
                className="px-5 py-2.5 bg-[#6366f1] hover:bg-[#5558e3] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium transition-all duration-200 text-white text-sm hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
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
