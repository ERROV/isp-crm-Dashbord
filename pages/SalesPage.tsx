import React, { useState } from 'react';
import type { SaleOrder, Contact } from '../types';
import { SaleStatus, Permission } from '../types';
import Modal from '../components/common/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { TranslationKey } from '../translations';


interface SalesPageProps {
    sales: SaleOrder[];
    setSales: React.Dispatch<React.SetStateAction<SaleOrder[]>>;
    contacts: Contact[];
}


const SaleOrderForm: React.FC<{
  onSave: (order: Partial<SaleOrder>) => void;
  onCancel: () => void;
  contacts: Contact[];
}> = ({ onSave, onCancel, contacts }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<Partial<SaleOrder>>({
        contactId: undefined,
        orderDate: new Date().toISOString().split('T')[0],
        status: SaleStatus.QUOTATION,
        amount: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'contactId' || name === 'amount' ? Number(value) : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('salesPage.form.customer')}</label>
                <select name="contactId" value={formData.contactId} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                    <option value="">{t('common.select')}</option>
                    {contacts.map(contact => <option key={contact.id} value={contact.id}>{contact.name}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('salesPage.form.amount')}</label>
                  <input type="number" step="0.001" name="amount" value={formData.amount} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('salesPage.form.orderDate')}</label>
                  <input type="date" name="orderDate" value={formData.orderDate?.split('T')[0]} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
              </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('salesPage.form.status')}</label>
                <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    {Object.values(SaleStatus).map(status => <option key={status} value={status}>{t(`saleStatus.${status}` as TranslationKey)}</option>)}
                </select>
            </div>
            <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">{t('common.cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('common.save')}</button>
            </div>
        </form>
    );
};

const SalesPage: React.FC<SalesPageProps> = ({ sales, setSales, contacts }) => {
  const { hasPermission } = useAuth();
  const { t, language, locale } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const canManage = hasPermission(Permission.MANAGE_SALES);

  const handleSaveOrder = (orderData: Partial<SaleOrder>) => {
    const newOrder: SaleOrder = {
        id: Date.now(),
        orderNumber: `SO${String(Date.now()).slice(-5)}`,
        ...orderData
    } as SaleOrder;
    setSales([newOrder, ...sales]);
    setIsModalOpen(false);
  };
  
  const getContactName = (contactId: number) => contacts.find(c => c.id === contactId)?.name || t('common.unknownUser');
  
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'OMR',
    minimumFractionDigits: 3
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('salesPage.title')}</h1>
        {canManage && (
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            {t('salesPage.createOrder')}
            </button>
        )}
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('salesPage.table.orderNumber')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('salesPage.table.customer')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('salesPage.table.orderDate')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('salesPage.table.status')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('salesPage.table.amount')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {sales.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">{order.orderNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-slate-200">{getContactName(order.contactId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(order.orderDate).toLocaleDateString(locale)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{t(`saleStatus.${order.status}` as TranslationKey)}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">{currencyFormatter.format(order.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('salesPage.createOrder')}>
          <SaleOrderForm 
            onSave={handleSaveOrder}
            onCancel={() => setIsModalOpen(false)}
            contacts={contacts}
          />
      </Modal>
    </div>
  );
};

export default SalesPage;