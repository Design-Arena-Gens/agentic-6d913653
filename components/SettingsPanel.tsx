"use client";

import { GlobalSettings, SignLanguage } from "@/app/page";
import { X } from "lucide-react";

interface SettingsPanelProps {
  settings: GlobalSettings;
  onSettingsChange: (settings: GlobalSettings) => void;
  onClose: () => void;
}

export default function SettingsPanel({
  settings,
  onSettingsChange,
  onClose,
}: SettingsPanelProps) {
  const handleChange = (key: keyof GlobalSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-slate-800 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-purple-500/30">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Global Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Sign Language
            </label>
            <select
              value={settings.sign_lang}
              onChange={(e) =>
                handleChange("sign_lang", e.target.value as SignLanguage)
              }
              className="w-full px-4 py-2 bg-slate-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="ASL">ASL (American Sign Language)</option>
              <option value="ISL">ISL (Indian Sign Language)</option>
              <option value="BSL">BSL (British Sign Language)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Avatar Style
            </label>
            <input
              type="text"
              value={settings.avatar_style}
              onChange={(e) => handleChange("avatar_style", e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Latency</label>
            <select
              value={settings.latency}
              onChange={(e) => handleChange("latency", e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="low">Low (faster, streaming)</option>
              <option value="medium">Medium (balanced)</option>
              <option value="high">High (more accurate)</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div>
              <div className="font-medium">Safety Mode</div>
              <div className="text-sm text-gray-400">
                Filter inappropriate content
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.safety_mode}
                onChange={(e) => handleChange("safety_mode", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div>
              <div className="font-medium">Caption Fallback</div>
              <div className="text-sm text-gray-400">
                Always show text captions
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.fallback}
                onChange={(e) => handleChange("fallback", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
