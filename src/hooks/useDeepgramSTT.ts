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

export function useDeepgramSTT(
  onPartialTranscript?: (text: string, isFinal: boolean) => void,
  onSilenceDetected?: (finalTranscript: string) => void,
  silenceTimeout = 1200
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
      // Only fire if still listening and no error
      if (transcriptRef.current.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
        onSilenceDetected?.(transcriptRef.current.trim());
      }
    }, silenceTimeout);
  }, [clearSilenceTimer, silenceTimeout, onSilenceDetected]);

  const start = useCallback(async () => {
    setError(null);
    setTranscript("");
    transcriptRef.current = "";

    try {
      // Fetch API key
      const res = await fetch("/api/deepgram-token");
      if (!res.ok) {
        setIsAvailable(false);
        throw new Error("Failed to get Deepgram token");
      }
      const { key } = await res.json();

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Connect to Deepgram WebSocket
      const socket = new WebSocket(
        `wss://api.deepgram.com/v1/listen?model=nova-2&punctuate=true&interim_results=true&endpointing=300`,
        ["token", key]
      );
      socketRef.current = socket;

      socket.onopen = () => {
        setIsListening(true);

        // Start MediaRecorder
        const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        };

        mediaRecorder.start(100); // Send chunks every 100ms
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const transcript = data.channel?.alternatives?.[0]?.transcript || "";
          const isFinal = data.is_final;
          const speechFinal = data.speech_final;

          if (transcript) {
            if (isFinal) {
              transcriptRef.current += " " + transcript;
              transcriptRef.current = transcriptRef.current.trim();
              setTranscript(transcriptRef.current);
              onPartialTranscript?.(transcriptRef.current, true);
              resetSilenceTimer();
            } else {
              const displayTranscript = transcriptRef.current + " " + transcript;
              setTranscript(displayTranscript.trim());
              onPartialTranscript?.(displayTranscript.trim(), false);
              resetSilenceTimer();
            }
          }

          // Deepgram's speech_final indicates end of utterance
          // Only fire if socket is still open (not errored/closed)
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
  }, [onPartialTranscript, onSilenceDetected, resetSilenceTimer, clearSilenceTimer]);

  const stop = useCallback(async (): Promise<string> => {
    clearSilenceTimer();

    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Close WebSocket
    if (socketRef.current) {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
      socketRef.current = null;
    }

    setIsListening(false);
    const finalTranscript = transcriptRef.current;
    return finalTranscript;
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
