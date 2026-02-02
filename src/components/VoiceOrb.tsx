"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";

// Dynamic import for 3D orb
const ThreeOrb = dynamic(() => import("./ThreeVoiceOrb"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full animate-pulse" />
});
import { useDeepgramSTT } from "@/hooks/useDeepgramSTT";

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
  const [useDeepgram, setUseDeepgram] = useState(true);

  // Live transcription
  const [liveTranscript, setLiveTranscript] = useState("");
  const [lastResponse, setLastResponse] = useState("");
  const [showResponse, setShowResponse] = useState(false);

  // Deepgram STT hook
  const {
    isListening: deepgramListening,
    transcript: deepgramTranscript,
    error: deepgramError,
    start: startDeepgram,
    stop: stopDeepgram,
    isAvailable: deepgramAvailable,
  } = useDeepgramSTT(
    (text, isFinal) => {
      // Only update transcript if Deepgram is the active STT
      if (activeSTTRef.current === "deepgram") {
        setLiveTranscript(text);
      }
    },
    (finalTranscript) => {
      // Auto-process when Deepgram detects end of speech
      // Only process if Deepgram is active and not already processing
      if (activeSTTRef.current === "deepgram" && finalTranscript.trim() && !isProcessingRef.current) {
        processVoice(finalTranscript.trim());
      }
    },
    1200
  );

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
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef(false); // Sync guard to prevent double-processing
  const activeSTTRef = useRef<"deepgram" | "webspeech" | null>(null); // Track which STT is active

  // Check browser support
  useEffect(() => {
    const SpeechAPI = getSpeechRecognition();
    setSupported(!!SpeechAPI || deepgramAvailable);
  }, [deepgramAvailable]);

  // Sync Deepgram listening state
  useEffect(() => {
    if (deepgramListening) {
      setIsListening(true);
    }
  }, [deepgramListening]);

  // Sync Deepgram transcript
  useEffect(() => {
    if (deepgramTranscript && useDeepgram) {
      setLiveTranscript(deepgramTranscript);
    }
  }, [deepgramTranscript, useDeepgram]);

  // Handle Deepgram errors
  useEffect(() => {
    if (deepgramError) {
      console.log("[VoiceOrb] Deepgram error, falling back to Web Speech");
      setUseDeepgram(false);
    }
  }, [deepgramError]);

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
      }, 60); // Reduced from 30ms to 60ms (16 FPS instead of 33 FPS) - imperceptible to human eye, 50% CPU savings
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

  // Start listening (Deepgram with Web Speech API fallback)
  const startListening = useCallback(async () => {
    setError(null);
    setLiveTranscript("");
    setShowResponse(false);
    await initMicAnalyser();

    // Try Deepgram first
    if (useDeepgram && deepgramAvailable) {
      try {
        activeSTTRef.current = "deepgram";
        await startDeepgram();
        setIsListening(true);
        return;
      } catch (e) {
        console.log("[VoiceOrb] Deepgram failed, falling back to Web Speech API");
        activeSTTRef.current = null;
        setUseDeepgram(false);
      }
    }

    // Fallback to Web Speech API
    const SpeechRecognitionAPI = getSpeechRecognition();
    if (!SpeechRecognitionAPI) {
      setError("Voice not supported");
      return;
    }

    activeSTTRef.current = "webspeech";
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

      // Auto-send after silence (only if Web Speech API is the active STT)
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = setTimeout(() => {
        if (activeSTTRef.current === "webspeech" && finalTranscript.trim() && Date.now() - lastSpeechTime >= 1200 && !isProcessingRef.current) {
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
  }, [initMicAnalyser, cleanupMic, isListening, isProcessing, isSpeaking, useDeepgram, deepgramAvailable, startDeepgram]);

  // Process voice input
  const processVoice = useCallback(async (text: string) => {
    // Guard: Use ref for synchronous check to prevent double-processing
    if (isProcessingRef.current || isSpeaking) {
      console.log("[VoiceOrb] Skipping - already processing or speaking");
      return;
    }
    isProcessingRef.current = true; // Set immediately to block concurrent calls

    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    activeSTTRef.current = null; // Clear active STT

    // Stop Deepgram
    if (deepgramListening) {
      await stopDeepgram();
    }

    // Stop Web Speech API
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    cleanupMic();
    setIsListening(false);
    setIsProcessing(true);
    // isProcessingRef.current already set above

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

      // Speak THEN clear guard (prevents race condition)
      await speakResponse(fullResponse);
      isProcessingRef.current = false;

      // Auto-restart listening after TTS completes (1.5s delay to avoid echo feedback)
      setTimeout(() => {
        if (!isListening && !isSpeaking) startListening();
      }, 1500);
    } catch {
      setIsProcessing(false);
      isProcessingRef.current = false;
      setError("Failed to respond");
    }
  }, [cleanupMic, startListening, isListening, isSpeaking, conversationHistory, onAddToHistory, deepgramListening, stopDeepgram]);

  // Speak with TTS
  const speakResponse = async (text: string) => {
    // Stop any currently playing audio first
    if (currentAudioRef.current) {
      try { currentAudioRef.current.stop(); } catch { }
      currentAudioRef.current = null;
    }
    if (ttsAnimationRef.current) {
      cancelAnimationFrame(ttsAnimationRef.current);
      ttsAnimationRef.current = null;
    }
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
    } catch (err) {
      // ElevenLabs failed - no fallback, just stop speaking
      console.error("[VoiceOrb] ElevenLabs TTS failed:", err);
      setIsSpeaking(false);
    }
  };

  // Stop/Interrupt everything
  const stopAll = useCallback(() => {
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

    // Stop Deepgram
    if (deepgramListening) {
      stopDeepgram();
    }

    // Stop Web Speech API
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    if (currentAudioRef.current) {
      try { currentAudioRef.current.stop(); } catch { }
      currentAudioRef.current = null;
    }
    if (ttsAnimationRef.current) {
      cancelAnimationFrame(ttsAnimationRef.current);
      ttsAnimationRef.current = null;
    }
    ttsAnalyserRef.current = null;
    cleanupMic();
    setIsListening(false);
    setIsSpeaking(false);
    setIsProcessing(false);
    isProcessingRef.current = false;
    activeSTTRef.current = null;
    setLiveTranscript("");
  }, [cleanupMic, deepgramListening, stopDeepgram]);

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

  // Calculate visual amplitude for the 3D orb
  const visualAmplitude = isSpeaking
    ? dicoFrequencies.reduce((a, b) => a + b, 0) / dicoFrequencies.length
    : isListening
      ? userAmplitude
      : isProcessing
        ? 150 // fixed high amplitude for 'thinking' state
        : 0;

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
    <div className="flex flex-col items-center gap-2 w-full max-w-[320px] mx-auto">
      {/* 3D Orb Container */}
      <div className="relative w-full max-w-[300px] aspect-square flex items-center justify-center">
        <div className="absolute inset-0">
          <ThreeOrb
            amplitude={visualAmplitude}
            isListening={isListening}
            isSpeaking={isSpeaking}
            isProcessing={isProcessing}
          />
        </div>

        {/* Clickable overlay */}
        <button
          onClick={handleClick}
          className="absolute inset-0 z-10 w-full h-full cursor-pointer focus:outline-none"
          aria-label={isActive ? "Stop voice chat" : "Start voice chat"}
        />

        {/* Center headshot - overlay on orb */}
        <div className="pointer-events-none z-20 relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-white/20 shadow-xl">
          <Image
            src="/headshot-ama.jpg"
            alt="Dico"
            fill
            className="object-cover"
            loading="lazy"
            quality={75}
          />
          {/* Overlay gradient for blend effect */}
          <div className={`absolute inset-0 transition-opacity duration-300 ${
            isActive
              ? 'bg-gradient-to-t from-[#6366f1]/30 to-transparent'
              : 'bg-gradient-to-t from-black/20 to-transparent'
          }`} />
        </div>
      </div>

      {/* Live transcription area */}
      <div className={`w-full min-h-[80px] rounded-xl p-3 transition-all duration-300 z-20 backdrop-blur-sm ${isLight ? 'bg-gray-100/80 border border-gray-200' : 'bg-white/5 border border-white/10'
        }`}>
        {error ? (
          <p className="text-red-400 text-xs text-center">{error}</p>
        ) : isSpeaking ? (
          <div className="text-center">
            <p className="text-xs font-medium mb-1 text-indigo-500 dark:text-indigo-400">Dico is speaking</p>
            <p className="text-[10px] opacity-60">Tap orb to interrupt</p>
            {showResponse && (
              <p className={`text-xs mt-2 leading-relaxed line-clamp-3 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                {lastResponse.slice(0, 150)}{lastResponse.length > 150 ? '...' : ''}
              </p>
            )}
          </div>
        ) : isProcessing ? (
          <div className="text-center">
            <p className="text-xs font-medium animate-pulse text-yellow-600 dark:text-yellow-500">Processing...</p>
          </div>
        ) : isListening ? (
          <div className="text-center">
            <p className="text-xs font-medium mb-1 text-green-600 dark:text-green-500">Listening</p>
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
            <p className={`text-xs ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>Tap the orb to chat</p>
            <p className="text-[10px] opacity-40 mt-1">Ai Voice Interface</p>
          </div>
        )}
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isActive ? 'bg-green-400' : isLight ? 'bg-gray-300' : 'bg-gray-700'
          }`} />
        <span className={`text-[10px] transition-colors ${isLight ? 'text-gray-400' : 'text-gray-600'}`}>
          {isActive ? (isSpeaking ? 'Speaking' : isProcessing ? 'Thinking' : 'Listening') : 'Ready'}
        </span>
        {isListening && (
          <span className={`text-[8px] px-1.5 py-0.5 rounded ${useDeepgram && deepgramAvailable ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
            }`}>
            {useDeepgram && deepgramAvailable ? 'Deepgram' : 'Browser'}
          </span>
        )}
      </div>
    </div>
  );
}
