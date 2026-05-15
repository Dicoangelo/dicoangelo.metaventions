"use client";

import { useState, useRef, useCallback } from "react";

export interface UseDeepgramSTTReturn {
  isListening: boolean;
  transcript: string;
  error: string | null;
  start: () => Promise<void>;
  stop: () => Promise<string>;
  isAvailable: boolean;
}

/**
 * Full nova-3 streaming STT.
 *
 * Auth: short-lived bearer tokens minted by /api/deepgram-token (no master key in browser).
 * Model: nova-3 with smart_format, numerals, vad_events, utterance_end_ms.
 * Bias: keyterm priming for Dico-specific vocabulary so names + brand transcribe correctly.
 * Endpointing: Deepgram-side UtteranceEnd is the primary trigger; the JS silence timer
 *   is a backstop in case the WS message is dropped.
 */
const DEEPGRAM_PARAMS = new URLSearchParams({
  model: "nova-3",
  language: "en-US",
  smart_format: "true",
  interim_results: "true",
  endpointing: "300",
  utterance_end_ms: "600",
  vad_events: "true",
  numerals: "true",
  filler_words: "false",
  diarize: "false",
});

const KEYTERMS = [
  "Dico",
  "Dico Angelo",
  "Antigravity",
  "Metaventions",
  "Contentsquare",
  "UCW",
  "FriendlyFace",
  "ResearchGravity",
];
KEYTERMS.forEach((term) => DEEPGRAM_PARAMS.append("keyterm", term));

const DEEPGRAM_WS_URL = `wss://api.deepgram.com/v1/listen?${DEEPGRAM_PARAMS.toString()}`;

export function useDeepgramSTT(
  onPartialTranscript?: (text: string, isFinal: boolean) => void,
  onSilenceDetected?: (finalTranscript: string) => void,
  silenceTimeout = 600
): UseDeepgramSTTReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);

  const socketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptRef = useRef("");

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const resetSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      if (transcriptRef.current.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
        onSilenceDetected?.(transcriptRef.current.trim());
      }
    }, silenceTimeout);
  }, [clearSilenceTimer, silenceTimeout, onSilenceDetected]);

  const fireUtteranceEnd = useCallback(() => {
    clearSilenceTimer();
    if (transcriptRef.current.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
      onSilenceDetected?.(transcriptRef.current.trim());
    }
  }, [clearSilenceTimer, onSilenceDetected]);

  const start = useCallback(async () => {
    setError(null);
    setTranscript("");
    transcriptRef.current = "";

    try {
      const res = await fetch("/api/deepgram-token");
      if (!res.ok) {
        setIsAvailable(false);
        throw new Error("Failed to get Deepgram token");
      }
      const { token } = (await res.json()) as { token: string; expiresIn: number };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Bearer subprotocol — short-lived scoped token, not the master API key.
      const socket = new WebSocket(DEEPGRAM_WS_URL, ["bearer", token]);
      socketRef.current = socket;

      socket.onopen = () => {
        setIsListening(true);

        const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        };

        mediaRecorder.start(100);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Deepgram emits multiple event types when vad_events + utterance_end_ms are on.
          if (data.type === "UtteranceEnd") {
            fireUtteranceEnd();
            return;
          }
          if (data.type === "SpeechStarted") {
            // Could surface this for orb animation in the future.
            return;
          }

          const transcriptText = data.channel?.alternatives?.[0]?.transcript || "";
          const isFinal = data.is_final;
          const speechFinal = data.speech_final;

          if (transcriptText) {
            if (isFinal) {
              transcriptRef.current = (transcriptRef.current + " " + transcriptText).trim();
              setTranscript(transcriptRef.current);
              onPartialTranscript?.(transcriptRef.current, true);
              resetSilenceTimer();
            } else {
              const displayTranscript = (transcriptRef.current + " " + transcriptText).trim();
              setTranscript(displayTranscript);
              onPartialTranscript?.(displayTranscript, false);
              resetSilenceTimer();
            }
          }

          if (speechFinal && transcriptRef.current.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
            clearSilenceTimer();
            onSilenceDetected?.(transcriptRef.current.trim());
          }
        } catch (e) {
          console.error("[Deepgram] Parse error:", e);
        }
      };

      socket.onerror = (e) => {
        console.error("[Deepgram] WebSocket error:", e);
        setError("Connection error");
        setIsAvailable(false);
      };

      socket.onclose = () => {
        setIsListening(false);
      };
    } catch (e) {
      console.error("[Deepgram] Start error:", e);
      setError(e instanceof Error ? e.message : "Failed to start");
      setIsAvailable(false);
      throw e;
    }
  }, [onPartialTranscript, onSilenceDetected, resetSilenceTimer, clearSilenceTimer, fireUtteranceEnd]);

  const stop = useCallback(async (): Promise<string> => {
    clearSilenceTimer();

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (socketRef.current) {
      // Send CloseStream so Deepgram flushes any final transcripts before tearing down.
      if (socketRef.current.readyState === WebSocket.OPEN) {
        try {
          socketRef.current.send(JSON.stringify({ type: "CloseStream" }));
        } catch {
          /* noop */
        }
        socketRef.current.close();
      }
      socketRef.current = null;
    }

    setIsListening(false);
    return transcriptRef.current;
  }, [clearSilenceTimer]);

  return {
    isListening,
    transcript,
    error,
    start,
    stop,
    isAvailable,
  };
}
