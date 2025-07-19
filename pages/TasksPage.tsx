import React, { useState, useMemo } from 'react';
import type { Task, User, Notification } from '../types';
import { TaskStatus, Permission } from '../types';
import Modal from '../components/common/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { TranslationKey } from '../translations';

interface TasksPageProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  users: User[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const TaskForm: React.FC<{
  task: Partial<Task> | null;
  onSave: (task: Partial<Task>, previousAssigneeId?: string) => void;
  onCancel: () => void;
  agents: User[];
}> = ({ task, onSave, onCancel, agents }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<Partial<Task>>(
        task || { title: '', description: '', status: TaskStatus.TODO, dueDate: new Date().toISOString().split('T')[0] }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'assigneeId' ? (value || undefined) : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, task?.assigneeId);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('tasksPage.form.title')}</label>
                <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('tasksPage.form.description')}</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={4} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('tasksPage.form.assignee')}</label>
                    <select name="assigneeId" value={formData.assigneeId || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="">{t('common.unassigned')}</option>
                        {agents.map(agent => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('tasksPage.form.dueDate')}</label>
                    <input type="date" name="dueDate" value={formData.dueDate?.split('T')[0] || ''} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('tasksPage.form.status')}</label>
                <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    {Object.values(TaskStatus).map(status => <option key={status} value={status}>{t(`taskStatus.${status}` as TranslationKey)}</option>)}
                </select>
            </div>
            <div className="flex justify-end space-x-2 space-x-reverse pt-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">{t('common.cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('common.save')}</button>
            </div>
        </form>
    );
};


const TasksPage: React.FC<TasksPageProps> = ({ tasks, setTasks, users, setNotifications }) => {
  const { currentUser, hasPermission } = useAuth();
  const { t, language, locale } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const agents = useMemo(() => {
    // Agents are users who can be assigned tasks.
    const agentRoleIds = [1, 2, 4, 5, 6]; // Super Admin, Support Manager, Sales, Reseller, Reseller Employee
    
    // If the current user is a Reseller, they can only assign tasks to their own employees.
    if(currentUser?.role.id === 5 && currentUser.resellerId) {
        return users.filter(u => u.resellerId === currentUser.resellerId && u.roleId === 6);
    }

    // Otherwise, admins/managers can assign to any agent.
    return users.filter(u => u.roleId && agentRoleIds.includes(u.roleId));
  }, [users, currentUser]);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };
  
  const handleSaveTask = (taskData: Partial<Task>, previousAssigneeId?: string) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...taskData } as Task : t));
    } else {
      const newTask: Task = {
        id: Date.now(),
        title: 'New Task',
        description: '',
        status: TaskStatus.TODO,
        dueDate: new Date().toISOString(),
        ...taskData,
      } as Task;
      setTasks(prev => [newTask, ...prev]);
    }
    
    // Create a notification if the assignee has changed
    if(taskData.assigneeId && taskData.assigneeId !== previousAssigneeId) {
        const newNotification: Notification = {
            id: Date.now(),
            userId: taskData.assigneeId,
            messageKey: 'notifications.taskAssigned',
            messagePayload: { taskTitle: taskData.title || 'New Task'},
            link: '/tasks',
            isRead: false,
            createdAt: new Date().toISOString(),
        };
        setNotifications(prev => [newNotification, ...prev]);
    }

    setIsModalOpen(false);
  };
  
  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
      const updatedTask = {...task, status: newStatus};
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO: return 'bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-200';
      case TaskStatus.IN_PROGRESS: return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case TaskStatus.DONE: return 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      default: return 'bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-200';
    }
  };

  const filteredTasks = useMemo(() => {
    if (hasPermission(Permission.VIEW_TASKS_ALL)) {
      return tasks;
    }
    return tasks.filter(t => t.assigneeId === currentUser!.id);
  }, [tasks, currentUser, hasPermission]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('tasksPage.title')}</h1>
        {hasPermission(Permission.MANAGE_TASKS) && (
          <button onClick={handleAddTask} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            {t('tasksPage.addTask')}
          </button>
        )}
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('tasksPage.table.task')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('tasksPage.table.assignee')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('tasksPage.table.dueDate')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('tasksPage.table.status')}</th>
              <th className={`px-6 py-3 ${language === 'ar' ? 'text-left' : 'text-right'} text-xs font-medium text-slate-500 dark:text-slate-300 uppercase`}>{t('tasksPage.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredTasks.map((task) => {
              const assignee = users.find(u => u.id === task.assigneeId);
              return (
              <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{task.title}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs">{task.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{assignee?.name || t('common.unassigned')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(task.dueDate).toLocaleDateString(locale)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <select 
                        value={task.status} 
                        onChange={(e) => handleStatusChange(task, e.target.value as TaskStatus)}
                        className={`text-sm font-semibold border-none appearance-none focus:outline-none focus:ring-0 rounded-full px-3 py-1 ${getStatusColor(task.status)}`}
                        style={{backgroundColor: 'transparent', backgroundImage: 'none'}}
                        disabled={!hasPermission(Permission.MANAGE_TASKS) && task.assigneeId !== currentUser?.id}
                    >
                      {Object.values(TaskStatus).map(status => <option key={status} value={status} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200">{t(`taskStatus.${status}` as TranslationKey)}</option>)}
                    </select>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${language === 'ar' ? 'text-left' : 'text-right'}`}>
                  {hasPermission(Permission.MANAGE_TASKS) && (
                    <button onClick={() => handleEditTask(task)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">{t('common.edit')}</button>
                  )}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingTask ? t('tasksPage.editTask') : t('tasksPage.addTask')}
      >
          <TaskForm 
              task={editingTask}
              onSave={handleSaveTask}
              onCancel={() => setIsModalOpen(false)}
              agents={agents}
          />
      </Modal>
    </div>
  );
};

export default TasksPage;