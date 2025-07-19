
import React, { useState } from 'react';
import type { AppProps } from 'next/app';
import { SessionProvider, useSession } from 'next-auth/react';

import { ThemeProvider } from '../contexts/ThemeContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AuthProvider } from '../contexts/AuthContext';

import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Spinner from '../components/common/Spinner';

import { 
    initialUsers, initialRoles, initialTickets, initialNotifications, 
    initialResellers, initialSubscribers, initialTasks, initialLeads,
    initialContacts, initialSales, initialEvents, initialTimeOffRequests,
    initialApprovals, initialTimesheets, initialArticles, initialAppraisals,
    initialSurveys, initialMessages
} from '../lib/mockData';
import type { Notification } from '../types';
import '../styles/globals.css';

const AppShell: React.FC<{
  children: React.ReactNode;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}> = ({ children, notifications, setNotifications }) => {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header notifications={notifications} setNotifications={setNotifications} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  const isAuthPage = Component.displayName === 'AuthPage';

  // Centralized state management for the entire application
  const [users, setUsers] = useState(initialUsers);
  const [roles, setRoles] = useState(initialRoles);
  const [tickets, setTickets] = useState(initialTickets);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [resellers] = useState(initialResellers);
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [tasks, setTasks] = useState(initialTasks);
  const [leads, setLeads] = useState(initialLeads);
  const [contacts, setContacts] = useState(initialContacts);
  const [sales, setSales] = useState(initialSales);
  const [events, setEvents] = useState(initialEvents);
  const [timeOffRequests, setTimeOffRequests] = useState(initialTimeOffRequests);
  const [approvals, setApprovals] = useState(initialApprovals);
  const [timesheets, setTimesheets] = useState(initialTimesheets);
  const [articles, setArticles] = useState(initialArticles);
  const [appraisals, setAppraisals] = useState(initialAppraisals);
  const [surveys, setSurveys] = useState(initialSurveys);
  const [messages, setMessages] = useState(initialMessages);

  // Pass all state and setters down to the page components
  const componentProps = {
    ...pageProps,
    users, setUsers,
    roles, setRoles,
    tickets, setTickets,
    notifications, setNotifications,
    resellers,
    subscribers, setSubscribers,
    tasks, setTasks,
    leads, setLeads,
    contacts, setContacts,
    sales, setSales,
    events, setEvents,
    timeOffRequests, setTimeOffRequests,
    approvals, setApprovals,
    timesheets, setTimesheets,
    articles, setArticles,
    appraisals, setAppraisals,
    surveys, setSurveys,
    messages, setMessages,
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
            {isAuthPage ? (
              <Component {...componentProps} />
            ) : (
              <AppShell notifications={notifications} setNotifications={setNotifications}>
                <Component {...componentProps} />
              </AppShell>
            )}
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};


const AppWithSession = (props: AppProps) => {
  const { pageProps } = props;
  const { session, ...restPageProps } = pageProps;

  return (
    <SessionProvider session={session}>
      <MyApp {...props} pageProps={restPageProps} />
    </SessionProvider>
  );
};

export default AppWithSession;
