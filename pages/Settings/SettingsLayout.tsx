import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage } from '../../contexts/LanguageContext';
import type { TranslationKey } from '../../translations';

const SettingsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { t, language } = useLanguage();
    const router = useRouter();
    // In the future, more settings links can be added here.
    const navLinks = [
        { nameKey: 'settings.layout.roleManagement', path: '/settings/roles' },
    ] as const;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">{t('settings.title')}</h1>
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="md:w-1/4 lg:w-1/5">
                    <nav className="space-y-2">
                        {navLinks.map(link => {
                            const isActive = router.pathname === link.path;
                            return (
                                <Link key={link.path} href={link.path} passHref>
                                    <a
                                        className={`block px-4 py-2 rounded-md ${language === 'ar' ? 'text-right' : 'text-left'} ${
                                            isActive
                                                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 font-semibold'
                                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                                        }`}
                                    >
                                        {t(link.nameKey as TranslationKey)}
                                    </a>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>
                <main className="flex-1">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SettingsLayout;
