import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { Ticket, User, Subscriber, Reseller, DescriptionPart, Notification } from '../types';
import { TicketStatus, Permission, ProblemType } from '../types';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import { summarizeTicket } from '../services/geminiService';
import { ICONS } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { TranslationKey } from '../translations';

interface TicketsPageProps {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  users: User[];
  subscribers: Subscriber[];
  resellers: Reseller[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const TicketDetailsModal: React.FC<{
  ticket: Ticket;
  users: User[];
  subscribers: Subscriber[];
  resellers: Reseller[];
  onClose: () => void;
  onUpdateTicket: (updatedTicket: Ticket, newAgentId?: string) => void;
}> = ({ ticket, users, subscribers, resellers, onClose, onUpdateTicket }) => {
  const { currentUser, hasPermission } = useAuth();
  const { t, language } = useLanguage();
  const [newComment, setNewComment] = useState('');
  const [newStatus, setNewStatus] = useState<TicketStatus>(ticket.status);
  const [selectedResellerId, setSelectedResellerId] = useState<number|undefined>(ticket.resellerId ? Number(ticket.resellerId) : undefined);
  const [aiSummary, setAiSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const getUserId = (user: Ticket['agentId' | 'clientId']): string | undefined => {
    if (!user) return undefined;
    if (typeof user === 'string') return user; // It could be an ObjectId string
    if (typeof user === 'number') return String(user);
    if (typeof user === 'object' && 'id' in user && user.id) {
        return String(user.id);
    }
     if (typeof user === 'object' && '_id' in user && user._id) {
        return String(user._id);
    }
    return undefined;
  };
  
  const [assignedAgentId, setAssignedAgentId] = useState<string | undefined>(getUserId(ticket.agentId));
  
  const [diagnosis, setDiagnosis] = useState(ticket.diagnosis || '');
  const [actionTaken, setActionTaken] = useState(ticket.actionTaken || '');
  const [result, setResult] = useState(ticket.result || '');

  
  const client = useMemo(() => users.find(u => String(u.id) === getUserId(ticket.clientId)), [users, ticket.clientId]);
  const agent = useMemo(() => users.find(u => String(u.id) === assignedAgentId), [users, assignedAgentId]);
  const subscriber = useMemo(() => subscribers.find(s => s.id === ticket.subscriberId), [subscribers, ticket.subscriberId]);
  const reseller = useMemo(() => resellers.find(r => r.id === ticket.resellerId), [resellers, ticket.resellerId]);

  const canManage = hasPermission(Permission.MANAGE_TICKETS);
  const isResellerManager = currentUser?.role.id === 5 && !!currentUser.resellerId;

  const assignableAgents = useMemo(() => {
    if (!canManage) return [];
    if (isResellerManager) {
      // Reseller can assign to their own employees (roleId 6)
      return users.filter(u => u.resellerId === currentUser.resellerId && u.roleId === 6);
    }
    // Admin/Support Manager can assign to other support managers (2) or any reseller employee (6)
    const supportRoles = [2, 6];
    return users.filter(u => u.roleId && supportRoles.includes(u.roleId));
  }, [users, currentUser, canManage, isResellerManager]);

  const handleUpdate = () => {
    const originalAgentId = getUserId(ticket.agentId);
    const newAgentId = assignedAgentId;
    
    const updatedTicket: Ticket = {
      ...ticket,
      comments: newComment.trim() ? [...ticket.comments, { author: currentUser!.name, text: newComment, date: new Date().toISOString() }] : ticket.comments,
      status: newStatus,
      resellerId: selectedResellerId,
      agentId: assignedAgentId,
      diagnosis,
      actionTaken,
      result,
      updatedAt: new Date().toISOString(),
    };
    onUpdateTicket(updatedTicket, newAgentId !== originalAgentId ? newAgentId : undefined);
    setNewComment('');
  };
  
  const handleForward = () => {
      if(!selectedResellerId) return;
      handleUpdate();
  }

  const handleGenerateSummary = useCallback(async () => {
    setIsLoadingSummary(true);
    const summary = await summarizeTicket(ticket, language);
    setAiSummary(summary);
    setIsLoadingSummary(false);
  }, [ticket, language]);
  
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';

  const getAuthorName = (author: typeof ticket.comments[0]['author']): string => {
    if (typeof author === 'string') return author;
    if (typeof author === 'object' && author && 'name' in author) {
        return (author as User).name;
    }
    if (typeof author === 'object' && author && 'toString' in author) {
        return author.toString(); // For ObjectId
    }
    return t('common.unknownUser');
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={`${t('ticketsPage.ticket')} #${ticket.id}: ${ticket.title}`}>
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <p><strong className="text-slate-600 dark:text-slate-400">{t('ticketsPage.client')}:</strong> <span className="text-slate-800 dark:text-slate-200">{client?.name}</span></p>
              <p><strong className="text-slate-600 dark:text-slate-400">{t('ticketsPage.subscriber')}:</strong> <span className="text-slate-800 dark:text-slate-200">{subscriber?.name || t('common.unassigned')}</span></p>
              <div>
                <strong className="text-slate-600 dark:text-slate-400 block mb-1">{t('ticketsPage.agent')}:</strong>
                {canManage && assignableAgents.length > 0 ? (
                   <select
                      value={assignedAgentId || ''}
                      onChange={(e) => setAssignedAgentId(e.target.value || undefined)}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-md py-1 px-2 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">{t('common.unassigned')}</option>
                      {assignableAgents.map(agent => (
                        <option key={agent.id} value={agent.id}>{agent.name}</option>
                      ))}
                    </select>
                ) : (
                  <span className="text-slate-800 dark:text-slate-200">{agent?.name || t('common.unassigned')}</span>
                )}
              </div>
              <p><strong className="text-slate-600 dark:text-slate-400">{t('ticketsPage.reseller')}:</strong> <span className="text-slate-800 dark:text-slate-200">{reseller?.name || t('common.unassigned')}</span></p>
              <p><strong className="text-slate-600 dark:text-slate-400">{t('ticketsPage.createdAt')}:</strong> <span className="text-slate-800 dark:text-slate-200">{new Date(ticket.createdAt).toLocaleString(locale)}</span></p>
              <p><strong className="text-slate-600 dark:text-slate-400">{t('ticketsPage.lastUpdated')}:</strong> <span className="text-slate-800 dark:text-slate-200">{new Date(ticket.updatedAt).toLocaleString(locale)}</span></p>
              <p><strong className="text-slate-600 dark:text-slate-400">{t('ticketsPage.problemType')}:</strong> <span className="text-slate-800 dark:text-slate-200">{t(`problemType.${ticket.problemType}` as TranslationKey)}</span></p>

          </div>
          <div className="mt-4">
            <strong className="text-slate-600 dark:text-slate-400">{t('common.description')}:</strong>
            <div className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap space-y-2 mt-2">
                {ticket.descriptionParts.map((part, index) => part.type === 'text' ? (
                    <p key={index}>{part.content}</p>
                ) : (
                    <img key={index} src={part.content} alt="ticket attachment" className="max-w-full md:max-w-sm rounded-md my-2" />
                ))}
            </div>
          </div>
        </div>

        {hasPermission(Permission.USE_TICKET_AI_SUMMARY) && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-lg">
            <div className="flex justify-between items-center">
                <h4 className="font-bold text-blue-800 dark:text-blue-300">{t('ticketsPage.aiSummary')}</h4>
                <button onClick={handleGenerateSummary} disabled={isLoadingSummary} className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed">
                  {isLoadingSummary ? <Spinner/> : ICONS.ai}
                  {isLoadingSummary ? t('common.loading') : t('ticketsPage.generateSummary')}
                </button>
            </div>
            {aiSummary && <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">{aiSummary}</p>}
          </div>
        )}
        
        <div className="space-y-3 max-h-60 overflow-y-auto p-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">{t('ticketsPage.conversation')}</h4>
            {ticket.comments.map((comment, index) => (
                <div key={index} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    <p className="font-semibold text-slate-700 dark:text-slate-200">{getAuthorName(comment.author)}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{comment.text}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 text-left">{new Date(comment.date).toLocaleString(locale)}</p>
                </div>
            ))}
        </div>
        
        {canManage && (
             <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="font-medium text-slate-700 dark:text-slate-300 text-right">{t('ticketsPage.diagnosis')}:</label>
                        <textarea value={diagnosis} onChange={e => setDiagnosis(e.target.value)} rows={2} className="w-full mt-1 border border-slate-300 dark:border-slate-600 rounded-md p-2 bg-white dark:bg-slate-700 dark:text-white" />
                    </div>
                    <div>
                        <label className="font-medium text-slate-700 dark:text-slate-300 text-right">{t('ticketsPage.actionTaken')}:</label>
                        <textarea value={actionTaken} onChange={e => setActionTaken(e.target.value)} rows={2} className="w-full mt-1 border border-slate-300 dark:border-slate-600 rounded-md p-2 bg-white dark:bg-slate-700 dark:text-white" />
                    </div>
                </div>
                 <div>
                    <label className="font-medium text-slate-700 dark:text-slate-300 text-right">{t('ticketsPage.result')}:</label>
                    <textarea value={result} onChange={e => setResult(e.target.value)} rows={2} className="w-full mt-1 border border-slate-300 dark:border-slate-600 rounded-md p-2 bg-white dark:bg-slate-700 dark:text-white" />
                </div>
                 <div className="space-y-3">
                     <label className="font-medium text-slate-700 dark:text-slate-300">{t('ticketsPage.forwardToReseller')}:</label>
                     <div className="flex gap-2">
                        <select value={selectedResellerId || ''} onChange={(e) => setSelectedResellerId(Number(e.target.value) || undefined)} className="flex-grow border border-slate-300 dark:border-slate-600 rounded-md p-2 bg-white dark:bg-slate-700 dark:text-white">
                          <option value="">{t('common.select')}</option>
                          {resellers.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                       </select>
                       <button onClick={handleForward} className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700">{t('ticketsPage.forward')}</button>
                    </div>
                </div>
            </div>
        )}

        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('ticketsPage.addCommentPlaceholder')}
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md p-2 bg-white dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
            rows={3}
          />
          <div className='flex justify-between items-center'>
            {canManage && (
                <div className="flex items-center gap-4">
                   <label className="font-medium text-slate-700 dark:text-slate-300">{t('ticketsPage.updateStatus')}:</label>
                   <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as TicketStatus)} className="border border-slate-300 dark:border-slate-600 rounded-md p-2 bg-white dark:bg-slate-700 dark:text-white">
                      {Object.values(TicketStatus).map(status => <option key={status} value={status}>{t(`ticketStatus.${status}` as TranslationKey)}</option>)}
                   </select>
                </div>
              )}
            <div className="flex justify-end">
              <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">{t('common.send')}</button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};


const CreateTicketModal: React.FC<{
  onClose: () => void;
  onCreateTicket: (newTicket: Omit<Ticket, '_id' | 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  subscribers: Subscriber[];
  preselectedSubscriberId?: number;
}> = ({ onClose, onCreateTicket, subscribers, preselectedSubscriberId }) => {
    const { currentUser } = useAuth();
    const { t } = useLanguage();
    const [title, setTitle] = useState('');
    const [subscriberId, setSubscriberId] = useState<number|undefined>(preselectedSubscriberId);
    const [problemType, setProblemType] = useState<ProblemType>(ProblemType.OTHER);
    const [descriptionParts, setDescriptionParts] = useState<DescriptionPart[]>([{type: 'text', content: ''}]);

    const handleDescriptionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newParts = [...descriptionParts];
        const textPart = newParts.find(p => p.type === 'text');
        if (textPart) {
            textPart.content = e.target.value;
        } else {
            newParts.unshift({type: 'text', content: e.target.value});
        }
        setDescriptionParts(newParts);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setDescriptionParts(prev => [...prev, {type: 'image', content: reader.result as string}]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        const textContent = descriptionParts.find(p => p.type === 'text')?.content || '';
        if (!title.trim() || !textContent.trim() || !currentUser) return;
        
        const selectedSub = subscribers.find(s => s.id === subscriberId);
        
        onCreateTicket({
            title,
            descriptionParts,
            clientId: currentUser.id,
            status: TicketStatus.OPEN,
            subscriberId: subscriberId,
            resellerId: selectedSub?.resellerId,
            problemType,
        });
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={t('ticketsPage.createTicketTitle')}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('ticketsPage.ticketSubject')}</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('ticketsPage.subscriber')}</label>
                     <select value={subscriberId || ''} onChange={(e) => setSubscriberId(Number(e.target.value))} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                         <option value="">{t('common.select')}</option>
                         {subscribers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.username})</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('ticketsPage.problemType')}</label>
                     <select value={problemType} onChange={(e) => setProblemType(e.target.value as ProblemType)} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                         {Object.values(ProblemType).map(type => <option key={type} value={type}>{t(`problemType.${type}` as TranslationKey)}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('ticketsPage.problemDescription')}</label>
                    <textarea value={descriptionParts.find(p=>p.type==='text')?.content || ''} onChange={handleDescriptionTextChange} rows={5} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    <div className="mt-2 flex justify-between items-center">
                        <label htmlFor="image-upload" className="cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:underline">
                            {t('ticketsPage.addImage')}
                        </label>
                        <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </div>
                     <div className="mt-2 space-y-2">
                        {descriptionParts.filter(p => p.type === 'image').map((part, index) => (
                            <img key={index} src={part.content} alt="preview" className="max-w-xs rounded-md" />
                        ))}
                    </div>
                </div>
                <div className="flex justify-end pt-4">
                    <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">{t('common.create')}</button>
                </div>
            </div>
        </Modal>
    );
};

const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN: return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case TicketStatus.IN_PROGRESS: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case TicketStatus.RESOLVED: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case TicketStatus.CLOSED: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

const TicketsPage: React.FC<TicketsPageProps> = ({ tickets, setTickets, users, subscribers, resellers, setNotifications }) => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { currentUser, hasPermission } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';
  
  const preselectedSubscriberId = router.query?.subscriberId;

  useEffect(() => {
    if (preselectedSubscriberId) {
      setIsCreating(true);
      // Clean up state after use by replacing the URL
      router.replace('/tickets', undefined, { shallow: true });
    }
  }, [preselectedSubscriberId, router]);


  const filteredTickets = useMemo(() => {
    if (!currentUser) return [];
    const isReseller = currentUser.role.id === 5 && !!currentUser.resellerId;

    if (hasPermission(Permission.VIEW_TICKETS_ALL)) {
      if (isReseller) {
        // Reseller with ALL permission sees tickets for their reseller group
        return tickets.filter(t => String(t.resellerId) === String(currentUser.resellerId));
      }
      return tickets; // Admin sees all
    }
    
    if (isReseller) {
      return tickets.filter(t => String(t.resellerId) === String(currentUser.resellerId));
    }
    
    if (hasPermission(Permission.VIEW_TICKETS_OWN)) {
      // Agents see their assigned tickets, Reseller Employees see assigned tickets
      if (currentUser.role.id === 6) { // Reseller Employee
         return tickets.filter(t => String(t.agentId) === currentUser.id);
      }
       // Other agents see assigned or unassigned tickets (if they aren't tied to a reseller)
       return tickets.filter(t => String(t.agentId) === currentUser!.id || !t.agentId);
    }

    // Clients see their own
    return tickets.filter(t => String(t.clientId) === currentUser!.id);
  }, [tickets, currentUser, hasPermission]);

  const handleUpdateTicket = (updatedTicket: Ticket, newAgentId?: string) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket); // Keep modal open with updated info

    if (newAgentId) {
      const client = users.find(u => String(u.id) === String(updatedTicket.clientId));
      const newNotification: Notification = {
        id: Date.now(),
        userId: newAgentId,
        messageKey: 'notifications.ticketAssigned',
        messagePayload: { ticketId: updatedTicket.id!, clientName: client?.name || 'a client' },
        link: '/tickets',
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
  };
  
  const handleCreateTicket = (newTicketData: Omit<Ticket, '_id' | 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
      const newTicket: Ticket = {
          ...newTicketData,
          _id: `temp_${Date.now()}`,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          comments: []
      } as Ticket;
      setTickets(prev => [newTicket, ...prev]);
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('ticketsPage.title')}</h1>
        {hasPermission(Permission.CREATE_TICKET) && (
          <button onClick={() => setIsCreating(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            {t('ticketsPage.openTicket')}
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>#</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('ticketsPage.table.subject')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('ticketsPage.table.status')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('ticketsPage.subscriber')}</th>
              {hasPermission(Permission.VIEW_TICKETS_ALL) && <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('ticketsPage.table.client')}</th>}
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('ticketsPage.table.lastUpdate')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-left' : 'text-right'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('common.view')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredTickets.map(ticket => (
              <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">{ticket.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">{ticket.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                    {t(`ticketStatus.${ticket.status}` as TranslationKey)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{subscribers.find(s => s.id === ticket.subscriberId)?.name || t('common.unassigned')}</td>
                 {hasPermission(Permission.VIEW_TICKETS_ALL) && <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{users.find(u => String(u.id) === String(ticket.clientId))?.name}</td>}
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(ticket.updatedAt).toLocaleDateString(locale)}</td>
                <td className={`px-6 py-4 text-sm font-medium ${language === 'ar' ? 'text-left' : 'text-right'}`}>
                  <button onClick={() => setSelectedTicket(ticket)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                    {t('common.details')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          users={users}
          subscribers={subscribers}
          resellers={resellers}
          onClose={() => setSelectedTicket(null)}
          onUpdateTicket={handleUpdateTicket}
        />
      )}
      {isCreating && (
          <CreateTicketModal 
            onClose={() => setIsCreating(false)}
            onCreateTicket={handleCreateTicket}
            subscribers={subscribers}
            preselectedSubscriberId={typeof preselectedSubscriberId === 'string' ? parseInt(preselectedSubscriberId, 10) : undefined}
          />
      )}
    </div>
  );
};

export default TicketsPage;