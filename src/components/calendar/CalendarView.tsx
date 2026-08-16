import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileCheck2,
  CheckSquare,
  FolderKanban,
  FileSpreadsheet,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { formatDate, formatMAD } from '../../utils/formatters';

export const CalendarView: React.FC = () => {
  const { invoices, tasks, projects, quotes, language, setActiveModal } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterType, setFilterType] = useState<'all' | 'invoices' | 'tasks' | 'projects' | 'quotes'>('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Adjust for Monday start (0: Mon, 6: Sun)
  const startingDayIndex = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNamesFr = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  ];

  const monthNamesAr = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'ماي', 'يونيو',
    'يوليوز', 'غشت', 'شتنبر', 'أكتوبر', 'نونبر', 'دجنبر',
  ];

  const dayNamesFr = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const dayNamesAr = ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];

  // Collect events by YYYY-MM-DD
  const eventsByDate: Record<
    string,
    Array<{
      id: string;
      title: string;
      type: 'invoice' | 'task' | 'project' | 'quote';
      subtitle?: string;
      amount?: number;
      status?: string;
    }>
  > = {};

  const addEvent = (dateStr: string, event: any) => {
    if (!dateStr) return;
    const key = dateStr.slice(0, 10);
    if (!eventsByDate[key]) eventsByDate[key] = [];
    eventsByDate[key].push(event);
  };

  if (filterType === 'all' || filterType === 'invoices') {
    invoices.forEach((inv) => {
      if (inv.status !== 'paid' && inv.status !== 'cancelled') {
        addEvent(inv.dueDate, {
          id: inv.id,
          title: `${inv.invoiceNumber} - ${inv.customerName}`,
          type: 'invoice',
          amount: inv.balanceDue,
          status: inv.status,
        });
      }
    });
  }

  if (filterType === 'all' || filterType === 'tasks') {
    tasks.forEach((t) => {
      if (t.status !== 'done') {
        addEvent(t.dueDate, {
          id: t.id,
          title: t.title,
          type: 'task',
          subtitle: t.assigneeName,
          status: t.priority,
        });
      }
    });
  }

  if (filterType === 'all' || filterType === 'projects') {
    projects.forEach((p) => {
      if (p.status === 'in_progress') {
        addEvent(p.endDate, {
          id: p.id,
          title: `Fin: ${p.name}`,
          type: 'project',
          subtitle: p.customerName,
          amount: p.budgetMAD,
        });
      }
    });
  }

  if (filterType === 'all' || filterType === 'quotes') {
    quotes.forEach((q) => {
      if (q.status === 'sent') {
        addEvent(q.validUntil, {
          id: q.id,
          title: `Exp: ${q.quoteNumber}`,
          type: 'quote',
          amount: q.totalTTC,
          subtitle: q.customerName,
        });
      }
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            {language === 'ar' ? 'الجدول الزمني والمواعيد' : 'Commercial & Operational Calendar'}
          </span>
          <h1 className="font-serif italic text-2xl sm:text-3xl text-white font-normal mt-0.5">
            {language === 'ar' ? 'التقويم الموحد للأعمال' : 'Calendrier Unifié des Échéances'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-mono">
            {language === 'ar'
              ? 'رؤية شاملة لمواعيد استحقاق الفواتير، تسليم المشاريع، ومهام الفريق'
              : 'Visualisez les dates limites de factures impayées, les échéances de tâches et les livraisons de projets.'}
          </p>
        </div>

        {/* Month Navigation & Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded bg-[#0C0C0C] border border-white/10 p-1">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            </button>
            <span className="px-3 text-xs font-mono font-bold text-white min-w-[130px] text-center">
              {language === 'ar' ? monthNamesAr[month] : monthNamesFr[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 rounded bg-[#0C0C0C] border border-white/10 text-xs text-zinc-300 font-mono focus:outline-hidden"
          >
            <option value="all">{language === 'ar' ? 'جميع الأحداث' : 'Tous les événements'}</option>
            <option value="invoices">{language === 'ar' ? 'استحقاقات الفواتير' : 'Échéances Factures'}</option>
            <option value="tasks">{language === 'ar' ? 'مهام الفريق' : 'Tâches à faire'}</option>
            <option value="projects">{language === 'ar' ? 'مواعيد المشاريع' : 'Livrables Projets'}</option>
            <option value="quotes">{language === 'ar' ? 'عروض الأسعار' : 'Devis en cours'}</option>
          </select>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[#0C0C0C] border border-white/10 rounded-lg overflow-hidden shadow-2xl">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-white/10 bg-[#080808] text-center font-mono text-[10px] uppercase tracking-widest text-zinc-400 py-2.5">
          {(language === 'ar' ? dayNamesAr : dayNamesFr).map((day, i) => (
            <div key={i} className="px-1">
              {day}
            </div>
          ))}
        </div>

        {/* Days Cells */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-white/5 border-b border-white/10">
          {/* Empty cells before month start */}
          {Array.from({ length: startingDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[110px] bg-black/20 p-2 opacity-20" />
          ))}

          {/* Days in Month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isToday =
              new Date().toISOString().split('T')[0] === dateStr;
            const dayEvents = eventsByDate[dateStr] || [];

            return (
              <div
                key={`day-${dayNum}`}
                className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors ${
                  isToday ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* Day Number Header */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-mono font-bold inline-flex items-center justify-center w-5 h-5 rounded ${
                      isToday
                        ? 'bg-white text-black font-bold'
                        : 'text-zinc-400'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {dayEvents.length > 0 && (
                    <span className="text-[9px] font-mono text-zinc-500">
                      {dayEvents.length} {language === 'ar' ? 'حدث' : 'évt'}
                    </span>
                  )}
                </div>

                {/* Day events pills */}
                <div className="space-y-1 overflow-y-auto max-h-[80px]">
                  {dayEvents.map((evt, eIdx) => {
                    let badgeClass = 'bg-white/10 text-zinc-300 border-white/10';
                    let Icon = Clock;

                    if (evt.type === 'invoice') {
                      badgeClass = 'bg-rose-500/10 text-rose-300 border-rose-500/30';
                      Icon = FileCheck2;
                    } else if (evt.type === 'task') {
                      badgeClass = 'bg-blue-500/10 text-blue-300 border-blue-500/30';
                      Icon = CheckSquare;
                    } else if (evt.type === 'project') {
                      badgeClass = 'bg-purple-500/10 text-purple-300 border-purple-500/30';
                      Icon = FolderKanban;
                    } else if (evt.type === 'quote') {
                      badgeClass = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
                      Icon = FileSpreadsheet;
                    }

                    return (
                      <div
                        key={eIdx}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono border truncate flex items-center gap-1 ${badgeClass}`}
                        title={evt.title}
                      >
                        <Icon className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{evt.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
