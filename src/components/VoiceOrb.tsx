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

// Particle type
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
  hue: number;
}

// Color palette
const COLORS = {
  cyan: "#18E6FF",
  purple: "#9d4edd",
  magenta: "#ff006e",
  gold: "#ffd60a",
  cyanGlow: "rgba(24, 230, 255, 0.5)",
  purpleGlow: "rgba(157, 78, 221, 0.5)",
};

export default function VoiceOrb({ onTranscript, onResponse, isProcessing }: VoiceOrbProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [displayedTranscript, setDisplayedTranscript] = useState("");
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ripples, setRipples] = useState<number[]>([]);
  const [conversationCount, setConversationCount] = useState(0);

  // Frequency data for visualizers
  const [userFrequencies, setUserFrequencies] = useState<number[]>(new Array(32).fill(0));
  const [dicoFrequencies, setDicoFrequencies] = useState<number[]>(new Array(64).fill(0));
  const [avgAmplitude, setAvgAmplitude] = useState(0);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const micAnimationRef = useRef<number | null>(null);
  const currentAudioRef = useRef<AudioBufferSourceNode | null>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const userCanvasRef = useRef<HTMLCanvasElement>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const ttsAnalyserRef = useRef<AnalyserNode | null>(null);
  const ttsAnimationRef = useRef<number | null>(null);
  const orbRef = useRef<HTMLButtonElement>(null);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  // Check browser support
  useEffect(() => {
    const SpeechAPI = getSpeechRecognition();
    setSupported(!!SpeechAPI);
    if (!SpeechAPI) {
      setError("Voice not supported. Try Chrome or Edge.");
    }
  }, []);

  // Typewriter effect for transcript
  useEffect(() => {
    if (!transcript) {
      setDisplayedTranscript("");
      return;
    }

    let index = displayedTranscript.length;
    if (index >= transcript.length) return;

    const timer = setTimeout(() => {
      setDisplayedTranscript(transcript.slice(0, index + 1));
    }, 30);

    return () => clearTimeout(timer);
  }, [transcript, displayedTranscript]);

  // Ripple effect generator
  useEffect(() => {
    if (!isSpeaking && !isListening) return;

    const interval = setInterval(() => {
      setRipples(prev => {
        const newRipples = [...prev, Date.now()].filter(t => Date.now() - t < 2000);
        return newRipples.slice(-5);
      });
    }, isSpeaking ? 400 : 600);

    return () => clearInterval(interval);
  }, [isSpeaking, isListening]);

  // Main canvas - visualizer, particles, and effects
  useEffect(() => {
    const canvas = mainCanvasRef.current;
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

    let animationId: number;
    let time = 0;

    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;

      // Calculate average amplitude
      const avg = dicoFrequencies.reduce((a, b) => a + b, 0) / dicoFrequencies.length;

      // Draw ripples
      ripples.forEach(startTime => {
        const age = (Date.now() - startTime) / 2000;
        const radius = 60 + age * 80;
        const alpha = (1 - age) * 0.3;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = isSpeaking
          ? `rgba(157, 78, 221, ${alpha})`
          : `rgba(24, 230, 255, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Update and draw particles
      if (isSpeaking || isListening) {
        // Spawn new particles
        if (Math.random() < (isSpeaking ? 0.3 : 0.15)) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 50 + Math.random() * 20;
          particlesRef.current.push({
            x: cx + Math.cos(angle) * dist,
            y: cy + Math.sin(angle) * dist,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 0.5,
            radius: 1 + Math.random() * 2,
            life: 1,
            maxLife: 60 + Math.random() * 60,
            hue: isSpeaking ? 280 : 185,
          });
        }
      }

      // Update particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.02; // Float upward
        p.life -= 1;

        if (p.life <= 0) return false;

        const alpha = Math.min(1, p.life / 30);
        const sat = isSpeaking ? "70%" : "100%";
        const light = isSpeaking ? "65%" : "60%";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * alpha, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, ${sat}, ${light}, ${alpha * 0.8})`;
        ctx.fill();

        return true;
      });

      // Keep particle count manageable
      if (particlesRef.current.length > 100) {
        particlesRef.current = particlesRef.current.slice(-100);
      }

      // Draw frequency bars (circular)
      const barCount = 64;
      const innerRadius = 52;
      const maxBarHeight = 35;

      for (let i = 0; i < barCount; i++) {
        const freqIndex = Math.floor((i / barCount) * dicoFrequencies.length);
        const value = dicoFrequencies[freqIndex] / 255;
        const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
        const barHeight = value * maxBarHeight + 3;

        const x1 = cx + Math.cos(angle) * innerRadius;
        const y1 = cy + Math.sin(angle) * innerRadius;
        const x2 = cx + Math.cos(angle) * (innerRadius + barHeight);
        const y2 = cy + Math.sin(angle) * (innerRadius + barHeight);

        // Dynamic color based on state
        const hue = isSpeaking
          ? 280 + (i / barCount) * 40
          : isListening
            ? 180 + (i / barCount) * 20
            : 220;
        const sat = isSpeaking || isListening ? "80%" : "20%";
        const light = isSpeaking || isListening ? "60%" : "40%";
        const alpha = isSpeaking || isListening ? 0.4 + value * 0.6 : 0.1 + value * 0.15;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsla(${hue}, ${sat}, ${light}, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // Inner breathing glow ring
      const breathe = Math.sin(time * 2) * 0.15 + 0.85;
      const glowRadius = innerRadius - 4;

      if (isSpeaking || isListening || isThinking) {
        const gradient = ctx.createRadialGradient(cx, cy, glowRadius - 5, cx, cy, glowRadius + 5);
        const baseColor = isSpeaking ? "157, 78, 221" : isThinking ? "255, 0, 110" : "24, 230, 255";
        gradient.addColorStop(0, `rgba(${baseColor}, 0)`);
        gradient.addColorStop(0.5, `rgba(${baseColor}, ${0.3 * breathe})`);
        gradient.addColorStop(1, `rgba(${baseColor}, 0)`);

        ctx.beginPath();
        ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 10;
        ctx.stroke();
      }

      // Orbiting dots when thinking
      if (isThinking) {
        for (let i = 0; i < 3; i++) {
          const orbitAngle = time * 3 + (i * Math.PI * 2) / 3;
          const orbitRadius = 70;
          const dotX = cx + Math.cos(orbitAngle) * orbitRadius;
          const dotY = cy + Math.sin(orbitAngle) * orbitRadius;

          ctx.beginPath();
          ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${300 + i * 30}, 80%, 60%, 0.8)`;
          ctx.fill();

          // Trail
          for (let j = 1; j <= 5; j++) {
            const trailAngle = orbitAngle - j * 0.1;
            const trailX = cx + Math.cos(trailAngle) * orbitRadius;
            const trailY = cy + Math.sin(trailAngle) * orbitRadius;
            ctx.beginPath();
            ctx.arc(trailX, trailY, 4 - j * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${300 + i * 30}, 80%, 60%, ${0.5 - j * 0.09})`;
            ctx.fill();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [dicoFrequencies, isSpeaking, isListening, isThinking, ripples, isLight]);

  // Draw user's small visualizer (waveform style)
  useEffect(() => {
    const canvas = userCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 160;
    const height = 50;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (!isListening) {
        // Flatline when not listening
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.strokeStyle = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)";
        ctx.lineWidth = 2;
        ctx.stroke();
        animationId = requestAnimationFrame(draw);
        return;
      }

      // Draw waveform
      ctx.beginPath();
      ctx.moveTo(0, height / 2);

      const barCount = 32;
      for (let i = 0; i < barCount; i++) {
        const value = userFrequencies[i] / 255;
        const x = (i / barCount) * width;
        const amplitude = value * (height * 0.4);
        const y = height / 2 + (i % 2 === 0 ? -amplitude : amplitude);
        ctx.lineTo(x, y);
      }

      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, COLORS.cyan);
      gradient.addColorStop(1, "rgba(24, 230, 255, 0.3)");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // Glow effect
      ctx.shadowColor = COLORS.cyan;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [userFrequencies, isListening, isLight]);

  // Animate Dico's frequencies (only when not using real TTS audio)
  useEffect(() => {
    let interval: NodeJS.Timeout;

    // When speaking with TTS analyser, frequencies come from updateTtsFrequencies
    if (isSpeaking && ttsAnalyserRef.current) {
      // Real audio analysis is active, don't animate
      return;
    }

    if (isSpeaking) {
      // Fallback animation when TTS analyser not available
      interval = setInterval(() => {
        setDicoFrequencies(prev =>
          prev.map((_, i) => {
            const base = Math.sin(Date.now() / 120 + i * 0.5) * 70 + 130;
            const variance = Math.random() * 80;
            return Math.min(255, Math.max(0, base + variance));
          })
        );
      }, 33);
    } else if (isThinking) {
      interval = setInterval(() => {
        setDicoFrequencies(prev =>
          prev.map((_, i) => {
            const wave = Math.sin(Date.now() / 200 + i * 0.3) * 40 + 60;
            return Math.min(255, Math.max(0, wave));
          })
        );
      }, 50);
    } else if (isListening) {
      interval = setInterval(() => {
        setDicoFrequencies(prev =>
          prev.map((_, i) => Math.sin(Date.now() / 800 + i * 0.2) * 20 + 30)
        );
      }, 80);
    } else {
      // Gentle idle pulse
      interval = setInterval(() => {
        setDicoFrequencies(prev =>
          prev.map((_, i) => Math.sin(Date.now() / 2000 + i * 0.1) * 10 + 15)
        );
      }, 120);
    }

    return () => clearInterval(interval);
  }, [isSpeaking, isThinking, isListening]);

  // Update user frequencies from mic
  const updateMicFrequencies = useCallback(() => {
    if (!analyserRef.current || !isListening) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const freqs = Array.from(dataArray.slice(0, 32));
    setUserFrequencies(freqs);
    setAvgAmplitude(freqs.reduce((a, b) => a + b, 0) / freqs.length);

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
    setAvgAmplitude(0);
  }, []);

  // Start listening
  const startListening = useCallback(async () => {
    const SpeechRecognitionAPI = getSpeechRecognition();
    if (!SpeechRecognitionAPI) return;

    setError(null);
    setTranscript("");
    setDisplayedTranscript("");
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
        try {
          recognition.start();
        } catch {
          cleanupMic();
          setIsListening(false);
        }
      }
    };

    recognition.onstart = () => {
      setIsListening(true);
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
      setConversationCount(c => c + 1);

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

  // Update Dico frequencies from TTS audio
  const updateTtsFrequencies = useCallback(() => {
    if (!ttsAnalyserRef.current) return;

    const dataArray = new Uint8Array(ttsAnalyserRef.current.frequencyBinCount);
    ttsAnalyserRef.current.getByteFrequencyData(dataArray);

    // Map the frequency data to our visualizer
    const freqs = Array.from(dataArray.slice(0, 64));
    setDicoFrequencies(freqs);

    ttsAnimationRef.current = requestAnimationFrame(updateTtsFrequencies);
  }, []);

  // Speak response with ElevenLabs + real-time audio analysis
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

      // Create analyser for real-time frequency visualization
      ttsAnalyserRef.current = audioContextRef.current.createAnalyser();
      ttsAnalyserRef.current.fftSize = 128;

      // Connect: source -> analyser -> destination
      source.connect(ttsAnalyserRef.current);
      ttsAnalyserRef.current.connect(audioContextRef.current.destination);

      currentAudioRef.current = source;

      // Start real-time frequency updates
      updateTtsFrequencies();

      source.onended = () => {
        // Stop frequency updates
        if (ttsAnimationRef.current) {
          cancelAnimationFrame(ttsAnimationRef.current);
          ttsAnimationRef.current = null;
        }
        ttsAnalyserRef.current = null;
        setIsSpeaking(false);
        currentAudioRef.current = null;
        // Reset to idle frequencies
        setDicoFrequencies(new Array(64).fill(15));
      };

      source.start(0);
    } catch (e) {
      console.error("TTS error:", e);
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
    if (ttsAnimationRef.current) {
      cancelAnimationFrame(ttsAnimationRef.current);
      ttsAnimationRef.current = null;
    }
    ttsAnalyserRef.current = null;
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
    }
    cleanupMic();
    setIsListening(false);
    setIsSpeaking(false);
    setIsThinking(false);
    setTranscript("");
    setDisplayedTranscript("");
    particlesRef.current = [];
  }, [cleanupMic]);

  // Handle orb click
  const handleOrbClick = () => {
    if (isListening || isSpeaking || isThinking) {
      stopAll();
    } else {
      startListening();
    }
  };

  // 3D tilt effect on mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const maxTilt = 15;
    setTiltX((-y / (rect.height / 2)) * maxTilt);
    setTiltY((x / (rect.width / 2)) * maxTilt);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTiltX(0);
    setTiltY(0);
  }, []);

  if (!supported) {
    return (
      <div className={`text-center p-4 ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
        <p className="text-sm">Voice not supported in this browser.</p>
        <p className="text-xs mt-1">Try Chrome or Edge.</p>
      </div>
    );
  }

  const isActive = isListening || isSpeaking || isThinking;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: isActive
            ? isSpeaking
              ? `radial-gradient(ellipse at center, rgba(157, 78, 221, 0.08) 0%, transparent 60%)`
              : isThinking
                ? `radial-gradient(ellipse at center, rgba(255, 0, 110, 0.06) 0%, transparent 60%)`
                : `radial-gradient(ellipse at center, rgba(24, 230, 255, 0.06) 0%, transparent 60%)`
            : "transparent",
          opacity: isActive ? 1 : 0,
        }}
      />

      {/* Main Orb with Dico's face */}
      <div className="relative">
        {/* Main canvas for visualizer, particles, ripples */}
        <canvas
          ref={mainCanvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 280,
            height: 280
          }}
        />

        {/* Outer glow effect */}
        <div
          className={`absolute rounded-full transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}
          style={{
            width: 160,
            height: 160,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: isSpeaking
              ? `radial-gradient(circle, ${COLORS.purpleGlow} 0%, transparent 70%)`
              : isThinking
                ? `radial-gradient(circle, rgba(255, 0, 110, 0.4) 0%, transparent 70%)`
                : `radial-gradient(circle, ${COLORS.cyanGlow} 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
        />

        {/* Clickable orb with Dico's face - 3D tilt effect */}
        <button
          ref={orbRef}
          onClick={handleOrbClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          disabled={isProcessing}
          className={`relative w-28 h-28 rounded-full overflow-hidden z-10 ${
            isProcessing ? "opacity-50" : "cursor-pointer active:scale-95"
          }`}
          style={{
            transform: `perspective(500px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${isActive ? 1.02 : 1})`,
            transition: "transform 0.15s ease-out, box-shadow 0.3s ease, border 0.3s ease",
            boxShadow: isSpeaking
              ? `0 0 60px ${COLORS.purpleGlow}, 0 0 100px ${COLORS.purpleGlow}, inset 0 0 20px rgba(157, 78, 221, 0.3)`
              : isListening
                ? `0 0 60px ${COLORS.cyanGlow}, 0 0 100px ${COLORS.cyanGlow}, inset 0 0 20px rgba(24, 230, 255, 0.3)`
                : isThinking
                  ? `0 0 50px rgba(255, 0, 110, 0.4), 0 0 80px rgba(255, 0, 110, 0.3)`
                  : isLight ? "0 0 30px rgba(0,0,0,0.15)" : "0 0 30px rgba(255,255,255,0.1)",
            border: isSpeaking
              ? `3px solid ${COLORS.purple}`
              : isListening
                ? `3px solid ${COLORS.cyan}`
                : isThinking
                  ? `3px solid ${COLORS.magenta}`
                  : isLight ? "3px solid rgba(0,0,0,0.08)" : "3px solid rgba(255,255,255,0.08)",
          }}
        >
          <Image
            src="/headshot.png"
            alt="Dico"
            fill
            className="object-cover"
            priority
          />
        </button>
      </div>

      {/* User's voice visualizer */}
      <div className={`flex flex-col items-center transition-all duration-300 ${isListening ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-1'}`}>
        <canvas
          ref={userCanvasRef}
          style={{ width: 160, height: 50 }}
        />
        <div className="flex items-center gap-2 mt-1">
          {isListening && (
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.cyan }} />
          )}
          <span
            className="text-[10px] font-medium tracking-wider"
            style={{ color: isListening ? COLORS.cyan : (isLight ? "#aaa" : "#666") }}
          >
            {isListening ? "LISTENING" : "YOUR MIC"}
          </span>
        </div>
      </div>

      {/* Status and transcript */}
      <div className={`text-center min-h-[70px] max-w-[250px] ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
        {error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : isSpeaking ? (
          <div className="space-y-1">
            <p style={{ color: COLORS.purple }} className="text-sm font-medium flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.purple }} />
              Dico is speaking
            </p>
            <p className="text-[10px] opacity-50">Tap to interrupt</p>
          </div>
        ) : isThinking ? (
          <div className="space-y-1">
            <p style={{ color: COLORS.magenta }} className="text-sm font-medium">
              Processing...
            </p>
          </div>
        ) : isListening ? (
          <div className="space-y-2">
            <p style={{ color: COLORS.cyan }} className="text-sm font-medium">
              {displayedTranscript ? "Heard:" : "Listening..."}
            </p>
            {displayedTranscript && (
              <p className="text-xs opacity-80 leading-relaxed">
                &ldquo;{displayedTranscript}
                <span className="animate-pulse">|</span>&rdquo;
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm">Tap to start</p>
            {conversationCount > 0 && (
              <p className="text-[10px] opacity-40">{conversationCount} exchange{conversationCount !== 1 ? 's' : ''} so far</p>
            )}
          </div>
        )}
      </div>

      {/* Mode indicator */}
      <div className={`flex items-center gap-1.5 text-[10px] ${isLight ? 'text-gray-400' : 'text-gray-600'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-400' : (isLight ? 'bg-gray-300' : 'bg-gray-700')}`} />
        <span>Continuous voice mode</span>
      </div>
    </div>
  );
}
