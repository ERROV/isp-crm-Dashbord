import React, { useState } from 'react';
import type { Appraisal, User } from '../types';
import { Permission } from '../types';
import Modal from '../components/common/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface AppraisalsPageProps {
  appraisals: Appraisal[];
  setAppraisals: React.Dispatch<React.SetStateAction<Appraisal[]>>;
  users: User[];
}

const AppraisalForm: React.FC<{
  appraisal: Partial<Appraisal> | null;
  onSave: (appraisal: Partial<Appraisal>) => void;
  onCancel: () => void;
  users: User[];
  reviewerId: string;
}> = ({ appraisal, onSave, onCancel, users, reviewerId }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<Partial<Appraisal>>(
        appraisal || { employeeId: undefined, reviewerId: reviewerId, appraisalDate: new Date().toISOString().split('T')[0], rating: 3, comments: '' }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'rating' ? parseInt(value, 10) : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    
    // Any user can be appraised.
    const employeeList = users;


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('appraisalsPage.form.employee')}</label>
                <select name="employeeId" value={formData.employeeId} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                    <option value="">{t('appraisalsPage.form.selectEmployee')}</option>
                    {employeeList.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('appraisalsPage.form.date')}</label>
                <input type="date" name="appraisalDate" value={formData.appraisalDate?.split('T')[0] || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('appraisalsPage.form.rating')}</label>
                <input type="number" name="rating" min="1" max="5" value={formData.rating || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('appraisalsPage.form.comments')}</label>
                <textarea name="comments" value={formData.comments || ''} onChange={handleChange} rows={4} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">{t('common.cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('common.save')}</button>
            </div>
        </form>
    );
};

const AppraisalsPage: React.FC<AppraisalsPageProps> = ({ appraisals, setAppraisals, users }) => {
  const { currentUser, hasPermission } = useAuth();
  const { t, language, locale } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppraisal, setEditingAppraisal] = useState<Appraisal | null>(null);
  
  const canManage = hasPermission(Permission.MANAGE_APPRAISALS);

  const handleAdd = () => {
      setEditingAppraisal(null);
      setIsModalOpen(true);
  };
  
  const handleEdit = (appraisal: Appraisal) => {
      setEditingAppraisal(appraisal);
      setIsModalOpen(true);
  };
  
  const handleDelete = (id: number) => {
      if (window.confirm(t('common.confirmDeleteMessage'))) {
          setAppraisals(appraisals.filter(a => a.id !== id));
      }
  };

  const handleSave = (appraisalData: Partial<Appraisal>) => {
    if (editingAppraisal) {
      setAppraisals(appraisals.map(a => a.id === editingAppraisal.id ? { ...a, ...appraisalData } as Appraisal : a));
    } else {
      const newAppraisal: Appraisal = {
        id: Date.now(),
        ...appraisalData,
      } as Appraisal;
      setAppraisals([newAppraisal, ...appraisals]);
    }
    setIsModalOpen(false);
  };

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || t('common.unknownUser');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('appraisalsPage.title')}</h1>
        {canManage && (
            <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                {t('appraisalsPage.create')}
            </button>
        )}
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('appraisalsPage.table.employee')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('appraisalsPage.table.reviewer')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('appraisalsPage.table.date')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('appraisalsPage.table.rating')}</th>
              {canManage && <th className={`px-6 py-3 ${language === 'ar' ? 'text-left' : 'text-right'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('common.actions')}</th>}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {appraisals.map((appraisal) => (
              <tr key={appraisal.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{getUserName(appraisal.employeeId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{getUserName(appraisal.reviewerId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(appraisal.appraisalDate).toLocaleDateString(locale)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-600 dark:text-slate-300">{appraisal.rating} / 5</td>
                {canManage && (
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${language === 'ar' ? 'text-left' : 'text-right'} space-x-4 space-x-reverse`}>
                        <button onClick={() => handleEdit(appraisal)} className="text-blue-600 hover:text-blue-900">{t('common.edit')}</button>
                        <button onClick={() => handleDelete(appraisal.id)} className="text-red-600 hover:text-red-900">{t('common.delete')}</button>
                    </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAppraisal ? t('appraisalsPage.edit') : t('appraisalsPage.create')}>
          <AppraisalForm 
            appraisal={editingAppraisal}
            onSave={handleSave}
            onCancel={() => setIsModalOpen(false)}
            users={users}
            reviewerId={currentUser!.id}
          />
      </Modal>
    </div>
  );
};

export default AppraisalsPage;