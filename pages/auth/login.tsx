
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { initialUsers, initialRoles } from '../../lib/mockData';
import type { TranslationKey } from '../../translations';

const LoginPage = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<string>(initialUsers[0]?.id.toString() || '');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const userToLogin = initialUsers.find(u => u.id.toString() === selectedUserId);
    if (!userToLogin) {
        setError("Please select a valid user.");
        return;
    }

    const result = await signIn('credentials', {
      redirect: false,
      email: userToLogin.email,
      password: 'password123', // Password is not checked for mock data
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.replace('/');
    }
  };
  
  const getRoleNameForUser = (user: typeof initialUsers[0]) => {
     const role = initialRoles.find(r => r.id === user.roleId);
     return role ? t(role.name as TranslationKey) : t('roles.unknown');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('loginPage.welcome')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{t('loginPage.selectUserPrompt')}</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label htmlFor="user-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {t('loginPage.selectProfileLabel')}
            </label>
            <select
              id="user-select"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {initialUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({getRoleNameForUser(user)})
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800"
          >
            {t('loginPage.loginButton')}
          </button>
        </form>
      </div>
    </div>
  );
};

LoginPage.displayName = 'AuthPage';
export default LoginPage;
