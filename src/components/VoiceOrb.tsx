"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";

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

// Particle type
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  hue: number;
}

// Color palette
const COLORS = {
  cyan: "#22d3ee",
  purple: "#a855f7",
  magenta: "#ec4899",
  cyanGlow: "rgba(34, 211, 238, 0.4)",
  purpleGlow: "rgba(168, 85, 247, 0.4)",
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface VoiceOrbProps {
  conversationHistory: Message[];
  onAddToHistory: (message: Message) => void;
}

export default function VoiceOrb({ conversationHistory, onAddToHistory }: VoiceOrbProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live transcription
  const [liveTranscript, setLiveTranscript] = useState("");
  const [lastResponse, setLastResponse] = useState("");
  const [showResponse, setShowResponse] = useState(false);

  // Visual states
  const [dicoFrequencies, setDicoFrequencies] = useState<number[]>(new Array(48).fill(0));
  const [userAmplitude, setUserAmplitude] = useState(0);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  // Refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const micAnimationRef = useRef<number | null>(null);
  const currentAudioRef = useRef<AudioBufferSourceNode | null>(null);
  const ttsAnalyserRef = useRef<AnalyserNode | null>(null);
  const ttsAnimationRef = useRef<number | null>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Check browser support
  useEffect(() => {
    const SpeechAPI = getSpeechRecognition();
    setSupported(!!SpeechAPI);
  }, []);

  // Main canvas animation
  useEffect(() => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 240;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    let animationId: number;
    let time = 0;

    const draw = () => {
      time += 0.02;
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;

      // Spawn particles when active
      if ((isSpeaking || isListening) && Math.random() < 0.2) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 45 + Math.random() * 15;
        particlesRef.current.push({
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.random() * 1.5 - 0.5,
          radius: 1.5 + Math.random() * 1.5,
          life: 80 + Math.random() * 40,
          hue: isSpeaking ? 270 : 185,
        });
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        if (p.life <= 0) return false;

        const alpha = Math.min(1, p.life / 40) * 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (p.life / 120 + 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${alpha})`;
        ctx.fill();
        return true;
      });

      // Limit particles
      if (particlesRef.current.length > 60) {
        particlesRef.current = particlesRef.current.slice(-60);
      }

      // Draw frequency bars (circular)
      const barCount = 48;
      const innerRadius = 48;
      const maxBarHeight = 28;

      for (let i = 0; i < barCount; i++) {
        const value = dicoFrequencies[i] / 255;
        const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
        const barHeight = value * maxBarHeight + 2;

        const x1 = cx + Math.cos(angle) * innerRadius;
        const y1 = cy + Math.sin(angle) * innerRadius;
        const x2 = cx + Math.cos(angle) * (innerRadius + barHeight);
        const y2 = cy + Math.sin(angle) * (innerRadius + barHeight);

        const hue = isSpeaking ? 270 + (i / barCount) * 30 : isListening ? 185 : 220;
        const alpha = (isSpeaking || isListening) ? 0.4 + value * 0.6 : 0.1 + value * 0.1;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsla(${hue}, 75%, 60%, ${alpha})`;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // Breathing glow ring
      if (isSpeaking || isListening || isProcessing) {
        const breathe = Math.sin(time * 3) * 0.2 + 0.8;
        const baseHue = isSpeaking ? 270 : isProcessing ? 320 : 185;

        ctx.beginPath();
        ctx.arc(cx, cy, innerRadius - 3, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${baseHue}, 80%, 60%, ${0.25 * breathe})`;
        ctx.lineWidth = 6;
        ctx.stroke();
      }

      // Processing dots
      if (isProcessing) {
        for (let i = 0; i < 3; i++) {
          const orbitAngle = time * 4 + (i * Math.PI * 2) / 3;
          const orbitRadius = 60;
          const dotX = cx + Math.cos(orbitAngle) * orbitRadius;
          const dotY = cy + Math.sin(orbitAngle) * orbitRadius;

          ctx.beginPath();
          ctx.arc(dotX, dotY, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${320 + i * 20}, 80%, 65%, 0.9)`;
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [dicoFrequencies, isSpeaking, isListening, isProcessing]);

  // Animate Dico frequencies
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isSpeaking && !ttsAnalyserRef.current) {
      interval = setInterval(() => {
        setDicoFrequencies(prev =>
          prev.map((_, i) => {
            const base = Math.sin(Date.now() / 100 + i * 0.6) * 80 + 140;
            return Math.min(255, Math.max(0, base + Math.random() * 60));
          })
        );
      }, 30);
    } else if (isProcessing) {
      interval = setInterval(() => {
        setDicoFrequencies(prev =>
          prev.map((_, i) => Math.sin(Date.now() / 200 + i * 0.3) * 35 + 50)
        );
      }, 50);
    } else if (isListening) {
      interval = setInterval(() => {
        setDicoFrequencies(prev =>
          prev.map((_, i) => Math.sin(Date.now() / 600 + i * 0.2) * 20 + 25)
        );
      }, 60);
    } else {
      interval = setInterval(() => {
        setDicoFrequencies(prev =>
          prev.map((_, i) => Math.sin(Date.now() / 1500 + i * 0.1) * 8 + 12)
        );
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isSpeaking, isProcessing, isListening]);

  // Update TTS frequencies from audio
  const updateTtsFrequencies = useCallback(() => {
    if (!ttsAnalyserRef.current) return;
    const dataArray = new Uint8Array(ttsAnalyserRef.current.frequencyBinCount);
    ttsAnalyserRef.current.getByteFrequencyData(dataArray);
    setDicoFrequencies(Array.from(dataArray.slice(0, 48)));
    ttsAnimationRef.current = requestAnimationFrame(updateTtsFrequencies);
  }, []);

  // Update user amplitude from mic
  const updateMicAmplitude = useCallback(() => {
    if (!analyserRef.current || !isListening) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    setUserAmplitude(avg);
    micAnimationRef.current = requestAnimationFrame(updateMicAmplitude);
  }, [isListening]);

  // Init mic analyser
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
      updateMicAmplitude();
    } catch (e) {
      console.error("Mic init failed:", e);
      setError("Microphone access denied");
    }
  }, [updateMicAmplitude]);

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
    setUserAmplitude(0);
  }, []);

  // Start listening
  const startListening = useCallback(async () => {
    const SpeechRecognitionAPI = getSpeechRecognition();
    if (!SpeechRecognitionAPI) return;

    setError(null);
    setLiveTranscript("");
    setShowResponse(false);
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
      setLiveTranscript(finalTranscript + interim);

      // Auto-send after silence
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = setTimeout(() => {
        if (finalTranscript.trim() && Date.now() - lastSpeechTime >= 1200) {
          processVoice(finalTranscript.trim());
        }
      }, 1200);
    };

    recognition.onerror = (event) => {
      if (event.error !== "no-speech" && event.error !== "aborted") {
        setError(event.error === "not-allowed" ? "Mic denied" : event.error);
      }
    };

    recognition.onend = () => {
      if (isListening && !isProcessing && !isSpeaking) {
        try { recognition.start(); } catch { cleanupMic(); setIsListening(false); }
      }
    };

    recognition.onstart = () => setIsListening(true);
    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setError("Failed to start");
    }
  }, [initMicAnalyser, cleanupMic, isListening, isProcessing, isSpeaking]);

  // Process voice input
  const processVoice = useCallback(async (text: string) => {
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    cleanupMic();
    setIsListening(false);
    setIsProcessing(true);

    // Add user message to shared history
    const userMessage: Message = { role: "user", content: text };
    onAddToHistory(userMessage);

    // Build messages including shared history for context
    const messagesForApi = [...conversationHistory, userMessage];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesForApi }),
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

      // Add assistant response to shared history
      onAddToHistory({ role: "assistant", content: fullResponse });

      setIsProcessing(false);
      setLastResponse(fullResponse);
      setShowResponse(true);
      await speakResponse(fullResponse);

      // Auto-restart
      setTimeout(() => {
        if (!isListening && !isSpeaking) startListening();
      }, 600);
    } catch {
      setIsProcessing(false);
      setError("Failed to respond");
    }
  }, [cleanupMic, startListening, isListening, isSpeaking, conversationHistory, onAddToHistory]);

  // Speak with TTS
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
      if (!audioContextRef.current) audioContextRef.current = new AudioCtx();
      if (audioContextRef.current.state === "suspended") await audioContextRef.current.resume();

      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer.slice(0));
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;

      ttsAnalyserRef.current = audioContextRef.current.createAnalyser();
      ttsAnalyserRef.current.fftSize = 128;
      source.connect(ttsAnalyserRef.current);
      ttsAnalyserRef.current.connect(audioContextRef.current.destination);

      currentAudioRef.current = source;
      updateTtsFrequencies();

      source.onended = () => {
        if (ttsAnimationRef.current) cancelAnimationFrame(ttsAnimationRef.current);
        ttsAnalyserRef.current = null;
        setIsSpeaking(false);
        currentAudioRef.current = null;
        setDicoFrequencies(new Array(48).fill(12));
      };

      source.start(0);
    } catch {
      // Fallback to browser TTS
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      } else {
        setIsSpeaking(false);
      }
    }
  };

  // Stop/Interrupt everything
  const stopAll = useCallback(() => {
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    if (currentAudioRef.current) {
      try { currentAudioRef.current.stop(); } catch {}
      currentAudioRef.current = null;
    }
    if (ttsAnimationRef.current) {
      cancelAnimationFrame(ttsAnimationRef.current);
      ttsAnimationRef.current = null;
    }
    ttsAnalyserRef.current = null;
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    cleanupMic();
    setIsListening(false);
    setIsSpeaking(false);
    setIsProcessing(false);
    setLiveTranscript("");
    particlesRef.current = [];
  }, [cleanupMic]);

  // Handle click
  const handleClick = () => {
    if (isListening || isSpeaking || isProcessing) {
      stopAll();
    } else {
      startListening();
    }
  };

  // 3D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTiltX((-y / (rect.height / 2)) * 12);
    setTiltY((x / (rect.width / 2)) * 12);
  };

  const handleMouseLeave = () => {
    setTiltX(0);
    setTiltY(0);
  };

  if (!supported) {
    return (
      <div className={`text-center p-4 ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
        <p className="text-sm">Voice not supported</p>
        <p className="text-xs mt-1 opacity-60">Try Chrome or Edge</p>
      </div>
    );
  }

  const isActive = isListening || isSpeaking || isProcessing;

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-[320px]">
      {/* Orb */}
      <div className="relative">
        <canvas
          ref={mainCanvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 240, height: 240 }}
        />

        {/* Glow */}
        <div
          className={`absolute rounded-full transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}
          style={{
            width: 140, height: 140, left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
            background: isSpeaking
              ? `radial-gradient(circle, ${COLORS.purpleGlow} 0%, transparent 70%)`
              : `radial-gradient(circle, ${COLORS.cyanGlow} 0%, transparent 70%)`,
            filter: 'blur(25px)',
          }}
        />

        {/* Button */}
        <button
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-24 h-24 rounded-full overflow-hidden z-10 transition-transform duration-150"
          style={{
            transform: `perspective(400px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${isActive ? 1.03 : 1})`,
            boxShadow: isActive
              ? `0 0 50px ${isSpeaking ? COLORS.purpleGlow : COLORS.cyanGlow}`
              : isLight ? '0 4px 20px rgba(0,0,0,0.1)' : '0 4px 20px rgba(0,0,0,0.4)',
            border: `2px solid ${isSpeaking ? COLORS.purple : isListening ? COLORS.cyan : isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          <Image src="/headshot.png" alt="Dico" fill className="object-cover" priority />
        </button>
      </div>

      {/* User amplitude indicator */}
      <div className="h-2 w-32 rounded-full overflow-hidden bg-black/10 dark:bg-white/5">
        <div
          className="h-full rounded-full transition-all duration-75"
          style={{
            width: `${Math.min(100, (userAmplitude / 128) * 100)}%`,
            backgroundColor: COLORS.cyan,
            opacity: isListening ? 1 : 0.3,
          }}
        />
      </div>

      {/* Live transcription area */}
      <div className={`w-full min-h-[80px] rounded-xl p-3 transition-all duration-300 ${
        isLight ? 'bg-gray-100/80' : 'bg-white/5'
      }`}>
        {error ? (
          <p className="text-red-400 text-xs text-center">{error}</p>
        ) : isSpeaking ? (
          <div className="text-center">
            <p className="text-xs font-medium mb-1" style={{ color: COLORS.purple }}>Dico is speaking</p>
            <p className="text-[10px] opacity-60">Tap to interrupt</p>
            {showResponse && (
              <p className={`text-xs mt-2 leading-relaxed line-clamp-3 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                {lastResponse.slice(0, 150)}{lastResponse.length > 150 ? '...' : ''}
              </p>
            )}
          </div>
        ) : isProcessing ? (
          <div className="text-center">
            <p className="text-xs font-medium animate-pulse" style={{ color: COLORS.magenta }}>Processing...</p>
          </div>
        ) : isListening ? (
          <div className="text-center">
            <p className="text-xs font-medium mb-1" style={{ color: COLORS.cyan }}>Listening</p>
            {liveTranscript ? (
              <p className={`text-xs leading-relaxed ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                &ldquo;{liveTranscript}<span className="animate-pulse">|</span>&rdquo;
              </p>
            ) : (
              <p className="text-[10px] opacity-50">Speak now...</p>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p className={`text-xs ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>Tap to start voice chat</p>
            <p className="text-[10px] opacity-40 mt-1">Continuous conversation mode</p>
          </div>
        )}
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
          isActive ? 'bg-green-400' : isLight ? 'bg-gray-300' : 'bg-gray-700'
        }`} />
        <span className={`text-[10px] transition-colors ${isLight ? 'text-gray-400' : 'text-gray-600'}`}>
          {isActive ? (isSpeaking ? 'Speaking' : isProcessing ? 'Thinking' : 'Listening') : 'Ready'}
        </span>
      </div>
    </div>
  );
}
