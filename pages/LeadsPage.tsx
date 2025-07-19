import React, { useState } from 'react';
import type { Lead, User } from '../types';
import { LeadStatus, LeadType, Permission } from '../types';
import Modal from '../components/common/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { TranslationKey } from '../translations';


// --- KANBAN VIEW COMPONENTS ---

const KanbanCard: React.FC<{ lead: Lead, onClick: () => void, canDrag: boolean }> = ({ lead, onClick, canDrag }) => (
  <div
    draggable={canDrag}
    onDragStart={(e) => canDrag && e.dataTransfer.setData("leadId", lead.id.toString())}
    onClick={onClick}
    className={`bg-white dark:bg-slate-700 p-3 rounded-md shadow-sm mb-3 ${canDrag ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
  >
    <p className="font-bold text-sm text-slate-800 dark:text-slate-100">{lead.firstName} {lead.familyName}</p>
    <p className="text-xs text-slate-500 dark:text-slate-400">{lead.phone1}</p>
    <div className="text-xs text-slate-400 dark:text-slate-500 mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
      {lead.description.substring(0, 50)}{lead.description.length > 50 ? '...' : ''}
    </div>
  </div>
);

const KanbanColumn: React.FC<{
  status: LeadStatus,
  leads: Lead[],
  onDrop: (status: LeadStatus, leadId: string) => void,
  onCardClick: (lead: Lead) => void,
  canManage: boolean
}> = ({ status, leads, onDrop, onCardClick, canManage }) => {
  const { t } = useLanguage();
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (canManage) {
        const leadId = e.dataTransfer.getData("leadId");
        onDrop(status, leadId);
    }
  };
  
  const statusConfig: {[key in LeadStatus]?: {color: string, titleKey: TranslationKey}} = {
      [LeadStatus.NEW]: { color: 'border-t-blue-500', titleKey: 'leadsPage.kanban.new' },
      [LeadStatus.CONTACTED]: { color: 'border-t-yellow-500', titleKey: 'leadsPage.kanban.contacted' },
      [LeadStatus.QUALIFIED]: { color: 'border-t-green-500', titleKey: 'leadsPage.kanban.qualified' }
  };

  const config = statusConfig[status];
  if (!config) return null;

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`bg-slate-100 dark:bg-slate-900/50 rounded-lg p-2 w-full md:w-1/3 border-t-4 ${config.color}`}
    >
      <h3 className="font-semibold text-slate-700 dark:text-slate-200 p-2">{t(config.titleKey)} ({leads.length})</h3>
      <div className="p-1 h-[calc(100vh-20rem)] overflow-y-auto">
        {leads.map(lead => <KanbanCard key={lead.id} lead={lead} onClick={() => onCardClick(lead)} canDrag={canManage}/>)}
      </div>
    </div>
  );
};


// --- LEAD FORM COMPONENT ---
const initialLeadData: Omit<Lead, 'id' | 'createdAt' | 'creatorId'> = {
    status: LeadStatus.NEW, leadType: LeadType.NEW, customerType: '', firstName: '', secondName: '', thirdName: '', fourthName: '', familyName: '', whatsappNumber: '', phone1: '', phone2: '', phone3: '', exchange: '', area: '', dist: '', street: '', homeNumber: '', rcNumber: '', dpNumber: '', olt: 0, dpPort: 0, slot: 0, ssid: '', customerDevices: 0, addedOnSite: false, nearestPoint: '', sourceCompensation: 0, attachments: [], description: '',
};

const inputStyles = "mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500";
const labelStyles = "block text-sm font-medium text-slate-700 dark:text-slate-300 text-right";
const fieldsetStyles = "border border-slate-300 dark:border-slate-700 p-4 rounded-md";
const legendStyles = "px-2 font-semibold text-slate-700 dark:text-slate-200";

const LeadForm: React.FC<{ lead: Partial<Lead> | null, onSave: (lead: Partial<Lead>) => void, onCancel: () => void }> = ({ lead, onSave, onCancel }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<Partial<Lead>>(lead || initialLeadData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        let processedValue: any = value;
        if (type === 'checkbox') { processedValue = (e.target as HTMLInputElement).checked; }
        else if (type === 'number') { processedValue = value === '' ? '' : Number(value); }
        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            const files = Array.from(e.target.files).map(file => ({ name: file.name, type: file.type, size: file.size }));
            setFormData(prev => ({ ...prev, attachments: files }));
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset className={fieldsetStyles}>
                <legend className={legendStyles}>{t('leadsPage.form.details')}</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelStyles}>{t('leadsPage.form.leadType')}</label><select name="leadType" value={formData.leadType} onChange={handleChange} className={inputStyles}>{Object.values(LeadType).map(type => <option key={type} value={type}>{t(`leadType.${type}` as TranslationKey)}</option>)}</select></div>
                    <div><label className={labelStyles}>{t('leadsPage.form.customerType')}</label><input type="text" name="customerType" value={formData.customerType} onChange={handleChange} className={inputStyles} placeholder={t('leadsPage.form.customerType')} /></div>
                </div>
            </fieldset>

            <fieldset className={fieldsetStyles}><legend className={legendStyles}>{t('leadsPage.form.customerInfo')}</legend><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder={t('leadsPage.form.firstName')} className={inputStyles} required/><input type="text" name="secondName" value={formData.secondName} onChange={handleChange} placeholder={t('leadsPage.form.secondName')} className={inputStyles}/><input type="text" name="thirdName" value={formData.thirdName} onChange={handleChange} placeholder={t('leadsPage.form.thirdName')} className={inputStyles}/><input type="text" name="fourthName" value={formData.fourthName} onChange={handleChange} placeholder={t('leadsPage.form.fourthName')} className={inputStyles}/><input type="text" name="familyName" value={formData.familyName} onChange={handleChange} placeholder={t('leadsPage.form.familyName')} className={inputStyles} required/></div></fieldset>
            <fieldset className={fieldsetStyles}><legend className={legendStyles}>{t('leadsPage.form.contactInfo')}</legend><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><input type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} placeholder={t('leadsPage.form.whatsapp')} className={inputStyles} required /><input type="tel" name="phone1" value={formData.phone1} onChange={handleChange} placeholder={t('leadsPage.form.phone1')} className={inputStyles} required /><input type="tel" name="phone2" value={formData.phone2} onChange={handleChange} placeholder={t('leadsPage.form.phone2')} className={inputStyles} /></div></fieldset>
            <fieldset className={fieldsetStyles}><legend className={legendStyles}>{t('leadsPage.form.addressTech')}</legend><div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"><input type="text" name="exchange" value={formData.exchange} onChange={handleChange} placeholder={t('leadsPage.form.exchange')} className={inputStyles}/><input type="text" name="area" value={formData.area} onChange={handleChange} placeholder={t('leadsPage.form.area')} className={inputStyles}/><input type="text" name="dist" value={formData.dist} onChange={handleChange} placeholder={t('leadsPage.form.dist')} className={inputStyles}/><input type="text" name="street" value={formData.street} onChange={handleChange} placeholder={t('leadsPage.form.street')} className={inputStyles}/><input type="text" name="homeNumber" value={formData.homeNumber} onChange={handleChange} placeholder={t('leadsPage.form.homeNumber')} className={inputStyles}/><input type="text" name="rcNumber" value={formData.rcNumber} onChange={handleChange} placeholder={t('leadsPage.form.rcNumber')} className={inputStyles}/><input type="text" name="dpNumber" value={formData.dpNumber} onChange={handleChange} placeholder={t('leadsPage.form.dpNumber')} className={inputStyles} required/><input type="text" name="nearestPoint" value={formData.nearestPoint} onChange={handleChange} placeholder={t('leadsPage.form.nearestPoint')} className={`${inputStyles} md:col-span-2`}/><input type="number" name="olt" value={formData.olt} onChange={handleChange} placeholder={t('leadsPage.form.olt')} className={inputStyles}/><input type="number" name="dpPort" value={formData.dpPort} onChange={handleChange} placeholder={t('leadsPage.form.dpPort')} className={inputStyles}/><input type="number" name="slot" value={formData.slot} onChange={handleChange} placeholder={t('leadsPage.form.slot')} className={inputStyles}/><input type="text" name="ssid" value={formData.ssid} onChange={handleChange} placeholder={t('leadsPage.form.ssid')} className={inputStyles}/></div></fieldset>
            <fieldset className={fieldsetStyles}><legend className={legendStyles}>{t('leadsPage.form.additionalInfo')}</legend><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><div><label className={labelStyles}>{t('leadsPage.form.customerDevices')}</label><input type="number" name="customerDevices" value={formData.customerDevices} onChange={handleChange} className={inputStyles}/></div><div><label className={labelStyles}>{t('leadsPage.form.sourceCompensation')}</label><input type="number" name="sourceCompensation" value={formData.sourceCompensation} onChange={handleChange} className={inputStyles}/></div><div className="flex items-center pt-6"><input type="checkbox" id="addedOnSite" name="addedOnSite" checked={formData.addedOnSite} onChange={handleChange} className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"/><label htmlFor="addedOnSite" className="mx-2 block text-sm text-slate-900 dark:text-slate-300">{t('leadsPage.form.addedOnSite')}</label></div></div><div className="mt-4"><label className={labelStyles}>{t('leadsPage.form.attachments')}</label><input type="file" multiple onChange={handleFileChange} className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-700 dark:file:text-blue-300 dark:hover:file:bg-slate-600"/></div><div className="mt-4"><label className={labelStyles}>{t('leadsPage.form.description')}</label><textarea name="description" value={formData.description} onChange={handleChange} rows={3} className={inputStyles}></textarea></div></fieldset>

            <div className="flex justify-end space-x-2 space-x-reverse pt-4 border-t border-slate-200 dark:border-slate-700">
                 <button type="button" onClick={onCancel} className="px-6 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">{t('common.cancel')}</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('common.save')}</button>
            </div>
        </form>
    );
};

// --- MAIN LEADS PAGE COMPONENT ---
interface LeadsPageProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  users: User[];
}

const LeadsPage: React.FC<LeadsPageProps> = ({ leads, setLeads, users }) => {
  const { currentUser, hasPermission } = useAuth();
  const { t, language, locale } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  
  const canManage = hasPermission(Permission.MANAGE_LEADS);

  const handleAddLead = () => { setEditingLead(null); setIsModalOpen(true); };
  const handleViewLead = (lead: Lead) => { setEditingLead(lead); setIsModalOpen(true); };
  
  const handleSaveLead = (leadData: Partial<Lead>) => {
    if (editingLead) {
      setLeads(leads.map(l => l.id === editingLead.id ? { ...l, ...leadData } as Lead : l));
    } else {
      const newLead: Lead = { ...initialLeadData, ...leadData, id: Date.now(), createdAt: new Date().toISOString(), creatorId: currentUser!.id };
      setLeads([newLead, ...leads]);
    }
    setIsModalOpen(false);
  };

  const handleLeadDrop = (newStatus: LeadStatus, leadId: string) => {
    const lead = leads.find(l => l.id.toString() === leadId);
    if (lead && lead.status !== newStatus) {
      setLeads(prevLeads => prevLeads.map(l => l.id.toString() === leadId ? { ...l, status: newStatus } : l));
    }
  };

  const getStatusColor = (status: LeadStatus) => ({
      [LeadStatus.NEW]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      [LeadStatus.CONTACTED]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
      [LeadStatus.QUALIFIED]: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
      [LeadStatus.UNQUALIFIED]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
      [LeadStatus.LOST]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  }[status] || 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('leadsPage.title')}</h1>
        <div className="flex items-center gap-4">
            <div className="p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
                <button onClick={() => setViewMode('kanban')} className={`px-3 py-1 text-sm rounded-md ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-800 shadow' : ''}`}>{t('leadsPage.viewKanban')}</button>
                <button onClick={() => setViewMode('table')} className={`px-3 py-1 text-sm rounded-md ${viewMode === 'table' ? 'bg-white dark:bg-slate-800 shadow' : ''}`}>{t('leadsPage.viewTable')}</button>
            </div>
            {canManage && (
                <button onClick={handleAddLead} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                {t('leadsPage.addLead')}
                </button>
            )}
        </div>
      </div>
      
      {viewMode === 'kanban' ? (
        <div className="flex flex-col md:flex-row gap-4">
          {[LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.QUALIFIED].map(status => (
            <KanbanColumn 
              key={status} 
              status={status} 
              leads={leads.filter(l => l.status === status)}
              onDrop={handleLeadDrop}
              onCardClick={handleViewLead}
              canManage={canManage}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('leadsPage.table.fullName')}</th>
                <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('leadsPage.table.status')}</th>
                <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('leadsPage.table.phone')}</th>
                <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('leadsPage.table.creator')}</th>
                <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('leadsPage.table.createdAt')}</th>
                <th className={`px-6 py-3 ${language === 'ar' ? 'text-left' : 'text-right'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('leadsPage.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {leads.map((lead) => {
                const creator = users.find(u => u.id === lead.creatorId);
                return (
                <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{`${lead.firstName} ${lead.familyName}`}</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>{t(`leadStatus.${lead.status}` as TranslationKey)}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{lead.phone1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{creator?.name || t('common.unknownUser')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(lead.createdAt).toLocaleDateString(locale)}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${language === 'ar' ? 'text-left' : 'text-right'}`}><button onClick={() => handleViewLead(lead)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">{t('common.view')} / {t('common.edit')}</button></td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingLead ? t('leadsPage.editLead') : t('leadsPage.addLead')}>
          <LeadForm lead={editingLead} onSave={handleSaveLead} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default LeadsPage;