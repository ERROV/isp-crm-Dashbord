import React, { useState } from 'react';
import type { Survey } from '../types';
import { Permission } from '../types';
import Modal from '../components/common/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface SurveysPageProps {
  surveys: Survey[];
  setSurveys: React.Dispatch<React.SetStateAction<Survey[]>>;
}

const SurveyForm: React.FC<{
  survey: Partial<Survey> | null;
  onSave: (survey: Partial<Survey>) => void;
  onCancel: () => void;
}> = ({ survey, onSave, onCancel }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<Partial<Survey>>(
        survey || { title: '', description: '' }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev!, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('surveysPage.form.title')}</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('surveysPage.form.description')}</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">{t('common.cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('common.save')}</button>
            </div>
        </form>
    );
};


const SurveysPage: React.FC<SurveysPageProps> = ({ surveys, setSurveys }) => {
  const { currentUser, hasPermission } = useAuth();
  const { t, language, locale } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);

  const canManage = hasPermission(Permission.MANAGE_SURVEYS);

  const handleAdd = () => { setEditingSurvey(null); setIsModalOpen(true); };
  const handleEdit = (survey: Survey) => { setEditingSurvey(survey); setIsModalOpen(true); };
  
  const handleDelete = (id: number) => {
      if (window.confirm(t('common.confirmDeleteMessage'))) {
          setSurveys(surveys.filter(s => s.id !== id));
      }
  };

  const handleSave = (surveyData: Partial<Survey>) => {
    if (editingSurvey) {
      setSurveys(surveys.map(s => s.id === editingSurvey.id ? { ...s, ...surveyData } as Survey : s));
    } else {
      const newSurvey: Survey = {
        id: Date.now(),
        creatorId: currentUser!.id,
        createdAt: new Date().toISOString(),
        ...surveyData
      } as Survey;
      setSurveys([newSurvey, ...surveys]);
    }
    setIsModalOpen(false);
  };
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('surveysPage.title')}</h1>
        {canManage && (
            <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                {t('surveysPage.create')}
            </button>
        )}
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('surveysPage.table.title')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('surveysPage.table.createdAt')}</th>
              {canManage && <th className={`px-6 py-3 ${language === 'ar' ? 'text-left' : 'text-right'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('common.actions')}</th>}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {surveys.map((survey) => (
              <tr key={survey.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{survey.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(survey.createdAt).toLocaleDateString(locale)}</td>
                {canManage && (
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${language === 'ar' ? 'text-left' : 'text-right'} space-x-4 space-x-reverse`}>
                    <button onClick={() => handleEdit(survey)} className="text-blue-600 hover:text-blue-900">{t('common.edit')}</button>
                    <button onClick={() => handleDelete(survey.id)} className="text-red-600 hover:text-red-900">{t('common.delete')}</button>
                    </td>
                )}
              </tr>
            ))}
            {surveys.length === 0 && (
                <tr><td colSpan={canManage ? 3 : 2} className="text-center p-8 text-slate-500 dark:text-slate-400">{t('surveysPage.noSurveys')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSurvey ? t('surveysPage.edit') : t('surveysPage.create')}>
          <SurveyForm survey={editingSurvey} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default SurveysPage;