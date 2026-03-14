import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl">
      <h2 className="font-serif font-bold text-2xl text-primary dark:text-white mb-6 border-b border-border pb-4">
        My Profile
      </h2>

      <div className="space-y-6">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${user?.user_metadata?.avatar_url || ''})`}}>
            {!user?.user_metadata?.avatar_url && (
              <span className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-2xl">
                {user?.email?.[0].toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="font-sans font-medium text-sm text-gray-500">Profile Picture pulled from Google</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <div>
            <label className="block font-sans text-sm font-bold text-primary dark:text-gray-300 mb-1">Full Name</label>
            <Input 
              type="text" 
              defaultValue={user?.user_metadata?.full_name || ''} 
              disabled 
              className="bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
          
          <div>
            <label className="block font-sans text-sm font-bold text-primary dark:text-gray-300 mb-1">Email Address</label>
            <Input 
              type="email" 
              defaultValue={user?.email || ''} 
              disabled 
              className="bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="pt-4">
             <p className="text-sm font-sans text-gray-500 italic mb-4">
               Since you logged in using Google, your name and email are synced automatically and cannot be changed here.
             </p>
             <Button type="submit" disabled>Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
