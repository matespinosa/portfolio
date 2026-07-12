"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechResult = {
  0: { transcript: string };
  isFinal: boolean;
};

type SpeechResultList = {
  length: number;
  [index: number]: SpeechResult;
};

type SpeechRecognitionEventLike = Event & {
  results: SpeechResultList;
};

type SpeechRecognitionErrorEventLike = Event & {
  error: string;
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

type Options = {
  onTranscript: (value: string) => void;
};

const ERROR_MESSAGES: Record<string, string> = {
  "not-allowed": "Activa el permiso del micrófono para usar la voz.",
  "service-not-allowed": "El navegador bloqueó el reconocimiento de voz.",
  "audio-capture": "No encontré un micrófono disponible.",
  "no-speech": "No alcancé a oírte. Intenta de nuevo.",
  network: "La función de voz necesita conexión a internet.",
};

export function useSpeechRecognition({ onTranscript }: Options) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const prefixRef = useRef("");
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) return;

    setSupported(true);
    const recognition = new Recognition();
    recognition.lang = "es-CO";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let spoken = "";
      for (let i = 0; i < event.results.length; i += 1) {
        spoken += event.results[i][0]?.transcript ?? "";
      }
      const value = [prefixRef.current.trim(), spoken.trim()].filter(Boolean).join(" ");
      onTranscriptRef.current(value);
    };
    recognition.onerror = (event) => {
      setError(ERROR_MESSAGES[event.error] ?? "No pude activar la voz. Intenta de nuevo.");
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
  }, []);

  const start = useCallback((currentValue = "") => {
    if (!recognitionRef.current) return;
    prefixRef.current = currentValue;
    setError(null);
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      setError("El micrófono ya está activo.");
    }
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { supported, listening, error, start, stop };
}
