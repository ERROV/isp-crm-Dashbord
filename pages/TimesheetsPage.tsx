import React, { useState, useMemo } from 'react';
import type { TimesheetEntry } from '../types';
import { Permission } from '../types';
import Modal from '../components/common/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface TimesheetsPageProps {
  timesheets: TimesheetEntry[];
  setTimesheets: React.Dispatch<React.SetStateAction<TimesheetEntry[]>>;
}

const TimesheetForm: React.FC<{
  onSave: (entry: Omit<TimesheetEntry, 'id' | 'userId'>) => void;
  onCancel: () => void;
}> = ({ onSave, onCancel }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        hours: 8,
        description: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'hours' ? parseFloat(value) : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Omit<TimesheetEntry, 'id' | 'userId'>);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('timesheetsPage.form.date')}</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('timesheetsPage.form.hours')}</label>
                    <input type="number" step="0.5" name="hours" value={formData.hours} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('timesheetsPage.form.description')}</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">{t('common.cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('timesheetsPage.form.log')}</button>
            </div>
        </form>
    );
};


const TimesheetsPage: React.FC<TimesheetsPageProps> = ({ timesheets, setTimesheets }) => {
  const { currentUser, hasPermission } = useAuth();
  const { t, locale, language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const myTimesheets = useMemo(() => {
    return timesheets.filter(t => t.userId === currentUser!.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [timesheets, currentUser]);

  const handleSave = (entryData: Omit<TimesheetEntry, 'id' | 'userId'>) => {
    const newEntry: TimesheetEntry = {
        id: Date.now(),
        userId: currentUser!.id,
        ...entryData
    };
    setTimesheets(prev => [newEntry, ...prev]);
    setIsModalOpen(false);
  };
  
  const totalHours = myTimesheets.reduce((acc, curr) => acc + curr.hours, 0);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('timesheetsPage.title')}</h1>
            <p className="text-slate-500 dark:text-slate-400">{t('timesheetsPage.totalHours', {hours: totalHours.toFixed(1)})}</p>
        </div>
        {hasPermission(Permission.MANAGE_TIMESHEETS) && (
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            {t('timesheetsPage.logHours')}
            </button>
        )}
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('timesheetsPage.table.date')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('timesheetsPage.table.description')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('timesheetsPage.table.hours')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {myTimesheets.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(entry.date).toLocaleDateString(locale)}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">{entry.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-600 dark:text-slate-300">{entry.hours.toFixed(1)}</td>
              </tr>
            ))}
             {myTimesheets.length === 0 && (
                <tr>
                    <td colSpan={3} className="text-center p-8 text-slate-500 dark:text-slate-400">{t('timesheetsPage.noEntries')}</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('timesheetsPage.form.title')}>
          <TimesheetForm 
            onSave={handleSave}
            onCancel={() => setIsModalOpen(false)}
          />
      </Modal>
    </div>
  );
};

export default TimesheetsPage;