import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { checkSubscription, subscribeToNewsletter, unsubscribeFromNewsletter } from '../../../lib/api';
import { Mail, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Skeleton } from '../../../components/ui/Skeleton';

export default function Newsletters() {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      checkSubscription(user.email)
        .then(subscribed => {
          setIsSubscribed(subscribed);
          setInitialLoading(false);
        })
        .catch(() => {
          setInitialLoading(false);
          toast.error("Could not load subscription status");
        });
    } else {
        setInitialLoading(false);
    }
  }, [user]);

  const handleToggle = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      if (isSubscribed) {
        await unsubscribeFromNewsletter(user.email);
        setIsSubscribed(false);
        toast.success("Unsubscribed from newsletter");
      } else {
        await subscribeToNewsletter(user.email);
        setIsSubscribed(true);
        toast.success("Subscribed successfully!");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
        <h2 className="font-serif font-bold text-2xl text-primary dark:text-white">
          Newsletters
        </h2>
      </div>

      <div className="max-w-2xl">
        <p className="text-gray-600 dark:text-gray-300 font-sans mb-8 leading-relaxed">
          Manage your newsletter subscriptions to stay up-to-date with our latest insights, breaking news, and editorial highlights.
        </p>

        {initialLoading ? (
            <Skeleton className="h-32 w-full" />
        ) : (
            <div className="border border-border dark:border-gray-800 rounded-lg p-6 bg-white dark:bg-gray-900 transition-colors">
            <div className="flex items-start justify-between">
                <div className="flex space-x-4">
                <div className="mt-1 p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 text-accent-blue flex-shrink-0">
                    <Mail size={24} />
                </div>
                <div>
                    <h3 className="font-serif font-bold text-xl text-primary dark:text-white mb-2">The Daily Briefing</h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-4 max-w-sm">
                    Get the most important stories curated by our editors delivered directly to your inbox every morning.
                    </p>
                    
                    <div className="flex items-center space-x-2 text-xs font-bold font-sans">
                      {isSubscribed ? (
                          <span className="text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded inline-flex items-center">
                              <Check size={12} className="mr-1" /> ACTIVE
                          </span>
                      ) : (
                          <span className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded inline-flex items-center">
                              <AlertCircle size={12} className="mr-1" /> NOT SUBSCRIBED
                          </span>
                      )}
                      <span className="text-gray-400 hidden sm:inline">Sent daily at 6:00 AM EST</span>
                    </div>
                </div>
                </div>
                
                <div className="ml-4 flex-shrink-0">
                  <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={!!isSubscribed}
                          onChange={handleToggle}
                          disabled={loading}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent-blue"></div>
                  </label>
                </div>
            </div>
            
            {!user?.email && (
                <div className="mt-4 text-sm text-accent-red font-sans bg-red-50 dark:bg-red-900/10 p-3 rounded">
                    You must have an email associated with your account to subscribe.
                </div>
            )}
            </div>
        )}
      </div>
    </div>
  );
}
