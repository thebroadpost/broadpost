import { X, User as UserIcon, Bell, Settings, LogOut, Bookmark, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserSidebar({ isOpen, onClose }: UserSidebarProps) {
  const { user, signInWithGoogle, signOut, loading } = useAuth();

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-[60] transition-opacity"
        onClick={onClose}
      />
      
      <div className={`fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-[#1d1d1d] text-white z-[70] shadow-2xl flex flex-col transition-transform transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="font-serif text-2xl font-bold">B</div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
             <div className="p-8 flex justify-center">
                 <div className="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
             </div>
          ) : !user ? (
            <div className="p-8 flex flex-col h-full">
              <div className="mb-8">
                <h2 className="text-3xl font-serif font-bold mb-4">Unlock Your Notifications</h2>
                <p className="text-gray-400 font-sans tracking-wide leading-relaxed">
                  Access more premium news alerts, newsletters, and other member perks.
                </p>
              </div>
              
              <Button 
                onClick={signInWithGoogle}
                className="w-full bg-[#0a66c2] hover:bg-[#004182] text-white py-4 text-sm font-bold uppercase tracking-wider transition-colors"
                variant="primary"
              >
                Sign In or Create a Free Account
              </Button>
              <p className="mt-4 text-xs text-gray-500 text-center font-sans">
                By signing in, securely through Google, you agree to our terms of service and privacy policy.
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="p-6 border-b border-gray-800 flex items-center space-x-4">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-12 h-12 rounded-full border border-gray-700" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                    <UserIcon size={24} className="text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="font-bold font-sans text-lg">{user.user_metadata?.full_name || 'Member'}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>

              <div className="p-4 space-y-1">
                <div className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Account</div>
                <button className="w-full text-left px-4 py-3 hover:bg-gray-800 flex items-center space-x-3 transition-colors group">
                  <UserIcon size={18} className="text-gray-400 group-hover:text-white" />
                  <span className="font-sans font-medium text-gray-200 group-hover:text-white">My Profile</span>
                </button>
                <button className="w-full text-left px-4 py-3 hover:bg-gray-800 flex items-center space-x-3 transition-colors group">
                  <Bell size={18} className="text-gray-400 group-hover:text-white" />
                  <span className="font-sans font-medium text-gray-200 group-hover:text-white">Notifications</span>
                  {/* Fake badge for UI polish */}
                  <span className="bg-accent-red text-white text-[10px] px-2 py-0.5 rounded-full ml-auto">3</span>
                </button>
                <button className="w-full text-left px-4 py-3 hover:bg-gray-800 flex items-center space-x-3 transition-colors group">
                  <FileText size={18} className="text-gray-400 group-hover:text-white" />
                  <span className="font-sans font-medium text-gray-200 group-hover:text-white">Newsletters</span>
                </button>
                <button className="w-full text-left px-4 py-3 hover:bg-gray-800 flex items-center space-x-3 transition-colors group">
                  <Bookmark size={18} className="text-gray-400 group-hover:text-white" />
                  <span className="font-sans font-medium text-gray-200 group-hover:text-white">Reading List</span>
                </button>
                <button className="w-full text-left px-4 py-3 hover:bg-gray-800 flex items-center space-x-3 transition-colors group">
                  <Settings size={18} className="text-gray-400 group-hover:text-white" />
                  <span className="font-sans font-medium text-gray-200 group-hover:text-white">Settings</span>
                </button>
              </div>

              <div className="p-4 mt-auto border-t border-gray-800">
                <button 
                  onClick={signOut}
                  className="w-full text-left px-4 py-3 hover:bg-gray-800 flex items-center space-x-3 transition-colors text-accent-red"
                >
                  <LogOut size={18} />
                  <span className="font-sans font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
