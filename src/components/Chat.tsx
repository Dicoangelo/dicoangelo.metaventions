"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import VoiceOrb from "./VoiceOrb";

interface Message {
  role: "user" | "assistant";
  content: string;
  source?: "voice" | "text";
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

    const userMessage: Message = { role: "user", content: text, source: "text" };
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
    const userMessage: Message = { role: "user", content: text, source: "voice" };
    setMessages(prev => [...prev, userMessage]);
  };

  // Handle voice response
  const handleVoiceResponse = (text: string) => {
    const assistantMessage: Message = { role: "assistant", content: text };
    setMessages(prev => {
      const lastMsg = prev[prev.length - 1];
      if (lastMsg?.role === "assistant" && !lastMsg.content) {
        return [...prev.slice(0, -1), assistantMessage];
      }
      return [...prev, assistantMessage];
    });
  };

  const isLight = theme === "light";

  return (
    <div className="card max-w-5xl mx-auto overflow-hidden">
      {/* Header */}
      <div className={`p-4 border-b ${isLight ? 'border-gray-200 bg-gradient-to-r from-indigo-50 to-transparent' : 'border-[#262626] bg-gradient-to-r from-[#6366f1]/10 to-transparent'}`}>
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image src="/headshot.png" alt="Dico Angelo" fill className="object-cover" />
          </div>
          <div>
            <h3 className="font-bold">Ask Me Anything</h3>
            <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-[#737373]'}`}>
              Voice or text — your choice
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-side layout */}
      <div className="flex flex-col lg:flex-row">
        {/* Voice Panel - Left */}
        <div className={`lg:w-1/2 p-4 flex flex-col items-center justify-center min-h-[400px] ${
          isLight ? 'bg-gradient-to-b from-white to-gray-50' : 'bg-gradient-to-b from-[#0a0a0a] to-[#111]'
        } lg:border-r ${isLight ? 'lg:border-gray-200' : 'lg:border-[#262626]'}`}>
          <VoiceOrb
            onTranscript={handleVoiceTranscript}
            onResponse={handleVoiceResponse}
            isProcessing={isLoading}
          />
        </div>

        {/* Text Chat Panel - Right */}
        <div className={`lg:w-1/2 flex flex-col border-t lg:border-t-0 ${isLight ? 'border-gray-200' : 'border-[#262626]'}`}>
          {/* Messages */}
          <div ref={messagesContainerRef} className="flex-1 h-[320px] overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-6">
                <p className={`mb-4 text-sm ${isLight ? 'text-gray-500' : 'text-[#737373]'}`}>
                  Type a question or use voice
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
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
                    className={`max-w-[85%] px-3 py-2 rounded-2xl ${
                      message.role === "user"
                        ? "bg-[#6366f1] text-white"
                        : isLight
                          ? "bg-gray-100 text-gray-800"
                          : "bg-[#1f1f1f] text-[#ededed]"
                    }`}
                  >
                    {message.source === "voice" && message.role === "user" && (
                      <span className="text-[10px] opacity-60 flex items-center gap-1 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                        </svg>
                        voice
                      </span>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className={`px-3 py-2 rounded-2xl ${isLight ? 'bg-gray-100' : 'bg-[#1f1f1f]'}`}>
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
          <form onSubmit={handleSubmit} className={`p-3 border-t ${isLight ? 'border-gray-200' : 'border-[#262626]'}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className={`flex-1 px-3 py-2 rounded-lg focus:outline-none focus:border-[#6366f1] text-sm ${
                  isLight
                    ? 'bg-gray-100 border border-gray-200 text-gray-800 placeholder-gray-400'
                    : 'bg-[#1f1f1f] border border-[#262626] text-white'
                }`}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-[#6366f1] hover:bg-[#5558e3] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors text-white text-sm"
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
