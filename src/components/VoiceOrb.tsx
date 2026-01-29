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
  onspeechend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

function getSpeechRecognition(): (new () => SpeechRecognition) | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
}

// Color palette
const COLORS = {
  cyan: "#18E6FF",
  purple: "#9d4edd",
  cyanGlow: "rgba(24, 230, 255, 0.4)",
  purpleGlow: "rgba(157, 78, 221, 0.4)",
};

export default function VoiceOrb({ onTranscript, onResponse, isProcessing }: VoiceOrbProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Frequency data for visualizers
  const [userFrequencies, setUserFrequencies] = useState<number[]>(new Array(32).fill(0));
  const [dicoFrequencies, setDicoFrequencies] = useState<number[]>(new Array(64).fill(0));

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const micAnimationRef = useRef<number | null>(null);
  const currentAudioRef = useRef<AudioBufferSourceNode | null>(null);
  const dicoCanvasRef = useRef<HTMLCanvasElement>(null);
  const userCanvasRef = useRef<HTMLCanvasElement>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check browser support
  useEffect(() => {
    const SpeechAPI = getSpeechRecognition();
    setSupported(!!SpeechAPI);
    if (!SpeechAPI) {
      setError("Voice not supported. Try Chrome or Edge.");
    }
  }, []);

  // Draw Dico's visualizer (circular around headshot)
  useEffect(() => {
    const canvas = dicoCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 200;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    let time = 0;

    const draw = () => {
      time += 0.03;
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      const barCount = 64;
      const innerRadius = size * 0.38;
      const maxBarHeight = size * 0.12;

      // Draw frequency bars
      for (let i = 0; i < barCount; i++) {
        const freqIndex = Math.floor((i / barCount) * dicoFrequencies.length);
        const value = dicoFrequencies[freqIndex] / 255;
        const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
        const barHeight = value * maxBarHeight + 2;

        const x1 = cx + Math.cos(angle) * innerRadius;
        const y1 = cy + Math.sin(angle) * innerRadius;
        const x2 = cx + Math.cos(angle) * (innerRadius + barHeight);
        const y2 = cy + Math.sin(angle) * (innerRadius + barHeight);

        // Gradient from cyan to purple
        const colorProgress = i / barCount;
        const r = Math.round(24 + (157 - 24) * colorProgress);
        const g = Math.round(230 + (78 - 230) * colorProgress);
        const b = Math.round(255 + (221 - 255) * colorProgress);
        const alpha = isSpeaking ? 0.5 + value * 0.5 : 0.15 + value * 0.2;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // Inner glow ring
      ctx.beginPath();
      ctx.arc(cx, cy, innerRadius - 4, 0, Math.PI * 2);
      ctx.strokeStyle = isSpeaking
        ? `rgba(157, 78, 221, ${0.3 + Math.sin(time * 3) * 0.1})`
        : isListening
          ? `rgba(24, 230, 255, ${0.2 + Math.sin(time * 2) * 0.1})`
          : isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)";
      ctx.lineWidth = 2;
      ctx.stroke();

      requestAnimationFrame(draw);
    };

    draw();
  }, [dicoFrequencies, isSpeaking, isListening, isLight]);

  // Draw user's small visualizer (horizontal bars)
  useEffect(() => {
    const canvas = userCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 120;
    const height = 40;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (!isListening) {
        requestAnimationFrame(draw);
        return;
      }

      const barCount = 16;
      const barWidth = width / barCount - 2;
      const centerY = height / 2;

      for (let i = 0; i < barCount; i++) {
        const freqIndex = Math.floor((i / barCount) * userFrequencies.length);
        const value = userFrequencies[freqIndex] / 255;
        const barHeight = Math.max(4, value * (height * 0.8));

        const x = i * (barWidth + 2) + 1;
        const y = centerY - barHeight / 2;

        // Cyan gradient
        const alpha = 0.4 + value * 0.6;
        ctx.fillStyle = `rgba(24, 230, 255, ${alpha})`;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      requestAnimationFrame(draw);
    };

    draw();
  }, [userFrequencies, isListening]);

  // Animate Dico's frequencies
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isSpeaking) {
      interval = setInterval(() => {
        setDicoFrequencies(prev =>
          prev.map((_, i) => {
            const base = Math.sin(Date.now() / 150 + i * 0.4) * 60 + 120;
            return Math.min(255, Math.max(0, base + Math.random() * 100));
          })
        );
      }, 40);
    } else if (isThinking) {
      interval = setInterval(() => {
        setDicoFrequencies(prev =>
          prev.map((_, i) => {
            const wave = Math.sin(Date.now() / 300 + i * 0.2) * 30 + 50;
            return Math.min(255, Math.max(0, wave));
          })
        );
      }, 60);
    } else {
      // Gentle idle pulse
      interval = setInterval(() => {
        setDicoFrequencies(prev =>
          prev.map((_, i) => Math.sin(Date.now() / 1500 + i * 0.15) * 8 + 12)
        );
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isSpeaking, isThinking]);

  // Update user frequencies from mic
  const updateMicFrequencies = useCallback(() => {
    if (!analyserRef.current || !isListening) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    setUserFrequencies(Array.from(dataArray.slice(0, 32)));

    micAnimationRef.current = requestAnimationFrame(updateMicFrequencies);
  }, [isListening]);

  // Initialize mic for visualization
  const initMicAnalyser = useCallback(async () => {
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
      analyserRef.current.fftSize = 64;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      updateMicFrequencies();
    } catch (e) {
      console.error("Mic init failed:", e);
    }
  }, [updateMicFrequencies]);

  // Cleanup mic
  const cleanupMic = useCallback(() => {
    if (micAnimationRef.current) {
      cancelAnimationFrame(micAnimationRef.current);
      micAnimationRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    analyserRef.current = null;
    setUserFrequencies(new Array(32).fill(0));
  }, []);

  // Start listening
  const startListening = useCallback(async () => {
    const SpeechRecognitionAPI = getSpeechRecognition();
    if (!SpeechRecognitionAPI) return;

    setError(null);
    await initMicAnalyser();

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";
    let lastSpeechTime = Date.now();

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
          lastSpeechTime = Date.now();
        } else {
          interim += result[0].transcript;
          lastSpeechTime = Date.now();
        }
      }
      setTranscript(finalTranscript + interim);

      // Auto-send after 1.5s of silence
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      silenceTimeoutRef.current = setTimeout(() => {
        if (finalTranscript.trim() && Date.now() - lastSpeechTime >= 1500) {
          stopAndProcess(finalTranscript.trim());
        }
      }, 1500);
    };

    recognition.onerror = (event) => {
      if (event.error !== "no-speech" && event.error !== "aborted") {
        console.error("Speech error:", event.error);
        setError(event.error === "not-allowed" ? "Mic access denied" : `Error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      if (isListening && !isThinking && !isSpeaking) {
        // Restart if we're still supposed to be listening
        try {
          recognition.start();
        } catch (e) {
          cleanupMic();
          setIsListening(false);
        }
      }
    };

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start:", e);
      setError("Failed to start listening");
    }
  }, [initMicAnalyser, cleanupMic, isListening, isThinking, isSpeaking]);

  // Stop and process
  const stopAndProcess = useCallback(async (text: string) => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }

    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    cleanupMic();
    setIsListening(false);

    if (!text.trim()) return;

    onTranscript(text);
    setIsThinking(true);

    try {
      // Get response from chat API
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
      }

      setIsThinking(false);
      onResponse(fullResponse);

      // Speak with ElevenLabs
      await speakResponse(fullResponse);

      // Auto-restart listening after speaking
      setTimeout(() => {
        if (!isListening && !isSpeaking) {
          startListening();
        }
      }, 500);

    } catch (e) {
      console.error("Process error:", e);
      setIsThinking(false);
      setError("Failed to get response");
    }
  }, [onTranscript, onResponse, cleanupMic, startListening, isListening, isSpeaking]);

  // Speak response with ElevenLabs
  const speakResponse = async (text: string) => {
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
      console.error("TTS error:", e);
      // Fallback to browser TTS
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      } else {
        setIsSpeaking(false);
      }
    }
  };

  // Stop everything
  const stopAll = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    if (currentAudioRef.current) {
      try { currentAudioRef.current.stop(); } catch {}
      currentAudioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
    }
    cleanupMic();
    setIsListening(false);
    setIsSpeaking(false);
    setIsThinking(false);
    setTranscript("");
  }, [cleanupMic]);

  // Handle orb click
  const handleOrbClick = () => {
    if (isListening || isSpeaking || isThinking) {
      stopAll();
    } else {
      startListening();
    }
  };

  if (!supported) {
    return (
      <div className={`text-center p-4 ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
        <p className="text-sm">Voice not supported in this browser.</p>
        <p className="text-xs mt-1">Try Chrome or Edge.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Main Orb with Dico's face always visible */}
      <div className="relative">
        {/* Dico visualizer canvas */}
        <canvas
          ref={dicoCanvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 200,
            height: 200
          }}
        />

        {/* Glow effect */}
        {(isListening || isSpeaking || isThinking) && (
          <div
            className="absolute inset-0 rounded-full blur-xl transition-opacity duration-500"
            style={{
              background: isSpeaking
                ? `radial-gradient(circle, ${COLORS.purpleGlow} 0%, transparent 70%)`
                : `radial-gradient(circle, ${COLORS.cyanGlow} 0%, transparent 70%)`,
              width: 200,
              height: 200,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}

        {/* Clickable orb with Dico's face */}
        <button
          onClick={handleOrbClick}
          disabled={isProcessing}
          className={`relative w-32 h-32 rounded-full overflow-hidden transition-all duration-300 ${
            isProcessing ? "opacity-50" : "hover:scale-105 cursor-pointer"
          }`}
          style={{
            boxShadow: isSpeaking
              ? `0 0 40px ${COLORS.purpleGlow}, 0 0 80px ${COLORS.purpleGlow}`
              : isListening
                ? `0 0 40px ${COLORS.cyanGlow}, 0 0 80px ${COLORS.cyanGlow}`
                : isThinking
                  ? `0 0 30px rgba(157, 78, 221, 0.3)`
                  : "0 0 20px rgba(0,0,0,0.2)",
            border: isSpeaking
              ? `3px solid ${COLORS.purple}`
              : isListening
                ? `3px solid ${COLORS.cyan}`
                : isThinking
                  ? `3px solid rgba(157, 78, 221, 0.5)`
                  : isLight ? "3px solid rgba(0,0,0,0.1)" : "3px solid rgba(255,255,255,0.1)",
          }}
        >
          <Image
            src="/headshot.png"
            alt="Dico"
            fill
            className="object-cover"
          />

          {/* Thinking overlay */}
          {isThinking && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </button>
      </div>

      {/* User's voice visualizer */}
      <div className={`h-12 flex flex-col items-center justify-center transition-opacity duration-300 ${isListening ? 'opacity-100' : 'opacity-30'}`}>
        <canvas
          ref={userCanvasRef}
          style={{ width: 120, height: 40 }}
        />
        {isListening && (
          <span className="text-[10px] mt-1" style={{ color: COLORS.cyan }}>
            YOU
          </span>
        )}
      </div>

      {/* Status */}
      <div className={`text-center min-h-[50px] ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
        {error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : isSpeaking ? (
          <p style={{ color: COLORS.purple }} className="text-sm font-medium">
            Dico is speaking...
          </p>
        ) : isThinking ? (
          <p style={{ color: COLORS.purple }} className="text-sm font-medium animate-pulse">
            Thinking...
          </p>
        ) : isListening ? (
          <div>
            <p style={{ color: COLORS.cyan }} className="text-sm font-medium">
              Listening...
            </p>
            {transcript && (
              <p className="text-xs mt-1 max-w-[200px] opacity-70 truncate">
                "{transcript}"
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm opacity-60">Tap to start conversation</p>
        )}
      </div>

      {/* Instructions */}
      <p className={`text-[10px] ${isLight ? 'text-gray-400' : 'text-gray-600'}`}>
        {isListening || isSpeaking || isThinking ? "Tap to stop" : "Continuous voice mode"}
      </p>
    </div>
  );
}
