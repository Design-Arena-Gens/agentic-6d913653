"use client";

import { useState } from "react";
import SignLanguageInterpreter from "@/components/SignLanguageInterpreter";
import SettingsPanel from "@/components/SettingsPanel";
import { Settings } from "lucide-react";

export type SignLanguage = "ASL" | "ISL" | "BSL";

export interface GlobalSettings {
  sign_lang: SignLanguage;
  avatar_style: string;
  safety_mode: boolean;
  latency: "low" | "medium" | "high";
  fallback: boolean;
}

export default function Home() {
  const [settings, setSettings] = useState<GlobalSettings>({
    sign_lang: "ASL",
    avatar_style: "anime",
    safety_mode: true,
    latency: "low",
    fallback: true,
  });
  const [showSettings, setShowSettings] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Sign Language Interpreter
            </h1>
            <p className="text-gray-300">
              Real-time speech to sign language animation
            </p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-6 h-6" />
          </button>
        </header>

        {showSettings && (
          <SettingsPanel
            settings={settings}
            onSettingsChange={setSettings}
            onClose={() => setShowSettings(false)}
          />
        )}

        <SignLanguageInterpreter settings={settings} />
      </div>
    </main>
  );
}
