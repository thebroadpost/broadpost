import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Mail, Search, Copy, Users, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { getNewsletterSubscriptions } from '../../lib/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../lib/utils';

export default function AdminNewsletters() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: subscriptions = [], isLoading, error } = useQuery({
    queryKey: ['newsletterSubscriptions'],
    queryFn: getNewsletterSubscriptions,
  });

  const filteredSubscriptions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return subscriptions;

    return subscriptions.filter((subscriber) =>
      subscriber.email.toLowerCase().includes(query)
    );
  }, [subscriptions, searchTerm]);

  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success('Email copied');
    } catch {
      toast.error('Unable to copy email');
    }
  };

  const handleCopyAll = async () => {
    if (filteredSubscriptions.length === 0) {
      toast.error('No emails to copy');
      return;
    }

    const joined = filteredSubscriptions.map((subscriber) => subscriber.email).join(', ');

    try {
      await navigator.clipboard.writeText(joined);
      toast.success('All filtered emails copied');
    } catch {
      toast.error('Unable to copy emails');
    }
  };

  const handleDownloadCsv = () => {
    if (filteredSubscriptions.length === 0) {
      toast.error('No emails to export');
      return;
    }

    const rows = [
      ['email', 'subscribed_at'],
      ...filteredSubscriptions.map((subscriber) => [subscriber.email, subscriber.created_at]),
    ];

    const csv = rows
      .map((row) => row.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary dark:text-white">Newsletters</h1>
          <p className="text-sm font-sans text-gray-500 dark:text-gray-400 mt-1">
            View and export newsletter subscribers.
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleCopyAll} variant="outline" className="flex items-center gap-2">
            <Copy size={16} /> Copy All
          </Button>
          <Button onClick={handleDownloadCsv} className="flex items-center gap-2">
            <Download size={16} /> Export CSV
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-border dark:border-gray-800 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm font-sans text-gray-600 dark:text-gray-300">
            <Users size={16} />
            <span>
              {subscriptions.length} total subscriber{subscriptions.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by email"
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-sm font-sans text-gray-500 dark:text-gray-400 py-6">Loading subscribers...</div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900/30 p-4">
            <p className="text-sm font-sans text-red-700 dark:text-red-300">
              Could not load subscribers. Check Supabase RLS for select permissions on the subscriptions table.
            </p>
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="text-sm font-sans text-gray-500 dark:text-gray-400 py-6">
            No subscribers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-900/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400">Subscribed At</th>
                  <th className="px-4 py-3 text-right text-xs font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-gray-800">
                {filteredSubscriptions.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-sans text-gray-800 dark:text-gray-100">
                      <div className="inline-flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        {subscriber.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-sans text-gray-600 dark:text-gray-300">
                      {formatDate(subscriber.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyEmail(subscriber.email)}
                        className="inline-flex items-center gap-2"
                      >
                        <Copy size={14} /> Copy
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
