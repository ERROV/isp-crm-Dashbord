

import React, { useState } from 'react';
import type { Contact } from '../types';
import { ContactType, Permission } from '../types';
import Modal from '../components/common/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { TranslationKey } from '../translations';

interface ContactsPageProps {
    contacts: Contact[];
    setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
}

const ContactForm: React.FC<{
  contact: Partial<Contact> | null;
  onSave: (contact: Partial<Contact>) => void;
  onCancel: () => void;
}> = ({ contact, onSave, onCancel }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<Partial<Contact>>(
        contact || { name: '', email: '', phone: '', company: '', type: ContactType.CUSTOMER }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev!, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('contactsPage.form.name')}</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('contactsPage.form.email')}</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('contactsPage.form.phone')}</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('contactsPage.form.company')}</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('contactsPage.form.type')}</label>
                <select name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    {Object.values(ContactType).map(type => <option key={type} value={type}>{t(`contactType.${type}` as TranslationKey)}</option>)}
                </select>
            </div>
            <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">{t('common.cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('common.save')}</button>
            </div>
        </form>
    );
};


const ContactsPage: React.FC<ContactsPageProps> = ({ contacts, setContacts }) => {
  const { hasPermission } = useAuth();
  const { t, language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const canManage = hasPermission(Permission.MANAGE_CONTACTS);

  const handleAdd = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t('common.confirmDeleteMessage'))) {
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  const handleSave = (contactData: Partial<Contact>) => {
    if (editingContact) {
      setContacts(contacts.map(c => c.id === editingContact.id ? { ...c, ...contactData } as Contact : c));
    } else {
      const newContact: Contact = {
        id: Date.now(),
        ...contactData
      } as Contact;
      setContacts([newContact, ...contacts]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('contactsPage.title')}</h1>
        {canManage && (
            <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                {t('contactsPage.addContact')}
            </button>
        )}
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('contactsPage.table.name')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('contactsPage.table.email')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('contactsPage.table.phone')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('contactsPage.table.type')}</th>
              {canManage && <th className={`px-6 py-3 ${language === 'ar' ? 'text-left' : 'text-right'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('common.actions')}</th>}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{contact.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{contact.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{contact.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                    {t(`contactType.${contact.type}` as TranslationKey)}
                  </span>
                </td>
                {canManage && (
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${language === 'ar' ? 'text-left' : 'text-right'} space-x-4 space-x-reverse`}>
                    <button onClick={() => handleEdit(contact)} className="text-blue-600 hover:text-blue-900">{t('common.edit')}</button>
                    <button onClick={() => handleDelete(contact.id)} className="text-red-600 hover:text-red-900">{t('common.delete')}</button>
                    </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingContact ? t('contactsPage.editContact') : t('contactsPage.addContact')}>
          <ContactForm 
              contact={editingContact}
              onSave={handleSave}
              onCancel={() => setIsModalOpen(false)}
          />
      </Modal>
    </div>
  );
};

export default ContactsPage;