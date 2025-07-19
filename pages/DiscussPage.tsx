import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface DiscussPageProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  users: User[];
}

const DiscussPage: React.FC<DiscussPageProps> = ({ messages, setMessages, users }) => {
  const { currentUser } = useAuth();
  const { t, locale } = useLanguage();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const getUser = (userId: string) => {
    return users.find(u => u.id === userId) || { id: '0', name: t('common.unknownUser'), avatar: '', roleId: 0, email: '' };
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !currentUser) return;

    const message: ChatMessage = {
      id: Date.now(),
      userId: currentUser.id,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex-shrink-0">{t('discussPage.title')}</h1>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md flex-grow flex flex-col h-0">
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          {messages.map(msg => {
            const author = getUser(msg.userId);
            const isMe = author.id === currentUser!.id;
            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full" />}
                <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none'}`}>
                  {!isMe && <p className="font-bold text-sm mb-1">{author.name}</p>}
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${isMe ? 'text-blue-200' : 'text-slate-500 dark:text-slate-400'} text-left`}>
                    {new Date(msg.timestamp).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {isMe && <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full" />}
              </div>
            );
          })}
           <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder={t('discussPage.placeholder')}
              className="flex-grow border border-slate-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              {t('discussPage.send')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DiscussPage;