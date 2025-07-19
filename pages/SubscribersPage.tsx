import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import type { Subscriber, Reseller } from '../types';
import { SubscriberStatus } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import type { TranslationKey } from '../translations';

const SubscriberDetails: React.FC<{
    subscriber: Subscriber;
    resellerName: string;
    onCreateTicket: (id: number) => void;
}> = ({ subscriber, resellerName, onCreateTicket }) => {
    const { t, locale } = useLanguage();
    const currencyFormatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'IQD', minimumFractionDigits: 0 });

    const DetailItem: React.FC<{ labelKey: TranslationKey; value?: string | number | null; children?: React.ReactNode }> = ({ labelKey, value, children }) => (
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t(labelKey)}</p>
            <div className="text-md font-semibold text-slate-800 dark:text-slate-200">
                {children || value || 'N/A'}
            </div>
        </div>
    );
    
    const getStatusColor = (status: SubscriberStatus) => {
        switch (status) {
            case SubscriberStatus.ACTIVE: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case SubscriberStatus.INACTIVE: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
            case SubscriberStatus.EXPIRED: return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            default: return 'bg-slate-100 text-slate-800';
        }
    };


    return (
        <div className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{subscriber.name}</h2>
                    <p className="text-slate-500 dark:text-slate-400">{subscriber.username}</p>
                </div>
                <button
                    onClick={() => subscriber.id && onCreateTicket(subscriber.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 whitespace-nowrap"
                >
                    {t('subscribersPage.createTicket')}
                </button>
            </div>
            <hr className="my-6 border-slate-200 dark:border-slate-700" />
            <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <DetailItem labelKey="subscribersPage.form.profile" value={subscriber.profile} />
                    <DetailItem labelKey="subscribersPage.form.status">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(subscriber.status)}`}>
                            {t(`subscriberStatus.${subscriber.status}` as TranslationKey)}
                        </span>
                    </DetailItem>
                    <DetailItem labelKey="subscribersPage.form.reseller" value={resellerName} />
                    <DetailItem labelKey="subscribersPage.form.expiration" value={new Date(subscriber.expirationDate).toLocaleString(locale)} />
                    <DetailItem labelKey="subscribersPage.form.lastSeen" value={subscriber.lastSeenOnline ? new Date(subscriber.lastSeenOnline).toLocaleString(locale) : 'N/A'} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                     <DetailItem labelKey="subscribersPage.form.balance">
                        <span className={subscriber.balance < 0 ? 'text-red-500' : 'text-green-500'}>
                           {currencyFormatter.format(subscriber.balance)}
                        </span>
                    </DetailItem>
                    <DetailItem labelKey="subscribersPage.form.debtDays" value={subscriber.debtDays} />
                    <DetailItem labelKey="subscribersPage.form.totalPurchases" value={subscriber.totalPurchases} />
                </div>
            </div>
        </div>
    );
};

interface SubscribersPageProps {
  subscribers: Subscriber[];
  setSubscribers: React.Dispatch<React.SetStateAction<Subscriber[]>>;
  resellers: Reseller[];
}

const SubscribersPage: React.FC<SubscribersPageProps> = ({ subscribers, resellers }) => {

    const { t } = useLanguage();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);


    const filteredSubscribers = useMemo(() => {
        if (!searchQuery) return [];
        return subscribers.filter(s => 
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            s.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [subscribers, searchQuery]);

    const handleCreateTicket = (subscriberId: number) => {
        router.push({
            pathname: '/tickets',
            query: { subscriberId: subscriberId },
        });
    };

    return (
        <div className="p-8 h-full flex flex-col">
            <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('subscribersPage.title')}</h1>
                <div className="mt-4 mb-6">
                    <input
                        type="text"
                        placeholder={t('subscribersPage.searchPlaceholder')}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    />
                </div>
            </div>
            <div className="flex-grow flex gap-6 overflow-hidden">
                {/* Search Results Panel */}
                <div className="w-1/3 bg-white dark:bg-slate-800 rounded-lg shadow-md flex flex-col overflow-hidden">
                    <h2 className="p-4 text-lg font-semibold border-b border-slate-200 dark:border-slate-700 flex-shrink-0 text-slate-800 dark:text-slate-200">{t('subscribersPage.searchResults')} ({filteredSubscribers.length})</h2>
                    <ul className="overflow-y-auto">
                        {filteredSubscribers.map(subscriber => (
                             <li key={subscriber.id}>
                                <button
                                    onClick={() => setSelectedSubscriber(subscriber)}
                                    className={`w-full text-right p-4 border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${selectedSubscriber?.id === subscriber.id ? 'bg-blue-50 dark:bg-blue-900/50' : ''}`}
                                >
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{subscriber.name}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{subscriber.username}</p>
                                </button>
                            </li>
                        ))}
                         {searchQuery && filteredSubscribers.length === 0 && (
                             <li className="p-4 text-center text-slate-500 dark:text-slate-400">{t('subscribersPage.noSubscribers')}</li>
                         )}
                    </ul>
                </div>

                {/* Details Panel */}
                <div className="w-2/3 bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-y-auto">
                    {selectedSubscriber ? (
                        <SubscriberDetails
                            subscriber={selectedSubscriber}
                            resellerName={resellers.find(r => r.id === selectedSubscriber.resellerId)?.name || ''}
                            onCreateTicket={handleCreateTicket}
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-slate-500 dark:text-slate-400">{t('subscribersPage.noSubscriberSelected')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscribersPage;