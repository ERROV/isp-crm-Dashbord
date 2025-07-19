import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import type { Ticket, Task } from '../types';
import { TicketStatus, TaskStatus, Permission } from '../types';
import Card from '../components/common/Card';
import { ICONS } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardPageProps {
  tickets: Ticket[];
  tasks: Task[];
}

const DashboardAppCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    onClick: () => void;
}> = ({ title, icon, onClick }) => (
    <div 
        onClick={onClick}
        className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:bg-slate-50 dark:hover:bg-slate-700 group"
    >
        <div className="text-blue-500 mb-3 transition-colors group-hover:text-blue-600">{icon}</div>
        <h3 className="font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
    </div>
);


const DashboardPage: React.FC<DashboardPageProps> = ({ tickets, tasks }) => {
    const router = useRouter();
    const { currentUser, hasPermission } = useAuth();
    const { t } = useLanguage();

    const handleNavigation = (path: string | null) => {
        if (path) {
            router.push(path);
        } else {
            alert(t('common.featureComingSoon'));
        }
    };

    const modules = [
        { nameKey: 'sidebar.discuss', icon: ICONS.discuss, path: '/discuss', permission: Permission.VIEW_DISCUSS },
        { nameKey: 'sidebar.calendar', icon: ICONS.calendar, path: '/calendar', permission: Permission.VIEW_CALENDAR },
        { nameKey: 'sidebar.contacts', icon: ICONS.contacts, path: '/contacts', permission: Permission.VIEW_CONTACTS },
        { nameKey: 'sidebar.crm', icon: ICONS.crm, path: '/leads', permission: Permission.VIEW_LEADS },
        { nameKey: 'sidebar.sales', icon: ICONS.sales, path: '/sales', permission: Permission.VIEW_SALES },
        { nameKey: 'sidebar.helpdesk', icon: ICONS.helpdesk, path: '/tickets', permission: Permission.VIEW_TICKETS_OWN },
        { nameKey: 'sidebar.approvals', icon: ICONS.approvals, path: '/approvals', permission: Permission.VIEW_APPROVALS },
        { nameKey: 'sidebar.timeOff', icon: ICONS.timeOff, path: '/time-off', permission: Permission.VIEW_TIME_OFF },
        { nameKey: 'sidebar.employees', icon: ICONS.employees, path: '/users', permission: Permission.VIEW_USERS },
        { nameKey: 'sidebar.appraisals', icon: ICONS.appraisals, path: '/appraisals', permission: Permission.VIEW_APPRAISALS },
        { nameKey: 'sidebar.tasks', icon: ICONS.tasks, path: '/tasks', permission: Permission.VIEW_TASKS_OWN },
        { nameKey: 'sidebar.timesheets', icon: ICONS.timesheets, path: '/timesheets', permission: Permission.VIEW_TIMESHEETS },
        { nameKey: 'sidebar.surveys', icon: ICONS.surveys, path: '/surveys', permission: Permission.VIEW_SURVEYS },
        { nameKey: 'sidebar.roleManagement', icon: ICONS.settings, path: '/settings/roles', permission: Permission.MANAGE_ROLES },
    ] as const;

    const accessibleModules = modules.filter(m => hasPermission(m.permission));

    const openTicketsCount = useMemo(() => {
        if (!hasPermission(Permission.VIEW_TICKETS_ALL)) {
            return tickets.filter(t => String(t.clientId) === currentUser!.id && (t.status === TicketStatus.OPEN || t.status === TicketStatus.IN_PROGRESS)).length;
        }
        return tickets.filter(t => t.status === TicketStatus.OPEN || t.status === TicketStatus.IN_PROGRESS).length;
    }, [tickets, currentUser, hasPermission]);

    const myTasksCount = useMemo(() => {
        if (!hasPermission(Permission.VIEW_TASKS_ALL)) {
            return tasks.filter(t => t.assigneeId === currentUser!.id && t.status === TaskStatus.TODO).length;
        }
        return tasks.filter(t => t.status === TaskStatus.TODO).length;
    }, [tasks, currentUser, hasPermission]);


    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t('dashboard.welcome', { name: currentUser!.name })}</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">{t('dashboard.subtitle')}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card title={t('dashboard.openTickets')} value={openTicketsCount} icon={ICONS.tickets} color="bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300" />
                {hasPermission(Permission.VIEW_TASKS_OWN) && (
                    <Card title={t('dashboard.pendingTasks')} value={myTasksCount} icon={ICONS.tasks} color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-300" />
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
               {accessibleModules.map((app) => (
                   <DashboardAppCard 
                       key={app.nameKey}
                       title={t(app.nameKey)}
                       icon={app.icon}
                       onClick={() => handleNavigation(app.path)}
                   />
               ))}
            </div>
        </div>
    );
};

export default DashboardPage;