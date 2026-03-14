import { useTheme } from '../../../contexts/ThemeContext';
import { Button } from '../../../components/ui/Button';

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl">
      <h2 className="font-serif font-bold text-2xl text-primary dark:text-white mb-6 border-b border-border pb-4">
        Settings
      </h2>

      <div className="space-y-8">
        {/* Theme Settings */}
        <section>
          <h3 className="font-sans font-bold text-lg text-primary dark:text-white mb-4">Appearance</h3>
          <p className="font-sans text-sm text-gray-500 mb-4">
            Customize how Broadpost looks on your device.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`p-4 border rounded shadow-sm flex flex-col items-center justify-center space-y-3 transition-colors ${
                  theme === t 
                    ? 'border-primary dark:border-white ring-1 ring-primary dark:ring-white bg-gray-50 dark:bg-gray-800' 
                    : 'border-border dark:border-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="font-sans font-medium text-primary dark:text-gray-200 capitalize">
                  {t} Mode
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Account Deletion */}
        <section className="pt-8 border-t border-border mt-8">
           <h3 className="font-sans font-bold text-lg text-accent-red mb-4">Danger Zone</h3>
           <p className="font-sans text-sm text-gray-500 mb-4">
             Permanently delete your account and all associated data. This action cannot be undone.
           </p>
           <Button variant="outline" className="text-accent-red border-accent-red hover:bg-accent-red hover:text-white">
             Delete Account
           </Button>
        </section>
      </div>
    </div>
  );
}
