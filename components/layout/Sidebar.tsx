
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Permission } from '../../types';
import { ICONS } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface SidebarProps { }

const NavItem: React.FC<{ path: string, name: string }> = ({ path, name }) => {
  const router = useRouter();
  const isActive = router.pathname === path;

  return (
    <li>
      <Link
        href={path}
        className={`flex items-center p-3 my-1 rounded-md transition-colors duration-200 ${isActive
            ? 'bg-blue-600 text-white shadow-lg'
            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
      >
        <span className="font-medium">{name}</span>
      </Link>
    </li>
  );

};

const NavSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <div className="mt-6">
    <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</h3>
    <ul className="mt-2">
      {children}
    </ul>
  </div>
);


const Sidebar: React.FC<SidebarProps> = () => {
  const { hasPermission } = useAuth();
  const { t } = useLanguage();

  const linkConfig = [
    {
      section: 'navSections.general',
      links: [
        { path: '/', name: 'sidebar.dashboard', icon: ICONS.dashboard, requiredPermission: Permission.VIEW_DASHBOARD },
        { path: '/discuss', name: 'sidebar.discuss', icon: ICONS.discuss, requiredPermission: Permission.VIEW_DISCUSS },
        { path: '/calendar', name: 'sidebar.calendar', icon: ICONS.calendar, requiredPermission: Permission.VIEW_CALENDAR },
        { path: '/contacts', name: 'sidebar.contacts', icon: ICONS.contacts, requiredPermission: Permission.VIEW_CONTACTS },
      ]
    },
    {
      section: 'navSections.salesSupport',
      links: [
        { path: '/sales', name: 'sidebar.sales', icon: ICONS.sales, requiredPermission: Permission.VIEW_SALES },
        { path: '/leads', name: 'sidebar.crm', icon: ICONS.leads, requiredPermission: Permission.VIEW_LEADS },
        { path: '/subscribers', name: 'sidebar.subscribers', icon: ICONS.subscribers, requiredPermission: Permission.VIEW_SUBSCRIBERS },
        { path: '/tickets', name: 'sidebar.helpdesk', icon: ICONS.tickets, requiredPermission: Permission.VIEW_TICKETS_OWN },
        { path: '/tasks', name: 'sidebar.tasks', icon: ICONS.tasks, requiredPermission: Permission.VIEW_TASKS_OWN },
      ]
    },
    {
      section: 'navSections.hr',
      links: [
        { path: '/users', name: 'sidebar.employees', icon: ICONS.users, requiredPermission: Permission.VIEW_USERS },
        { path: '/timesheets', name: 'sidebar.timesheets', icon: ICONS.timesheets, requiredPermission: Permission.VIEW_TIMESHEETS },
        { path: '/time-off', name: 'sidebar.timeOff', icon: ICONS.timeOff, requiredPermission: Permission.VIEW_TIME_OFF },
        { path: '/appraisals', name: 'sidebar.appraisals', icon: ICONS.appraisals, requiredPermission: Permission.VIEW_APPRAISALS },
        { path: '/approvals', name: 'sidebar.approvals', icon: ICONS.approvals, requiredPermission: Permission.VIEW_APPROVALS },
      ]
    },
    {
      section: 'navSections.other',
      links: [
        { path: '/surveys', name: 'sidebar.surveys', icon: ICONS.surveys, requiredPermission: Permission.VIEW_SURVEYS },
        { path: '/knowledge-base', name: 'sidebar.knowledgeBase', icon: ICONS.knowledge, requiredPermission: Permission.VIEW_KNOWLEDGEBASE },
      ]
    },
    {
      section: 'navSections.administration',
      links: [
        { path: '/settings/roles', name: 'sidebar.roleManagement', icon: ICONS.settings, requiredPermission: Permission.MANAGE_ROLES },
      ]
    }
  ] as const;

  return (
    <aside className="w-64 bg-slate-800 dark:bg-slate-900 text-white flex flex-col flex-shrink-0">
      <div className="h-20 flex items-center justify-center text-2xl font-bold border-b border-slate-700 dark:border-slate-800">
        <span className="text-white">ISP-CRM</span>
      </div>
      <nav className="flex-grow p-4 overflow-y-auto">
        {linkConfig.map(section => {
          const accessibleLinks = section.links.filter(link => hasPermission(link.requiredPermission));
          if (accessibleLinks.length === 0) return null;

          return (
            <NavSection key={section.section} title={t(section.section)}>
              {accessibleLinks.map(link => (
                <NavItem key={link.path} path={link.path} name={t(link.name)} />
              ))}
            </NavSection>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
