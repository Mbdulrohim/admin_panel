"use client";

import { useState } from "react";

type Settings = {
  notifications: boolean;
  darkMode: boolean;
  language: "en" | "es" | "fr" | "de";
  privacy: "public" | "private" | "friends";
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    darkMode: false,
    language: "en",
    privacy: "public",
  });

  const handleToggle = (field: keyof Settings) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSelectChange = (field: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const saveSettings = () => {
    // Perform saving logic here (e.g., API call)
    alert("Settings Saved!");
  };

  return (
    <div className="p-8 bg-gray-100 h-screen flex flex-col items-center">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h1>
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
        {/* Notification Settings */}
        <div className="mb-4 flex justify-between items-center">
          <label className="text-gray-700 font-medium">Enable Notifications</label>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={() => handleToggle("notifications")}
            className="w-5 h-5"
          />
        </div>

        {/* Dark Mode Settings */}
        <div className="mb-4 flex justify-between items-center">
          <label className="text-gray-700 font-medium">Dark Mode</label>
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={() => handleToggle("darkMode")}
            className="w-5 h-5"
          />
        </div>

        {/* Language Settings */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Language</label>
          <select
            value={settings.language}
            onChange={(e) =>
              handleSelectChange("language", e.target.value as Settings["language"])
            }
            className="w-full p-2 border border-gray-300 rounded-sm"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        {/* Privacy Settings */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Privacy</label>
          <select
            value={settings.privacy}
            onChange={(e) =>
              handleSelectChange("privacy", e.target.value as Settings["privacy"])
            }
            className="w-full p-2 border border-gray-300 rounded-sm"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="friends">Friends Only</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={saveSettings}
          className="bg-green-600 text-white px-6 py-2 rounded-sm w-full hover:bg-green-700 transition"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
