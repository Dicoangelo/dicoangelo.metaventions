"use client";

import { useState, useRef, useCallback, useEffect } from "react";

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
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognition;

function getSpeechRecognition(): SpeechRecognitionConstructor | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
}

export interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  transcript: string;
  error: string | null;
  supported: boolean;
}

export function useVoice() {
  const [state, setState] = useState<VoiceState>({
    isListening: false,
    isSpeaking: false,
    isProcessing: false,
    transcript: "",
    error: null,
    supported: false,
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Check for browser support on mount
  useEffect(() => {
    const SpeechRecognitionAPI = getSpeechRecognition();
    setState(prev => ({ ...prev, supported: !!SpeechRecognitionAPI }));
  }, []);

  // Initialize audio context (must be called after user interaction)
  const initAudio = useCallback(async () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioCtx();
    }
    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }
  }, []);

  // Start listening
  const startListening = useCallback(async (onTranscript?: (text: string, isFinal: boolean) => void) => {
    const SpeechRecognitionAPI = getSpeechRecognition();
    if (!SpeechRecognitionAPI) {
      setState(prev => ({ ...prev, error: "Speech recognition not supported" }));
      return;
    }

    await initAudio();

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
      setState(prev => ({ ...prev, transcript: combined }));

      if (onTranscript) {
        onTranscript(combined, event.results[event.results.length - 1]?.isFinal || false);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== "no-speech" && event.error !== "aborted") {
        console.error("Speech recognition error:", event.error);
        setState(prev => ({ ...prev, error: event.error, isListening: false }));
      }
    };

    recognition.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };

    recognition.onstart = () => {
      setState(prev => ({ ...prev, isListening: true, error: null, transcript: "" }));
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start recognition:", e);
      setState(prev => ({ ...prev, error: "Failed to start microphone" }));
    }
  }, [initAudio]);

  // Stop listening and return transcript
  const stopListening = useCallback((): string => {
    const transcript = state.transcript;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore
      }
      recognitionRef.current = null;
    }

    setState(prev => ({ ...prev, isListening: false }));
    return transcript;
  }, [state.transcript]);

  // Speak text using ElevenLabs API
  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return;

    await initAudio();
    setState(prev => ({ ...prev, isSpeaking: true }));

    try {
      // Call our API route for ElevenLabs TTS
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("TTS failed");
      }

      const arrayBuffer = await response.arrayBuffer();

      if (!audioContextRef.current) {
        throw new Error("Audio context not initialized");
      }

      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);

      currentSourceRef.current = source;

      return new Promise<void>((resolve) => {
        source.onended = () => {
          setState(prev => ({ ...prev, isSpeaking: false }));
          currentSourceRef.current = null;
          resolve();
        };
        source.start(0);
      });
    } catch (e) {
      console.error("TTS error:", e);
      // Fallback to browser TTS
      await speakBrowser(text);
    }
  }, [initAudio]);

  // Browser TTS fallback
  const speakBrowser = useCallback(async (text: string) => {
    if (!("speechSynthesis" in window)) {
      setState(prev => ({ ...prev, isSpeaking: false }));
      return;
    }

    setState(prev => ({ ...prev, isSpeaking: true }));

    return new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setState(prev => ({ ...prev, isSpeaking: false }));
        resolve();
      };

      utterance.onerror = () => {
        setState(prev => ({ ...prev, isSpeaking: false }));
        resolve();
      };

      speechSynthesis.speak(utterance);
    });
  }, []);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
      } catch (e) {
        // Ignore
      }
      currentSourceRef.current = null;
    }

    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
    }

    setState(prev => ({ ...prev, isSpeaking: false }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore
        }
      }
      if (currentSourceRef.current) {
        try {
          currentSourceRef.current.stop();
        } catch (e) {
          // Ignore
        }
      }
    };
  }, []);

  return {
    state,
    startListening,
    stopListening,
    speak,
    speakBrowser,
    stopSpeaking,
    initAudio,
  };
}
