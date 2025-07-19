import React, { useState } from 'react';
import type { Role } from '../../types';
import { Permission } from '../../types';
import Modal from '../../components/common/Modal';
import { useLanguage } from '../../contexts/LanguageContext';
import type { TranslationKey } from '../../translations';

interface RolesPageProps {
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

const RoleForm: React.FC<{
  role: Partial<Role> | null;
  onSave: (role: Partial<Role>) => void;
  onCancel: () => void;
}> = ({ role, onSave, onCancel }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<Partial<Role>>(
        role || { name: '', permissions: [] }
    );

    const handlePermissionChange = (permission: Permission, checked: boolean) => {
        setFormData(prev => {
            const currentPermissions = prev?.permissions || [];
            if (checked) {
                return { ...prev, permissions: [...currentPermissions, permission] };
            } else {
                return { ...prev, permissions: currentPermissions.filter(p => p !== permission) };
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('settings.roles.form.name')}</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
                <h4 className="text-md font-medium text-slate-700 dark:text-slate-300 text-right mb-2">{t('settings.roles.form.permissions')}</h4>
                <div className="max-h-80 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-md">
                {Object.values(Permission).map(p => (
                    <div key={p} className="flex items-center">
                        <input id={`perm-${p}`} type="checkbox" checked={formData.permissions?.includes(p)} onChange={(e) => handlePermissionChange(p, e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <label htmlFor={`perm-${p}`} className="mx-2 block text-sm text-slate-900 dark:text-slate-300">{t(`permissions.${p}` as TranslationKey)}</label>
                    </div>
                ))}
                </div>
            </div>
            <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">{t('common.cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('common.save')}</button>
            </div>
        </form>
    );
};


const RolesPage: React.FC<RolesPageProps> = ({ roles, setRoles }) => {
  const { t, language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const handleAdd = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if(id <= 4) { // Prevent deleting default roles
        alert(t('settings.roles.deleteWarning'));
        return;
    }
    if (window.confirm(t('common.confirmDeleteMessage'))) {
      setRoles(roles.filter(r => r.id !== id));
    }
  };

  const handleSave = (roleData: Partial<Role>) => {
    if (editingRole) {
      setRoles(roles.map(r => r.id === editingRole.id ? { ...r, ...roleData } as Role : r));
    } else {
      const newRole: Role = {
        id: Date.now(),
        name: roleData.name || 'New Role',
        permissions: roleData.permissions || [],
      };
      setRoles([...roles, newRole]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('settings.roles.title')}</h1>
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          {t('settings.roles.add')}
        </button>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('settings.roles.table.name')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('settings.roles.table.permissions')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-left' : 'text-right'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{/roles\.\d/.test(role.name) ? t(role.name as TranslationKey) : role.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{role.permissions.length}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${language === 'ar' ? 'text-left' : 'text-right'} space-x-4 space-x-reverse`}>
                  <button onClick={() => handleEdit(role)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">{t('common.edit')}</button>
                  <button onClick={() => handleDelete(role.id)} className="text-red-600 hover:text-red-900 disabled:text-slate-400 disabled:cursor-not-allowed dark:text-red-500 dark:hover:text-red-400" disabled={role.id <= 4}>{t('common.delete')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRole ? t('settings.roles.edit') : t('settings.roles.add')}>
          <RoleForm 
              role={editingRole}
              onSave={handleSave}
              onCancel={() => setIsModalOpen(false)}
          />
      </Modal>
    </div>
  );
};

export default RolesPage;