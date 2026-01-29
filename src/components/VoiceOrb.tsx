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

// Color palette - cyan to purple gradient
const COLORS = {
  cyan: "#18E6FF",
  purple: "#9d4edd",
  cyanGlow: "rgba(24, 230, 255, 0.3)",
  purpleGlow: "rgba(157, 78, 221, 0.3)",
  cyanDim: "rgba(24, 230, 255, 0.15)",
  purpleDim: "rgba(157, 78, 221, 0.15)",
};

export default function VoiceOrb({ onTranscript, onResponse, isProcessing }: VoiceOrbProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [supported, setSupported] = useState(false);
  const [frequencies, setFrequencies] = useState<number[]>(new Array(64).fill(0));
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const currentAudioRef = useRef<AudioBufferSourceNode | null>(null);

  // Check browser support
  useEffect(() => {
    const SpeechAPI = getSpeechRecognition();
    setSupported(!!SpeechAPI);
    if (!SpeechAPI) {
      setError("Speech recognition not supported. Try Chrome or Edge.");
    }
  }, []);

  // Draw frequency visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 320;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    let time = 0;

    const drawFrame = () => {
      time += 0.02;
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      const barCount = 64;
      const innerRadius = size * 0.26;
      const maxBarHeight = size * 0.18;

      // Outer glow gradient
      const glowGradient = ctx.createRadialGradient(cx, cy, innerRadius * 0.8, cx, cy, size * 0.48);
      if (isListening) {
        glowGradient.addColorStop(0, "rgba(24, 230, 255, 0.15)");
        glowGradient.addColorStop(0.5, "rgba(157, 78, 221, 0.1)");
        glowGradient.addColorStop(1, "transparent");
      } else if (isSpeaking) {
        glowGradient.addColorStop(0, "rgba(157, 78, 221, 0.2)");
        glowGradient.addColorStop(0.5, "rgba(24, 230, 255, 0.1)");
        glowGradient.addColorStop(1, "transparent");
      } else {
        glowGradient.addColorStop(0, isLight ? "rgba(99, 102, 241, 0.05)" : "rgba(99, 102, 241, 0.08)");
        glowGradient.addColorStop(1, "transparent");
      }
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, size, size);

      // Draw frequency bars with gradient colors
      for (let i = 0; i < barCount; i++) {
        const freqIndex = Math.floor((i / barCount) * frequencies.length);
        const value = frequencies[freqIndex] / 255;
        const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2 + Math.sin(time) * 0.02;
        const barHeight = value * maxBarHeight + 3;

        const x1 = cx + Math.cos(angle) * innerRadius;
        const y1 = cy + Math.sin(angle) * innerRadius;
        const x2 = cx + Math.cos(angle) * (innerRadius + barHeight);
        const y2 = cy + Math.sin(angle) * (innerRadius + barHeight);

        // Gradient from cyan to purple based on position
        const colorProgress = i / barCount;
        const r = Math.round(24 + (157 - 24) * colorProgress);
        const g = Math.round(230 + (78 - 230) * colorProgress);
        const b = Math.round(255 + (221 - 255) * colorProgress);
        const alpha = 0.4 + value * 0.6;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.stroke();

        // Add glow particles on high values
        if (value > 0.6 && (isListening || isSpeaking)) {
          ctx.beginPath();
          ctx.arc(x2, y2, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${value})`;
          ctx.fill();
        }
      }

      // Inner ring - subtle dashed circle when idle
      ctx.beginPath();
      ctx.arc(cx, cy, innerRadius - 6, 0, Math.PI * 2);
      if (isListening) {
        ctx.strokeStyle = COLORS.cyan;
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
      } else if (isSpeaking) {
        ctx.strokeStyle = COLORS.purple;
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = isLight ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Outer subtle ring
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.44, 0, Math.PI * 2);
      ctx.strokeStyle = isListening || isSpeaking
        ? `rgba(157, 78, 221, ${0.1 + Math.sin(time * 2) * 0.05})`
        : isLight ? "rgba(0, 0, 0, 0.03)" : "rgba(255, 255, 255, 0.03)";
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

  // Simulate frequencies when speaking
  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setFrequencies(prev =>
          prev.map((_, i) => {
            const base = Math.sin(Date.now() / 200 + i * 0.3) * 50 + 100;
            return Math.min(255, Math.max(0, base + Math.random() * 80));
          })
        );
      }, 50);
      return () => clearInterval(interval);
    } else if (!isListening) {
      // Gentle idle animation
      const interval = setInterval(() => {
        setFrequencies(prev =>
          prev.map((_, i) => Math.sin(Date.now() / 1000 + i * 0.2) * 10 + 15)
        );
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isSpeaking, isListening]);

  // Update frequencies from mic input
  const updateMicFrequencies = useCallback(() => {
    if (!analyserRef.current || !isListening) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    setFrequencies(Array.from(dataArray));

    if (isListening) {
      requestAnimationFrame(updateMicFrequencies);
    }
  }, [isListening]);

  // Initialize audio context for mic visualization
  const initAudioAnalyser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }

      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 128;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      updateMicFrequencies();
    } catch (e) {
      console.error("Failed to init audio analyser:", e);
      setError("Microphone access denied");
    }
  }, [updateMicFrequencies]);

  // Start listening
  const startListening = useCallback(async () => {
    const SpeechRecognitionAPI = getSpeechRecognition();
    if (!SpeechRecognitionAPI) {
      setError("Speech recognition not available");
      return;
    }

    setError(null);

    // Initialize audio analyzer for visualization
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
      console.error("Speech error:", event.error);
      if (event.error === "not-allowed") {
        setError("Microphone permission denied");
      } else if (event.error !== "no-speech" && event.error !== "aborted") {
        setError(`Speech error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      // Cleanup mic stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setIsListening(false);
    };

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
      setResponse("");
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start recognition:", e);
      setError("Failed to start speech recognition");
    }
  }, [initAudioAnalyser]);

  // Stop listening and process
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    // Stop mic stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
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
      setError("Failed to get response");
    }
  };

  // Text to speech with ElevenLabs
  const speak = async (text: string) => {
    setIsSpeaking(true);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        console.warn("TTS API failed, falling back to browser");
        throw new Error("TTS failed");
      }

      const arrayBuffer = await res.arrayBuffer();

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }

      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer.slice(0));
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);

      currentAudioRef.current = source;

      source.onended = () => {
        setIsSpeaking(false);
        currentAudioRef.current = null;
      };

      source.start(0);
    } catch (e) {
      console.error("TTS error, using browser fallback:", e);
      // Fallback to browser TTS
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      } else {
        setIsSpeaking(false);
      }
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.stop();
      } catch (e) {
        // ignore
      }
      currentAudioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleOrbClick = () => {
    if (isListening) {
      stopListening();
    } else if (isSpeaking) {
      stopSpeaking();
    } else if (!isProcessing) {
      startListening();
    }
  };

  if (!supported) {
    return (
      <div className={`text-center p-8 ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
        <p>Voice not supported in this browser.</p>
        <p className="text-sm mt-2">Try Chrome, Edge, or Safari.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Main Orb Container */}
      <div className="relative w-[320px] h-[320px] flex items-center justify-center">
        {/* Canvas for frequency visualization */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Animated outer rings */}
        {isListening && (
          <>
            <div
              className="absolute inset-0 rounded-full border border-cyan-400/30"
              style={{
                animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
              }}
            />
            <div
              className="absolute inset-6 rounded-full border border-purple-400/20"
              style={{
                animation: "pulse 2s ease-in-out infinite",
                animationDelay: "0.5s",
              }}
            />
          </>
        )}

        {isSpeaking && (
          <>
            <div
              className="absolute inset-0 rounded-full border border-purple-400/30"
              style={{
                animation: "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
              }}
            />
            <div
              className="absolute inset-6 rounded-full border border-cyan-400/20"
              style={{
                animation: "pulse 2s ease-in-out infinite",
                animationDelay: "0.3s",
              }}
            />
          </>
        )}

        {/* Center button */}
        <button
          onClick={handleOrbClick}
          disabled={isProcessing}
          className={`relative z-10 w-36 h-36 rounded-full flex items-center justify-center transition-all duration-500 ${
            isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"
          }`}
          style={{
            background: isListening
              ? "linear-gradient(135deg, rgba(24, 230, 255, 0.15), rgba(157, 78, 221, 0.15))"
              : isSpeaking
                ? "linear-gradient(135deg, rgba(157, 78, 221, 0.2), rgba(24, 230, 255, 0.1))"
                : isLight
                  ? "rgba(243, 244, 246, 1)"
                  : "rgba(20, 20, 20, 1)",
            border: isListening
              ? `2px solid ${COLORS.cyan}`
              : isSpeaking
                ? `2px solid ${COLORS.purple}`
                : isLight
                  ? "2px solid rgba(0, 0, 0, 0.1)"
                  : "2px solid rgba(255, 255, 255, 0.1)",
            boxShadow: isListening
              ? `0 0 60px ${COLORS.cyanGlow}, 0 0 100px ${COLORS.purpleDim}`
              : isSpeaking
                ? `0 0 60px ${COLORS.purpleGlow}, 0 0 100px ${COLORS.cyanDim}`
                : "0 0 30px rgba(0, 0, 0, 0.2)",
          }}
        >
          {/* Inner content */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden flex items-center justify-center">
            {isProcessing ? (
              <svg className="animate-spin w-10 h-10" style={{ color: COLORS.purple }} viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : isListening ? (
              <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${COLORS.cyanDim}, ${COLORS.purpleDim})` }}>
                <svg className="w-12 h-12" style={{ color: COLORS.cyan }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </div>
            ) : isSpeaking ? (
              <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${COLORS.purpleDim}, ${COLORS.cyanDim})` }}>
                {/* Sound wave icon */}
                <svg className="w-12 h-12" style={{ color: COLORS.purple }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
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

        {/* Status indicator dots */}
        <div className="absolute bottom-10 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: isListening
                  ? COLORS.cyan
                  : isSpeaking
                    ? COLORS.purple
                    : isLight ? "#d1d5db" : "#374151",
                boxShadow: isListening || isSpeaking
                  ? `0 0 8px ${isListening ? COLORS.cyan : COLORS.purple}`
                  : "none",
                animation: isListening || isSpeaking ? "pulse 1s ease-in-out infinite" : "none",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Status Text */}
      <div className={`mt-4 text-center min-h-[60px] ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
        {error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : isListening ? (
          <div>
            <p style={{ color: COLORS.cyan }} className="font-medium text-sm tracking-wide uppercase">
              Listening...
            </p>
            {transcript && (
              <p className={`mt-2 text-sm max-w-xs ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>
                &ldquo;{transcript}&rdquo;
              </p>
            )}
          </div>
        ) : isSpeaking ? (
          <div>
            <p style={{ color: COLORS.purple }} className="font-medium text-sm tracking-wide uppercase">
              Speaking...
            </p>
            <button
              onClick={stopSpeaking}
              className="mt-2 text-xs text-gray-500 hover:text-white transition-colors"
            >
              Tap to stop
            </button>
          </div>
        ) : isProcessing ? (
          <p style={{ color: COLORS.purple }} className="font-medium text-sm tracking-wide uppercase">
            Thinking...
          </p>
        ) : (
          <p className="text-sm opacity-60">Tap to speak</p>
        )}
      </div>

      {/* Response preview */}
      {response && !isListening && !error && (
        <div className={`mt-4 p-4 rounded-xl max-w-sm text-sm ${
          isLight ? 'bg-gray-100 text-gray-700' : 'bg-white/5 text-gray-300'
        }`} style={{ borderLeft: `3px solid ${COLORS.purple}` }}>
          <p className="line-clamp-3">{response}</p>
        </div>
      )}

      {/* Instructions */}
      <p className={`mt-6 text-xs ${isLight ? 'text-gray-400' : 'text-gray-600'}`}>
        Tap orb to start • Speak • Tap again to send
      </p>
    </div>
  );
}
