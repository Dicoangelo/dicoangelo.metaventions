"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";

interface VoiceOrbProps {
  onTranscript: (text: string) => void;
  onResponse: (text: string) => void;
  isProcessing: boolean;
}

// Web Speech API types
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: { transcript: string; confidence: number };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((ev: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

function getSpeechRecognition(): (new () => SpeechRecognition) | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
}

export default function VoiceOrb({ onTranscript, onResponse, isProcessing }: VoiceOrbProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [supported, setSupported] = useState(false);
  const [frequencies, setFrequencies] = useState<number[]>(new Array(32).fill(0));

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check browser support
  useEffect(() => {
    setSupported(!!getSpeechRecognition());
  }, []);

  // Draw frequency visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 280;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const drawFrame = () => {
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      const barCount = 64;
      const innerRadius = size * 0.28;
      const maxBarHeight = size * 0.15;

      // Draw base glow
      const gradient = ctx.createRadialGradient(cx, cy, innerRadius * 0.5, cx, cy, innerRadius * 1.5);
      const glowColor = isListening ? "rgba(239, 68, 68, 0.15)" : isSpeaking ? "rgba(99, 102, 241, 0.2)" : "rgba(99, 102, 241, 0.05)";
      gradient.addColorStop(0, glowColor);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      // Draw frequency bars
      for (let i = 0; i < barCount; i++) {
        const freqIndex = Math.floor((i / barCount) * frequencies.length);
        const value = frequencies[freqIndex] / 255;
        const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
        const barHeight = value * maxBarHeight + 2;

        const x1 = cx + Math.cos(angle) * innerRadius;
        const y1 = cy + Math.sin(angle) * innerRadius;
        const x2 = cx + Math.cos(angle) * (innerRadius + barHeight);
        const y2 = cy + Math.sin(angle) * (innerRadius + barHeight);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = isListening
          ? `rgba(239, 68, 68, ${0.3 + value * 0.7})`
          : `rgba(99, 102, 241, ${0.3 + value * 0.7})`;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // Draw inner ring
      ctx.beginPath();
      ctx.arc(cx, cy, innerRadius - 4, 0, Math.PI * 2);
      ctx.strokeStyle = isListening
        ? "rgba(239, 68, 68, 0.3)"
        : isSpeaking
          ? "rgba(99, 102, 241, 0.5)"
          : isLight ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.stroke();

      animationRef.current = requestAnimationFrame(drawFrame);
    };

    drawFrame();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [frequencies, isListening, isSpeaking, isLight]);

  // Simulate frequencies when speaking (since we can't analyze TTS output easily)
  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setFrequencies(prev =>
          prev.map(() => Math.random() * 180 + 40)
        );
      }, 50);
      return () => clearInterval(interval);
    } else if (!isListening) {
      setFrequencies(new Array(32).fill(0));
    }
  }, [isSpeaking, isListening]);

  // Initialize audio context for mic visualization
  const initAudioAnalyser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioCtx();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      const updateFrequencies = () => {
        if (!analyserRef.current || !isListening) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        setFrequencies(Array.from(dataArray));

        if (isListening) {
          requestAnimationFrame(updateFrequencies);
        }
      };

      updateFrequencies();
    } catch (e) {
      console.error("Failed to init audio analyser:", e);
    }
  }, [isListening]);

  // Start listening
  const startListening = useCallback(async () => {
    const SpeechRecognitionAPI = getSpeechRecognition();
    if (!SpeechRecognitionAPI) return;

    await initAudioAnalyser();

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      const combined = finalTranscript + interim;
      setTranscript(combined);
    };

    recognition.onerror = (event) => {
      if (event.error !== "no-speech" && event.error !== "aborted") {
        console.error("Speech error:", event.error);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
      setResponse("");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [initAudioAnalyser]);

  // Stop listening and process
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    setIsListening(false);

    if (transcript.trim()) {
      onTranscript(transcript);
      processAndSpeak(transcript);
    }
  }, [transcript, onTranscript]);

  // Process transcript and get response
  const processAndSpeak = async (text: string) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: text }]
        }),
      });

      if (!res.ok) throw new Error("Chat failed");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullResponse += decoder.decode(value, { stream: true });
        setResponse(fullResponse);
      }

      onResponse(fullResponse);

      // Speak the response
      await speak(fullResponse);
    } catch (e) {
      console.error("Process error:", e);
      setResponse("Sorry, I encountered an error.");
    }
  };

  // Text to speech
  const speak = async (text: string) => {
    setIsSpeaking(true);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("TTS failed");

      const arrayBuffer = await res.arrayBuffer();
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);

      source.onended = () => {
        setIsSpeaking(false);
      };

      source.start(0);
    } catch (e) {
      console.error("TTS error:", e);
      // Fallback to browser TTS
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      } else {
        setIsSpeaking(false);
      }
    }
  };

  const handleOrbClick = () => {
    if (isListening) {
      stopListening();
    } else if (!isSpeaking && !isProcessing) {
      startListening();
    }
  };

  if (!supported) {
    return (
      <div className={`text-center p-8 ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
        Voice not supported in this browser. Try Chrome or Edge.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Main Orb Container */}
      <div className="relative w-[280px] h-[280px] flex items-center justify-center">
        {/* Canvas for frequency visualization */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Pulsing rings */}
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping" />
            <div
              className="absolute inset-4 rounded-full border border-red-500/20 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
          </>
        )}

        {isSpeaking && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-[#6366f1]/30 animate-ping" style={{ animationDuration: "2s" }} />
            <div
              className="absolute inset-4 rounded-full border border-[#6366f1]/20 animate-pulse"
              style={{ animationDelay: "0.3s" }}
            />
          </>
        )}

        {/* Center button */}
        <button
          onClick={handleOrbClick}
          disabled={isProcessing}
          className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening
              ? "bg-red-500/20 border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)]"
              : isSpeaking
                ? "bg-[#6366f1]/20 border-2 border-[#6366f1] shadow-[0_0_40px_rgba(99,102,241,0.3)]"
                : isLight
                  ? "bg-gray-100 border-2 border-gray-300 hover:border-[#6366f1] hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]"
                  : "bg-[#1a1a1a] border-2 border-white/20 hover:border-[#6366f1] hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]"
          } ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {/* Avatar or Icon */}
          <div className="relative w-20 h-20 rounded-full overflow-hidden">
            {isProcessing ? (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="animate-spin w-8 h-8 text-[#6366f1]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : isListening ? (
              <div className="w-full h-full flex items-center justify-center bg-red-500/10">
                <svg className="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </div>
            ) : (
              <Image
                src="/headshot.png"
                alt="Dico"
                fill
                className="object-cover"
              />
            )}
          </div>
        </button>

        {/* Status dots */}
        <div className="absolute bottom-8 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                isListening
                  ? "bg-red-500 animate-pulse"
                  : isSpeaking
                    ? "bg-[#6366f1] animate-pulse"
                    : isLight ? "bg-gray-300" : "bg-gray-700"
              }`}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Status Text */}
      <div className={`mt-6 text-center ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
        {isListening ? (
          <div>
            <p className="text-red-500 font-medium animate-pulse">Listening...</p>
            {transcript && (
              <p className={`mt-2 text-sm max-w-xs ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>
                &ldquo;{transcript}&rdquo;
              </p>
            )}
          </div>
        ) : isSpeaking ? (
          <div>
            <p className="text-[#6366f1] font-medium">Speaking...</p>
            <button
              onClick={() => {
                speechSynthesis.cancel();
                setIsSpeaking(false);
              }}
              className="mt-2 text-xs text-gray-500 hover:text-gray-300"
            >
              Stop
            </button>
          </div>
        ) : isProcessing ? (
          <p className="text-[#6366f1] font-medium">Thinking...</p>
        ) : (
          <p className="text-sm">Tap to speak</p>
        )}
      </div>

      {/* Response preview */}
      {response && !isListening && (
        <div className={`mt-4 p-4 rounded-xl max-w-sm text-sm ${
          isLight ? 'bg-gray-100 text-gray-700' : 'bg-[#1a1a1a] text-gray-300'
        }`}>
          <p className="line-clamp-3">{response}</p>
        </div>
      )}

      {/* Instructions */}
      <p className={`mt-6 text-xs ${isLight ? 'text-gray-400' : 'text-gray-600'}`}>
        Click the orb to start • Speak your question • Click again to send
      </p>
    </div>
  );
}
