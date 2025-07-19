import React, { useState, useMemo } from 'react';
import type { CalendarEvent } from '../types';
import { Permission } from '../types';
import Modal from '../components/common/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface CalendarPageProps {
    events: CalendarEvent[];
    setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

const EventForm: React.FC<{
    event: Partial<CalendarEvent> | null;
    onSave: (event: Partial<CalendarEvent>) => void;
    onCancel: () => void;
    selectedDate: Date;
}> = ({ event, onSave, onCancel, selectedDate }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<Partial<CalendarEvent>>(
        event || { title: '', start: selectedDate.toISOString(), end: selectedDate.toISOString(), allDay: true }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev!, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{t('calendarPage.form.title')}</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div className="flex items-center">
                <input type="checkbox" id="allDay" name="allDay" checked={formData.allDay} onChange={handleChange} className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                <label htmlFor="allDay" className="mx-2 block text-sm text-slate-900 dark:text-slate-300">{t('calendarPage.form.allDay')}</label>
            </div>
            <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">{t('common.cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('common.save')}</button>
            </div>
        </form>
    );
};

const CalendarPage: React.FC<CalendarPageProps> = ({ events, setEvents }) => {
  const { currentUser, hasPermission } = useAuth();
  const { t, locale, language } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const canManage = hasPermission(Permission.MANAGE_CALENDAR);

  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  const startDayOfWeek = language === 'ar' ? 6 : 0; // Saturday for Arabic, Sunday for English
  
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - (startDate.getDay() - startDayOfWeek + 7) % 7);
  
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + ( (6 + startDayOfWeek) - endDate.getDay() + 7) % 7);


  const days = [];
  let day = new Date(startDate);
  while (day <= endDate) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const dayNames = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: 'long' });
    const days = [];
    for(let i=0; i<7; i++) {
        days.push(formatter.format(new Date(2023, 0, (i + startDayOfWeek + 1) % 7 + 1)));
    }
    return days;
  }, [locale, startDayOfWeek]);


  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach(event => {
      const dateKey = new Date(event.start).toDateString();
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(event);
    });
    return map;
  }, [events]);

  const handleDayClick = (date: Date) => {
    if (canManage) {
        setSelectedDate(date);
        setIsModalOpen(true);
    }
  };

  const handleSaveEvent = (eventData: Partial<CalendarEvent>) => {
    const newEvent: CalendarEvent = {
        id: Date.now(),
        userId: currentUser!.id,
        ...eventData,
    } as CalendarEvent;
    setEvents([...events, newEvent]);
    setIsModalOpen(false);
  };

  const changeMonth = (offset: number) => {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            {currentDate.toLocaleString(locale, { month: 'long', year: 'numeric' })}
        </h1>
        <div className="flex gap-2">
            <button onClick={() => changeMonth(-1)} className="p-2 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600">{t('calendarPage.prev')}</button>
            <button onClick={() => changeMonth(1)} className="p-2 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600">{t('calendarPage.next')}</button>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <div className="grid grid-cols-7 text-center font-bold text-slate-600 dark:text-slate-400 border-b dark:border-slate-700">
          {dayNames.map(d => <div key={d} className="p-4">{d}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {days.map((d, i) => {
            const isCurrentMonth = d.getMonth() === currentDate.getMonth();
            const isToday = d.toDateString() === new Date().toDateString();
            const dayEvents = eventsByDate.get(d.toDateString()) || [];
            
            return (
              <div 
                key={i} 
                className={`h-36 border-b border-r dark:border-slate-700 p-2 flex flex-col ${canManage ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50' : ''} ${!isCurrentMonth ? 'bg-slate-50 dark:bg-slate-800/50' : ''}`}
                onClick={() => handleDayClick(d)}
              >
                <span className={`font-bold ${isCurrentMonth ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'} ${isToday ? 'bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center' : ''}`}>
                  {d.getDate()}
                </span>
                <div className="mt-1 overflow-y-auto text-xs">
                    {dayEvents.map(event => (
                        <div key={event.id} className="p-1 mb-1 bg-blue-100 dark:bg-blue-900/50 rounded-md text-blue-800 dark:text-blue-300 truncate">
                            {event.title}
                        </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
       {isModalOpen && selectedDate && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('calendarPage.addEventFor', { date: selectedDate.toLocaleDateString(locale) })}>
            <EventForm
                event={null}
                onSave={handleSaveEvent}
                onCancel={() => setIsModalOpen(false)}
                selectedDate={selectedDate}
            />
        </Modal>
      )}
    </div>
  );
};

export default CalendarPage;