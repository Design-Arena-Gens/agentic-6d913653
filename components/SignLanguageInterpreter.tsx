"use client";

import { useState, useEffect, useRef } from "react";
import { GlobalSettings } from "@/app/page";
import { Mic, MicOff, AlertCircle } from "lucide-react";
import AnimeAvatar from "./AnimeAvatar";
import { processSpeechToSign } from "@/lib/signProcessor";
import { SignGloss, SafetyResult } from "@/lib/types";

interface SignLanguageInterpreterProps {
  settings: GlobalSettings;
}

export default function SignLanguageInterpreter({
  settings,
}: SignLanguageInterpreterProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [currentGloss, setCurrentGloss] = useState<SignGloss | null>(null);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [safetyAlert, setSafetyAlert] = useState<SafetyResult | null>(null);

  const recognitionRef = useRef<any>(null);
  const streamingBuffer = useRef<string>("");

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = settings.latency === "low";
      recognition.lang = "en-US";

      recognition.onresult = async (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          streamingBuffer.current += finalTranscript;
          setTranscript(streamingBuffer.current);
          await processText(streamingBuffer.current);
        } else if (interimTranscript && settings.latency === "low") {
          setTranscript(streamingBuffer.current + interimTranscript);
          await processText(streamingBuffer.current + interimTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start();
        }
      };

      recognitionRef.current = recognition;
    } else {
      setError("Speech recognition not supported in this browser. Please use Chrome or Edge.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [settings.latency]);

  const processText = async (text: string) => {
    try {
      const result = await processSpeechToSign(text, settings);

      if (result.safety && !result.safety.allowed) {
        setSafetyAlert(result.safety);
        setCaption(result.safety.message || "Content filtered by safety mode");
        setCurrentGloss(null);
        return;
      }

      setSafetyAlert(null);
      setCurrentGloss(result.gloss);
      setCaption(result.caption);
    } catch (err) {
      console.error("Processing error:", err);
      setError("Error processing speech");
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition not available");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      streamingBuffer.current = "";
      setTranscript("");
      setError(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-slate-800 rounded-xl shadow-xl p-6 border border-purple-500/30">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Speech Input</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></span>
              {isListening ? "Listening..." : "Inactive"}
            </div>
          </div>

          <button
            onClick={toggleListening}
            className={`w-full py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-3 ${
              isListening
                ? "bg-red-600 hover:bg-red-700"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Start Listening
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-500 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-200">{error}</div>
            </div>
          )}

          {safetyAlert && (
            <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-500 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-yellow-200 mb-1">
                    Safety Alert
                  </div>
                  <div className="text-sm text-yellow-100">
                    {safetyAlert.message}
                  </div>
                  {safetyAlert.resources && safetyAlert.resources.length > 0 && (
                    <div className="mt-2 text-xs text-yellow-200">
                      <div className="font-semibold mb-1">Resources:</div>
                      {safetyAlert.resources.map((resource, idx) => (
                        <div key={idx}>• {resource}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-800 rounded-xl shadow-xl p-6 border border-purple-500/30">
          <h3 className="text-lg font-semibold mb-3">Transcript</h3>
          <div className="bg-slate-900 rounded-lg p-4 min-h-[120px] max-h-[240px] overflow-y-auto">
            {transcript ? (
              <p className="text-gray-200 leading-relaxed">{transcript}</p>
            ) : (
              <p className="text-gray-500 italic">
                Click &quot;Start Listening&quot; to begin...
              </p>
            )}
          </div>
        </div>

        {currentGloss && (
          <div className="bg-slate-800 rounded-xl shadow-xl p-6 border border-purple-500/30">
            <h3 className="text-lg font-semibold mb-3">Sign Gloss ({settings.sign_lang})</h3>
            <div className="space-y-3">
              <div className="bg-slate-900 rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {currentGloss.signs.map((sign, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-md text-sm font-mono ${
                        sign.uncertain
                          ? "bg-yellow-900/30 text-yellow-200 border border-yellow-600"
                          : "bg-purple-900/30 text-purple-200"
                      }`}
                    >
                      {sign.sign}
                      {sign.fingerspell && " (FS)"}
                    </span>
                  ))}
                </div>
              </div>

              {currentGloss.nonManualMarkers && currentGloss.nonManualMarkers.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-400 mb-2">
                    Non-Manual Markers
                  </div>
                  <div className="bg-slate-900 rounded-lg p-3 flex flex-wrap gap-2">
                    {currentGloss.nonManualMarkers.map((marker, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-900/30 text-blue-200 rounded text-xs"
                      >
                        {marker}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-slate-800 rounded-xl shadow-xl p-6 border border-purple-500/30">
          <h2 className="text-xl font-semibold mb-4">Avatar Animation</h2>
          <div className="aspect-square bg-slate-900 rounded-lg overflow-hidden border-2 border-purple-500/20">
            <AnimeAvatar
              gloss={currentGloss}
              isActive={isListening}
              settings={settings}
            />
          </div>
        </div>

        {(settings.fallback || !currentGloss) && caption && (
          <div className="bg-slate-800 rounded-xl shadow-xl p-6 border border-purple-500/30">
            <h3 className="text-lg font-semibold mb-3">Caption</h3>
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-lg text-center leading-relaxed text-gray-200">
                {caption}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
