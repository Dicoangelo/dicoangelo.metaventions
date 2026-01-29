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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"text" | "voice">("voice"); // Default to voice mode
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages([...newMessages, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        assistantContent += decoder.decode(value, { stream: true });
        setMessages([...newMessages, { role: "assistant", content: assistantContent }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Handle voice transcript
  const handleVoiceTranscript = (text: string) => {
    const userMessage: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMessage]);
  };

  // Handle voice response
  const handleVoiceResponse = (text: string) => {
    const assistantMessage: Message = { role: "assistant", content: text };
    setMessages(prev => {
      // Replace the last message if it was empty or add new one
      const lastMsg = prev[prev.length - 1];
      if (lastMsg?.role === "assistant" && !lastMsg.content) {
        return [...prev.slice(0, -1), assistantMessage];
      }
      return [...prev, assistantMessage];
    });
  };

  const isLight = theme === "light";

  return (
    <div className="card max-w-2xl mx-auto overflow-hidden">
      {/* Header with mode toggle */}
      <div className={`p-4 border-b ${isLight ? 'border-gray-200 bg-gradient-to-r from-indigo-50 to-transparent' : 'border-[#262626] bg-gradient-to-r from-[#6366f1]/10 to-transparent'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image src="/headshot.png" alt="Dico Angelo" fill className="object-cover" />
            </div>
            <div>
              <h3 className="font-bold">Ask Me Anything</h3>
              <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-[#737373]'}`}>
                The AI-powered D-icosystem
              </p>
            </div>
          </div>

          {/* Mode toggle */}
          <div className={`flex rounded-lg p-1 ${isLight ? 'bg-gray-100' : 'bg-[#1a1a1a]'}`}>
            <button
              onClick={() => setMode("voice")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                mode === "voice"
                  ? "bg-[#6366f1] text-white shadow-sm"
                  : isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                </svg>
                Voice
              </span>
            </button>
            <button
              onClick={() => setMode("text")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                mode === "text"
                  ? "bg-[#6366f1] text-white shadow-sm"
                  : isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Text
              </span>
            </button>
          </div>
        </div>
      </div>

      {mode === "voice" ? (
        /* Voice Mode - Orb Interface */
        <div className={`py-8 px-4 min-h-[420px] flex flex-col items-center justify-center ${
          isLight ? 'bg-gradient-to-b from-white to-gray-50' : 'bg-gradient-to-b from-[#0a0a0a] to-[#111]'
        }`}>
          <VoiceOrb
            onTranscript={handleVoiceTranscript}
            onResponse={handleVoiceResponse}
            isProcessing={isLoading}
          />
        </div>
      ) : (
        /* Text Mode - Chat Interface */
        <>
          {/* Messages */}
          <div ref={messagesContainerRef} className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <p className={`mb-4 ${isLight ? 'text-gray-500' : 'text-[#737373]'}`}>
                  Ask anything about my background, projects, or experience.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        isLight
                          ? 'bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700'
                          : 'bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#262626]'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      message.role === "user"
                        ? "bg-[#6366f1] text-white"
                        : isLight
                          ? "bg-gray-100 text-gray-800"
                          : "bg-[#1f1f1f] text-[#ededed]"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className={`px-4 py-2 rounded-2xl ${isLight ? 'bg-gray-100' : 'bg-[#1f1f1f]'}`}>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#6366f1] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-[#6366f1] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-[#6366f1] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className={`p-4 border-t ${isLight ? 'border-gray-200' : 'border-[#262626]'}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, experience, skills..."
                className={`flex-1 px-4 py-2 rounded-lg focus:outline-none focus:border-[#6366f1] text-sm ${
                  isLight
                    ? 'bg-gray-100 border border-gray-200 text-gray-800 placeholder-gray-400'
                    : 'bg-[#1f1f1f] border border-[#262626] text-white'
                }`}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-[#6366f1] hover:bg-[#5558e3] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors text-white"
              >
                Send
              </button>
            </div>
          </form>
        </>
      )}

      {/* Conversation history (shown in both modes) */}
      {mode === "voice" && messages.length > 0 && (
        <div className={`border-t ${isLight ? 'border-gray-200' : 'border-[#262626]'}`}>
          <button
            onClick={() => setMode("text")}
            className={`w-full p-3 text-xs flex items-center justify-center gap-2 ${
              isLight ? 'text-gray-500 hover:bg-gray-50' : 'text-gray-500 hover:bg-[#1a1a1a]'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            View {messages.length} messages in chat
          </button>
        </div>
      )}
    </div>
  );
}
