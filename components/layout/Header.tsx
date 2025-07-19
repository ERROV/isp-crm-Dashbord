
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ICONS } from '../../constants';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Notification } from '../../types';
import type { TranslationKey } from '../../translations';

interface HeaderProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const Header: React.FC<HeaderProps> = ({ notifications, setNotifications }) => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  if (!currentUser) return null;

  const unreadNotifications = useMemo(() => {
    return notifications.filter(n => !n.isRead);
  }, [notifications]);

  const roleName = t((currentUser.role.name ? `roles.${currentUser.role.name}` : 'roles.unknown') as TranslationKey);

  const handleLanguageChange = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
  };

  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
    setIsNotificationsOpen(false);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setIsNotificationsOpen(false);
  }

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
      <div className="flex items-center">
        {/* Can be used for search bar or breadcrumbs in the future */}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleLanguageChange}
          className="p-2 rounded-full font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none"
          aria-label="Toggle language"
        >
          {language === 'en' ? 'عربي' : 'English'}
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none"
          aria-label={t('header.toggleTheme')}
        >
          {theme === 'dark' ? ICONS.sun : ICONS.moon}
        </button>

        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(prev => !prev)}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none"
            aria-label={t('header.notifications')}
          >
            {ICONS.bell}
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {unreadNotifications.length}
              </span>
            )}
          </button>
          {isNotificationsOpen && (
            <div className="absolute top-full mt-2 w-80 max-w-sm bg-white dark:bg-slate-800 rounded-lg shadow-lg border dark:border-slate-700 z-10" style={language === 'ar' ? { left: 0 } : { right: 0 }}>
              <div className="p-3 flex justify-between items-center border-b dark:border-slate-700">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">{t('header.notifications')}</h4>
                {unreadNotifications.length > 0 &&
                  <button onClick={markAllAsRead} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">{t('header.markAllAsRead')}</button>
                }
              </div>
              <div className="max-h-80 overflow-y-auto">
                {unreadNotifications.length > 0 ? unreadNotifications.map(n => (
                  <Link
                    href={n.link}
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className="block p-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b dark:border-slate-700/50"
                  >
                    <p className="text-sm text-slate-700 dark:text-slate-300">{t(n.messageKey as TranslationKey, n.messagePayload)}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</p>
                  </Link>

                )) : (
                  <p className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">{t('header.noNewNotifications')}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center">
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <h2 className="text-md font-semibold text-slate-800 dark:text-slate-100">{currentUser.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{roleName}</p>
          </div>
          <img src={currentUser.avatar} alt={currentUser.name} className={`w-10 h-10 rounded-full ${language === 'ar' ? 'mr-4' : 'ml-4'}`} />
        </div>

        <button
          onClick={logout}
          className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {ICONS.logout}
          <span className={language === 'ar' ? 'mr-2' : 'ml-2'}>{t('header.logout')}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
