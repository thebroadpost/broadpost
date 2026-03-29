import React from 'react';
import { Moon, Sun, Bell, Lock, Mail, Save } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const { actualTheme, setTheme } = useTheme();
  const [settings, setSettings] = React.useState({
    emailNotifications: true,
    commentNotifications: true,
    analyticsEmails: true,
    autoSave: true,
    itemsPerPage: '20',
  });

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setTheme(theme);
    toast.success(`Switched to ${theme} mode`);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Save to localStorage for persistence
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary dark:text-white">Settings</h1>
        <p className="text-sm font-sans text-gray-500 dark:text-gray-400 mt-1">Manage your admin preferences and dashboard configuration.</p>
      </div>

      {/* Theme Settings */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-border dark:border-gray-800 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <Sun size={20} className="text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-primary dark:text-white">Appearance</h2>
            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Customize how the dashboard looks</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-sans font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</label>
            <div className="flex gap-4">
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                  actualTheme === 'light'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Sun size={18} />
                Light Mode
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                  actualTheme === 'dark'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Moon size={18} />
                Dark Mode
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-border dark:border-gray-800 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <Bell size={20} className="text-purple-600 dark:text-purple-300" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-primary dark:text-white">Notifications</h2>
            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Control notification preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 rounded-lg border border-border dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
            <span className="text-sm font-sans font-medium text-gray-700 dark:text-gray-300">Email notifications for new comments</span>
            <input
              type="checkbox"
              checked={settings.commentNotifications}
              onChange={(e) => handleSettingChange('commentNotifications', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-lg border border-border dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
            <span className="text-sm font-sans font-medium text-gray-700 dark:text-gray-300">Analytics digest emails</span>
            <input
              type="checkbox"
              checked={settings.analyticsEmails}
              onChange={(e) => handleSettingChange('analyticsEmails', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-lg border border-border dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
            <span className="text-sm font-sans font-medium text-gray-700 dark:text-gray-300">General notifications</span>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Dashboard Settings */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-border dark:border-gray-800 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-cyan-50 dark:bg-cyan-900/30 rounded-lg">
            <Mail size={20} className="text-cyan-600 dark:text-cyan-300" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-primary dark:text-white">Dashboard</h2>
            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Customize dashboard display options</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-sans font-medium text-gray-700 dark:text-gray-300 mb-2">Items per page</label>
            <select
              value={settings.itemsPerPage}
              onChange={(e) => handleSettingChange('itemsPerPage', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="10">10 items</option>
              <option value="20">20 items</option>
              <option value="50">50 items</option>
              <option value="100">100 items</option>
            </select>
          </div>

          <label className="flex items-center justify-between p-4 rounded-lg border border-border dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
            <span className="text-sm font-sans font-medium text-gray-700 dark:text-gray-300">Auto-save drafts</span>
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Security Info */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-border dark:border-gray-800 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
            <Lock size={20} className="text-emerald-600 dark:text-emerald-300" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-primary dark:text-white">Security</h2>
            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Manage your account security</p>
          </div>
        </div>

        <div className="space-y-3 text-sm font-sans text-gray-600 dark:text-gray-400">
          <p>Your account is protected by Supabase authentication. Changes to account credentials must be made through your admin account settings.</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">For password changes or two-factor authentication setup, contact your system administrator.</p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3 sticky bottom-0 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-950 dark:to-transparent pt-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          <Save size={18} />
          Save Settings
        </button>
      </div>
    </div>
  );
}
