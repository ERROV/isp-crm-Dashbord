import React from 'react';
import type { Approval, TimeOffRequest, User } from '../types';
import { ApprovalStatus, Permission, ApprovalType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { TranslationKey } from '../translations';

interface ApprovalsPageProps {
  approvals: Approval[];
  setApprovals: React.Dispatch<React.SetStateAction<Approval[]>>;
  timeOffRequests: TimeOffRequest[];
  setTimeOffRequests: React.Dispatch<React.SetStateAction<TimeOffRequest[]>>;
  users: User[];
}

const ApprovalsPage: React.FC<ApprovalsPageProps> = ({ approvals, setApprovals, timeOffRequests, setTimeOffRequests, users }) => {
  const { hasPermission } = useAuth();
  const { t, language } = useLanguage();
  const canManage = hasPermission(Permission.MANAGE_APPROVALS);

  const handleApprovalAction = (approvalId: number, newStatus: ApprovalStatus) => {
    if (!canManage) return;

    const targetApproval = approvals.find(a => a.id === approvalId);
    if (!targetApproval) return;
    
    const updatedApprovals = approvals.map(app => 
      app.id === approvalId ? { ...app, status: newStatus } : app
    );
    setApprovals(updatedApprovals);

    if (targetApproval.requestType === ApprovalType.TIME_OFF) {
      const updatedRequests = timeOffRequests.map(req =>
        req.id === targetApproval.requestId ? { ...req, status: newStatus } : req
      );
      setTimeOffRequests(updatedRequests);
    }
  };

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || t('common.unknownUser');

  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case ApprovalStatus.PENDING: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case ApprovalStatus.APPROVED: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case ApprovalStatus.REJECTED: return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">{t('approvalsPage.title')}</h1>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('approvalsPage.table.requester')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('approvalsPage.table.requestType')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('approvalsPage.table.details')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('approvalsPage.table.status')}</th>
              {canManage && <th className={`px-6 py-3 ${language === 'ar' ? 'text-left' : 'text-right'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('approvalsPage.table.action')}</th>}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {approvals.map((approval) => (
              <tr key={approval.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{getUserName(approval.requesterId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{t(`approvalType.${approval.requestType}` as TranslationKey)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{approval.details}</td>
                <td className="px-6 py-4"><span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(approval.status)}`}>{t(`approvalStatus.${approval.status}` as TranslationKey)}</span></td>
                {canManage && (
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${language === 'ar' ? 'text-left' : 'text-right'}`}>
                    {approval.status === ApprovalStatus.PENDING ? (
                        <div className="flex gap-2 justify-end">
                        <button onClick={() => handleApprovalAction(approval.id, ApprovalStatus.APPROVED)} className="px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600">{t('approvalsPage.action.approve')}</button>
                        <button onClick={() => handleApprovalAction(approval.id, ApprovalStatus.REJECTED)} className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600">{t('approvalsPage.action.reject')}</button>
                        </div>
                    ) : (
                        <span className="text-slate-400">{t('approvalsPage.action.done')}</span>
                    )}
                    </td>
                )}
              </tr>
            ))}
             {approvals.length === 0 && (
                <tr>
                    <td colSpan={canManage ? 5 : 4} className="text-center p-8 text-slate-500 dark:text-slate-400">{t('approvalsPage.noRequests')}</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovalsPage;