import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markNotificationRead } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Notifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => getNotifications(user!.id),
    enabled: !!user?.id
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    }
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
        <h2 className="font-serif font-bold text-2xl text-primary dark:text-white">
          Notifications
        </h2>
        <span className="font-sans text-sm text-gray-500">
          {notifications?.filter((n: any) => !n.read).length || 0} Unread
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {notifications.map((notification: any) => (
            <div 
              key={notification.id} 
              className={`p-5 rounded-lg border transition-colors ${
                notification.read 
                  ? 'bg-white dark:bg-gray-900 border-border dark:border-gray-800' 
                  : 'bg-blue-50 dark:bg-blue-900/20 border-accent-blue dark:border-accent-blue/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex space-x-4">
                  <div className="mt-1 flex-shrink-0">
                    <div className={`p-2 rounded-full ${notification.read ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' : 'bg-accent-blue/10 text-accent-blue'}`}>
                      <Bell size={18} />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-primary dark:text-white mb-1 leading-tight">{notification.title}</h4>
                    <p className="font-sans text-sm text-gray-600 dark:text-gray-300 mb-3">{notification.message}</p>
                    
                    <div className="flex items-center space-x-4">
                      {notification.link && (
                        <Link to={notification.link} className="text-xs font-bold text-accent-blue hover:underline flex items-center">
                          View Details <ExternalLink size={12} className="ml-1" />
                        </Link>
                      )}
                      
                      {!notification.read && (
                        <button 
                          onClick={() => markReadMutation.mutate(notification.id)}
                          disabled={markReadMutation.isPending}
                          className="text-xs font-bold text-gray-500 hover:text-primary dark:hover:text-white flex items-center transition-colors"
                        >
                          <Check size={12} className="mr-1" /> Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <span className="text-xs text-gray-400 whitespace-nowrap hidden sm:block">
                  {new Date(notification.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center">
           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
             <Bell size={24} className="text-gray-400" />
           </div>
           <h3 className="font-serif font-bold text-xl text-primary mb-2">You're all caught up!</h3>
           <p className="font-sans text-gray-500 max-w-sm">
             We'll let you know when there are important updates, new newsletters, or responses to your comments.
           </p>
        </div>
      )}
    </div>
  );
}
