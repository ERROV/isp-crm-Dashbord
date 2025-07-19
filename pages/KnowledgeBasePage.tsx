import React, { useState } from 'react';
import type { KnowledgeBaseArticle, User } from '../types';
import { Permission } from '../types';
import Modal from '../components/common/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';


interface KBArticleProps {
  article: KnowledgeBaseArticle;
  onEdit: (article: KnowledgeBaseArticle) => void;
  onDelete: (articleId: number) => void;
  canManage: boolean;
  authorName: string;
}

const ArticleDisplay: React.FC<KBArticleProps> = ({ article, onEdit, onDelete, canManage, authorName }) => {
    const { t, language } = useLanguage();
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md relative">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">{article.title}</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
            {t('knowledgeBase.meta', {
                author: authorName,
                date: new Date(article.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')
            })}
            </p>
            <div className="text-slate-600 dark:text-slate-300 space-y-2 whitespace-pre-wrap">
                {article.content}
            </div>
            {canManage && (
                <div className={`absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'} flex gap-2`}>
                    <button onClick={() => onEdit(article)} className="text-sm text-blue-600 hover:text-blue-800">{t('common.edit')}</button>
                    <button onClick={() => onDelete(article.id)} className="text-sm text-red-600 hover:text-red-800">{t('common.delete')}</button>
                </div>
            )}
        </div>
    );
};


const ArticleForm: React.FC<{
  article: Partial<KnowledgeBaseArticle> | null;
  onSave: (article: Partial<KnowledgeBaseArticle>) => void;
  onCancel: () => void;
}> = ({ article, onSave, onCancel }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState(article || { title: '', content: '' });

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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('knowledgeBase.form.title')}</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('knowledgeBase.form.content')}</label>
                <textarea name="content" value={formData.content} onChange={handleChange} rows={10} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">{t('common.cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('common.save')}</button>
            </div>
        </form>
    );
};


interface KnowledgeBasePageProps {
  articles: KnowledgeBaseArticle[];
  setArticles: React.Dispatch<React.SetStateAction<KnowledgeBaseArticle[]>>;
  users: User[];
}

const KnowledgeBasePage: React.FC<KnowledgeBasePageProps> = ({ articles, setArticles, users }) => {
  const { currentUser, hasPermission } = useAuth();
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<KnowledgeBaseArticle | null>(null);
  
  const canManage = hasPermission(Permission.MANAGE_KNOWLEDGEBASE);

  const handleAddArticle = () => {
    setEditingArticle(null);
    setIsModalOpen(true);
  };

  const handleEditArticle = (article: KnowledgeBaseArticle) => {
    setEditingArticle(article);
    setIsModalOpen(true);
  };

  const handleDeleteArticle = (articleId: number) => {
    if (window.confirm(t('common.confirmDeleteMessage'))) {
        setArticles(articles.filter(a => a.id !== articleId));
    }
  };

  const handleSaveArticle = (articleData: Partial<KnowledgeBaseArticle>) => {
    if (editingArticle) {
        setArticles(articles.map(a => a.id === editingArticle.id ? { ...a, ...articleData } as KnowledgeBaseArticle : a));
    } else {
        const newArticle: KnowledgeBaseArticle = {
            id: Date.now(),
            title: articleData.title || '',
            content: articleData.content || '',
            authorId: currentUser!.id,
            createdAt: new Date().toISOString(),
        };
        setArticles([newArticle, ...articles]);
    }
    setIsModalOpen(false);
  };

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || t('common.unknownUser');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('knowledgeBase.title')}</h1>
        {canManage && (
          <button onClick={handleAddArticle} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            {t('knowledgeBase.addArticle')}
          </button>
        )}
      </div>
      <div className="space-y-6">
        {articles.length > 0 ? articles.map(article => (
            <ArticleDisplay
                key={article.id}
                article={article}
                onEdit={handleEditArticle}
                onDelete={handleDeleteArticle}
                canManage={canManage}
                authorName={getUserName(article.authorId)}
            />
        )) : (
             <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('knowledgeBase.noArticlesTitle')}</h2>
                <p className="text-slate-500 dark:text-slate-400">
                  {canManage ? t('knowledgeBase.noArticlesManage') : t('knowledgeBase.noArticlesUser')}
                </p>
            </div>
        )}
      </div>
       <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingArticle ? t('knowledgeBase.editArticle') : t('knowledgeBase.addArticle')}
      >
          <ArticleForm 
              article={editingArticle}
              onSave={handleSaveArticle}
              onCancel={() => setIsModalOpen(false)}
          />
      </Modal>
    </div>
  );
};

export default KnowledgeBasePage;