import React, { useState, useMemo } from 'react';
import type { User, Role, Reseller } from '../types';
import { Permission } from '../types';
import Modal from '../components/common/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { TranslationKey } from '../translations';

interface UserFormProps {
    user: User | null; 
    onSave: (user: Partial<User>) => void; 
    onCancel: () => void;
    roles: Role[];
    resellers: Reseller[];
    isResellerManager: boolean;
    canManageAllUsers: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel, roles, resellers, isResellerManager, canManageAllUsers }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<Partial<User>>(user || { name: '', email: '', roleId: undefined, resellerId: undefined });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const processedValue = name === 'roleId' || name === 'resellerId' ? (value ? parseInt(value, 10) : undefined) : value;
        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as User);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('common.name')}</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('common.email')}</label>
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            {canManageAllUsers && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('common.role')}</label>
                        <select name="roleId" value={formData.roleId} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                            <option value="">{t('common.selectRole')}</option>
                            {roles.map(role => <option key={role.id} value={role.id}>{t(`roles.${role.name}` as TranslationKey)}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('ticketsPage.reseller')}</label>
                        <select name="resellerId" value={formData.resellerId || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option value="">{t('common.unassigned')}</option>
                            {resellers.map(reseller => <option key={reseller.id} value={reseller.id}>{reseller.name}</option>)}
                        </select>
                    </div>
                </>
            )}
            {!canManageAllUsers && !isResellerManager && (
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('common.role')}</label>
                    <p className="mt-1 text-slate-800 dark:text-slate-100">{t(`roles.${formData.roleId}` as TranslationKey)}</p>
                </div>
            )}
            <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">{t('common.cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('common.save')}</button>
            </div>
        </form>
    );
};

interface UsersPageProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  roles: Role[];
  resellers: Reseller[];
}

const UsersPage: React.FC<UsersPageProps> = ({ users, setUsers, roles, resellers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser, hasPermission } = useAuth();
  const { t, language } = useLanguage();

  const canManageAllUsers = hasPermission(Permission.MANAGE_USERS);
  const isResellerManager = hasPermission(Permission.MANAGE_RESELLER_EMPLOYEES);

  const displayedUsers = useMemo(() => {
    let filtered = users;
    if (!canManageAllUsers) {
      if (isResellerManager && currentUser?.resellerId) {
        // Reseller sees their own employees plus themselves
        filtered = users.filter(u => String(u.resellerId) === String(currentUser.resellerId));
      } else {
        // Default to seeing only self
        filtered = users.filter(u => u.id === currentUser?.id);
      }
    }

    if(searchQuery.trim() !== '') {
        const lowercasedQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(u => 
            u.name.toLowerCase().includes(lowercasedQuery) || 
            u.email.toLowerCase().includes(lowercasedQuery)
        );
    }

    return filtered;
  }, [users, currentUser, canManageAllUsers, isResellerManager, searchQuery]);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (userData: Partial<User>) => {
    if (editingUser) {
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userData } as User : u));
    } else {
        const newUser: User = { 
            id: String(Date.now()),
            avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
            ...userData
        } as User;
        
        // If creator is a reseller manager (but not an admin), set role and resellerId automatically
        if (isResellerManager && !canManageAllUsers && currentUser?.resellerId) {
            newUser.roleId = 6; // Reseller Employee Role ID
            newUser.resellerId = currentUser.resellerId;
        }

        setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };
  
  const canAddUsers = canManageAllUsers || isResellerManager;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('usersPage.title')}</h1>
        <div className="flex items-center gap-4">
             <input
                type="text"
                placeholder={t('subscribersPage.searchPlaceholder')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {canAddUsers &&
                <button onClick={handleAddUser} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                {t('usersPage.addUser')}
                </button>
            }
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider`}>{t('usersPage.table.user')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider`}>{t('usersPage.table.role')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider`}>{t('ticketsPage.reseller')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider`}>{t('usersPage.table.email')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-left' : 'text-right'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider`}>{t('usersPage.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {displayedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                    </div>
                    <div className={language === 'ar' ? 'mr-4' : 'ml-4'}>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {t(`roles.${user.roleId}` as TranslationKey)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {resellers.find(r => r.id === user.resellerId)?.name || t('common.unassigned')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{user.email}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${language === 'ar' ? 'text-left' : 'text-right'}`}>
                  {(canManageAllUsers || (isResellerManager && user.id !== currentUser?.id)) &&
                    <button onClick={() => handleEditUser(user)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">{t('common.edit')}</button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingUser ? t('usersPage.editUser') : t('usersPage.addUser')}
      >
          <UserForm 
              user={editingUser}
              onSave={handleSaveUser}
              onCancel={() => setIsModalOpen(false)}
              roles={roles}
              resellers={resellers}
              isResellerManager={isResellerManager && !canManageAllUsers}
              canManageAllUsers={canManageAllUsers}
          />
      </Modal>
    </div>
  );
};

export default UsersPage;