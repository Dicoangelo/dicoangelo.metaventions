"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import { useVoice } from "@/hooks/useVoice";

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
  const [autoSpeak, setAutoSpeak] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const voice = useVoice();

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string, speakResponse = autoSpeak) => {
    if (!text.trim() || isLoading) return;

    // Stop any ongoing speech
    voice.stopSpeaking();

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

      // Speak the response if autoSpeak is enabled
      if (speakResponse && assistantContent) {
        voice.speak(assistantContent);
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

  // Voice input handling
  const handleVoiceToggle = async () => {
    if (voice.state.isListening) {
      // Stop listening and send the transcript
      const transcript = voice.stopListening();
      if (transcript.trim()) {
        sendMessage(transcript, true); // Always speak response for voice input
      }
    } else {
      // Start listening
      await voice.startListening((text, isFinal) => {
        setInput(text);
      });
    }
  };

  const isLight = theme === "light";

  return (
    <div className="card max-w-2xl mx-auto overflow-hidden">
      {/* Header */}
      <div className={`p-4 border-b ${isLight ? 'border-gray-200 bg-gradient-to-r from-indigo-50 to-transparent' : 'border-[#262626] bg-gradient-to-r from-[#6366f1]/10 to-transparent'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image src="/headshot.png" alt="Dico Angelo" fill className="object-cover" />
            </div>
            <div>
              <h3 className="font-bold">Ask Me Anything</h3>
              <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-[#737373]'}`}>
                The AI-powered D-icosystem · {voice.state.supported ? "Voice enabled" : "Text only"}
              </p>
            </div>
          </div>

          {/* Voice status indicator */}
          {voice.state.isSpeaking && (
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                <span className="w-1 h-3 bg-[#6366f1] rounded-full animate-pulse"></span>
                <span className="w-1 h-4 bg-[#6366f1] rounded-full animate-pulse" style={{ animationDelay: "75ms" }}></span>
                <span className="w-1 h-2 bg-[#6366f1] rounded-full animate-pulse" style={{ animationDelay: "150ms" }}></span>
                <span className="w-1 h-5 bg-[#6366f1] rounded-full animate-pulse" style={{ animationDelay: "225ms" }}></span>
                <span className="w-1 h-3 bg-[#6366f1] rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></span>
              </div>
              <button
                onClick={() => voice.stopSpeaking()}
                className={`p-1.5 rounded-lg transition-colors ${isLight ? 'hover:bg-gray-200' : 'hover:bg-[#2a2a2a]'}`}
                title="Stop speaking"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className={`mb-4 ${isLight ? 'text-gray-500' : 'text-[#737373]'}`}>
              {voice.state.supported
                ? "Ask anything — type or tap the mic to speak."
                : "Ask anything about my background, projects, or experience."}
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
                {/* Play button for assistant messages */}
                {message.role === "assistant" && message.content && !isLoading && (
                  <button
                    onClick={() => voice.speak(message.content)}
                    disabled={voice.state.isSpeaking}
                    className={`mt-2 flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity ${
                      voice.state.isSpeaking ? 'cursor-not-allowed' : ''
                    }`}
                    title="Play response"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                    Listen
                  </button>
                )}
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

      {/* Voice listening indicator */}
      {voice.state.isListening && (
        <div className={`px-4 py-3 border-t ${isLight ? 'border-gray-200 bg-red-50' : 'border-[#262626] bg-red-950/30'}`}>
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></span>
              <span className="relative block w-3 h-3 rounded-full bg-red-500"></span>
            </div>
            <span className={`text-sm ${isLight ? 'text-red-700' : 'text-red-400'}`}>
              Listening... {voice.state.transcript ? `"${voice.state.transcript}"` : "speak now"}
            </span>
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className={`p-4 border-t ${isLight ? 'border-gray-200' : 'border-[#262626]'}`}>
        <div className="flex gap-2">
          {/* Voice button */}
          {voice.state.supported && (
            <button
              type="button"
              onClick={handleVoiceToggle}
              disabled={isLoading || voice.state.isSpeaking}
              className={`p-2 rounded-lg transition-all ${
                voice.state.isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : isLight
                    ? 'bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700'
                    : 'bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#262626]'
              } ${(isLoading || voice.state.isSpeaking) ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={voice.state.isListening ? "Stop & send" : "Speak"}
            >
              {voice.state.isListening ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              )}
            </button>
          )}

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={voice.state.isListening ? "Listening..." : "Ask about projects, experience, skills..."}
            className={`flex-1 px-4 py-2 rounded-lg focus:outline-none focus:border-[#6366f1] text-sm ${
              isLight
                ? 'bg-gray-100 border border-gray-200 text-gray-800 placeholder-gray-400'
                : 'bg-[#1f1f1f] border border-[#262626] text-white'
            }`}
            disabled={isLoading || voice.state.isListening}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || voice.state.isListening}
            className="px-4 py-2 bg-[#6366f1] hover:bg-[#5558e3] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors text-white"
          >
            Send
          </button>
        </div>

        {/* Auto-speak toggle */}
        <div className="mt-3 flex items-center justify-end gap-2">
          <label className={`text-xs ${isLight ? 'text-gray-500' : 'text-[#737373]'}`}>
            Auto-speak responses
          </label>
          <button
            type="button"
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              autoSpeak ? 'bg-[#6366f1]' : isLight ? 'bg-gray-300' : 'bg-[#3f3f3f]'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                autoSpeak ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </form>
    </div>
  );
}
