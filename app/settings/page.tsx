'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import Navbar from '@/app/Navbar';

const inter = Inter({ subsets: ['latin'] });

interface Settings {
  leetcode_username: string | null;
  path_questions_per_day: number;
  review_interval_mode: 'short' | 'standard' | 'long';
  review_randomized: boolean;
  path_randomized: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    leetcode_username: '',
    path_questions_per_day: 3,
    review_interval_mode: 'standard',
    review_randomized: false,
    path_randomized: false,
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/settings', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSettings(data.settings);
        }
      } else if (response.status === 401) {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'An error occurred while saving settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`${inter.className} min-h-screen bg-gray-50 flex items-center justify-center`}>
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-light text-gray-900 mb-8">Settings</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* LeetCode Username */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-normal text-gray-900 mb-4">LeetCode Username</h2>
            <p className="text-sm text-gray-600 mb-4">
              Update your LeetCode username to view your stats from LeetCode.
            </p>
            <input
              type="text"
              value={settings.leetcode_username || ''}
              onChange={(e) => setSettings({ ...settings, leetcode_username: e.target.value })}
              placeholder="Enter your LeetCode username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Path Questions Per Day */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-normal text-gray-900 mb-4">Path Questions Per Day</h2>
            <p className="text-sm text-gray-600 mb-4">
              How many questions from your enrolled paths do you want to receive daily?
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                value={settings.path_questions_per_day}
                onChange={(e) => setSettings({ ...settings, path_questions_per_day: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-2xl font-light text-gray-900 w-12 text-center">
                {settings.path_questions_per_day}
              </span>
            </div>
          </div>

          {/* Review Interval Mode */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-normal text-gray-900 mb-4">Review Intervals</h2>
            <p className="text-sm text-gray-600 mb-4">
              Choose how often you want to review questions using spaced repetition.
            </p>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="review_mode"
                  value="short"
                  checked={settings.review_interval_mode === 'short'}
                  onChange={(e) => setSettings({ ...settings, review_interval_mode: 'short' as const })}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">Short (1 day)</div>
                  <div className="text-sm text-gray-500">Review after 1 day</div>
                </div>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="review_mode"
                  value="standard"
                  checked={settings.review_interval_mode === 'standard'}
                  onChange={(e) => setSettings({ ...settings, review_interval_mode: 'standard' as const })}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">Standard (1, 7 days)</div>
                  <div className="text-sm text-gray-500">Review after 1 day, then 7 days</div>
                </div>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="review_mode"
                  value="long"
                  checked={settings.review_interval_mode === 'long'}
                  onChange={(e) => setSettings({ ...settings, review_interval_mode: 'long' as const })}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">Long (1, 7, 21 days)</div>
                  <div className="text-sm text-gray-500">Review after 1, 7, and 21 days</div>
                </div>
              </label>
            </div>
          </div>

          {/* Review Randomization */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-normal text-gray-900 mb-4">Review Question Order</h2>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-medium text-gray-900">Randomize Review Questions</div>
                <div className="text-sm text-gray-500">Show review questions in random order</div>
              </div>
              <input
                type="checkbox"
                checked={settings.review_randomized}
                onChange={(e) => setSettings({ ...settings, review_randomized: e.target.checked })}
                className="w-5 h-5"
              />
            </label>
          </div>

          {/* Path Randomization */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-normal text-gray-900 mb-4">Path Question Order</h2>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-medium text-gray-900">Randomize Path Questions</div>
                <div className="text-sm text-gray-500">Show path questions in random order instead of sequential</div>
              </div>
              <input
                type="checkbox"
                checked={settings.path_randomized}
                onChange={(e) => setSettings({ ...settings, path_randomized: e.target.checked })}
                className="w-5 h-5"
              />
            </label>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
