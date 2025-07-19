import React, { useState } from 'react';
import type { TimeOffRequest, Approval } from '../types';
import { ApprovalStatus, ApprovalType, Permission } from '../types';
import Modal from '../components/common/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { TranslationKey } from '../translations';

interface TimeOffPageProps {
  timeOffRequests: TimeOffRequest[];
  setTimeOffRequests: React.Dispatch<React.SetStateAction<TimeOffRequest[]>>;
  setApprovals: React.Dispatch<React.SetStateAction<Approval[]>>;
}

const RequestForm: React.FC<{
  onSave: (request: Omit<TimeOffRequest, 'id' | 'employeeId' | 'status'>) => void;
  onCancel: () => void;
}> = ({ onSave, onCancel }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('timeOffPage.form.startDate')}</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('timeOffPage.form.endDate')}</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('timeOffPage.form.reason')}</label>
                <textarea name="reason" value={formData.reason} onChange={handleChange} rows={4} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">{t('common.cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('timeOffPage.form.submit')}</button>
            </div>
        </form>
    );
};

const TimeOffPage: React.FC<TimeOffPageProps> = ({ timeOffRequests, setTimeOffRequests, setApprovals }) => {
  const { currentUser, hasPermission } = useAuth();
  const { t, locale } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const myRequests = timeOffRequests.filter(req => req.employeeId === currentUser!.id);

  const handleSaveRequest = (requestData: Omit<TimeOffRequest, 'id' | 'employeeId' | 'status'>) => {
    const newRequestId = Date.now();
    const newRequest: TimeOffRequest = {
        id: newRequestId,
        employeeId: currentUser!.id,
        status: ApprovalStatus.PENDING,
        ...requestData,
    };
    
    const newApproval: Approval = {
        id: Date.now() + 1,
        requestId: newRequestId,
        requestType: ApprovalType.TIME_OFF,
        requesterId: currentUser!.id,
        details: requestData.reason, // Keep it language-agnostic
        status: ApprovalStatus.PENDING,
        createdAt: new Date().toISOString()
    };

    setTimeOffRequests(prev => [newRequest, ...prev]);
    setApprovals(prev => [newApproval, ...prev]);
    setIsModalOpen(false);
  };
  
  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case ApprovalStatus.PENDING: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case ApprovalStatus.APPROVED: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case ApprovalStatus.REJECTED: return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    }
  };

  return (
    <div className="p-8">
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('timeOffPage.title')}</h1>
        {hasPermission(Permission.MANAGE_TIME_OFF) && (
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            {t('timeOffPage.newRequest')}
            </button>
        )}
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">{t('timeOffPage.table.reason')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">{t('timeOffPage.table.startDate')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">{t('timeOffPage.table.endDate')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">{t('timeOffPage.table.status')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {myRequests.map((request) => (
              <tr key={request.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{request.reason}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(request.startDate).toLocaleDateString(locale)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(request.endDate).toLocaleDateString(locale)}</td>
                <td className="px-6 py-4"><span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>{t(`approvalStatus.${request.status}` as TranslationKey)}</span></td>
              </tr>
            ))}
             {myRequests.length === 0 && (
                <tr>
                    <td colSpan={4} className="text-center p-8 text-slate-500 dark:text-slate-400">{t('timeOffPage.noRequests')}</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('timeOffPage.form.title')}>
          <RequestForm 
            onSave={handleSaveRequest}
            onCancel={() => setIsModalOpen(false)}
          />
      </Modal>
    </div>
  );
};

export default TimeOffPage;