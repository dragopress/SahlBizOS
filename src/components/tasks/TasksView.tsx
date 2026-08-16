import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderKanban,
  User,
  Calendar,
  Filter,
  Trash2,
  Edit2,
  Tag,
  ArrowRight,
  ListTodo,
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { formatDate } from '../../utils/formatters';

export const TasksView: React.FC = () => {
  const { tasks, currentUser, updateTask, deleteTask, setActiveModal, language, t } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [search, setSearch] = useState('');
  const [filterAssignee, setFilterAssignee] = useState<'all' | 'my'>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(search.toLowerCase())) ||
      (task.projectName && task.projectName.toLowerCase().includes(search.toLowerCase()));

    const matchesAssignee = filterAssignee === 'all' || task.assigneeId === currentUser.id;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;

    return matchesSearch && matchesAssignee && matchesPriority && matchesStatus;
  });

  const columns: { id: TaskStatus; label: string; count: number }[] = [
    {
      id: 'todo',
      label: language === 'ar' ? 'للقيام به' : 'À Faire',
      count: filteredTasks.filter((t) => t.status === 'todo').length,
    },
    {
      id: 'in_progress',
      label: language === 'ar' ? 'قيد التنفيذ' : 'En Cours',
      count: filteredTasks.filter((t) => t.status === 'in_progress').length,
    },
    {
      id: 'in_review',
      label: language === 'ar' ? 'قيد المراجعة' : 'En Révision',
      count: filteredTasks.filter((t) => t.status === 'in_review').length,
    },
    {
      id: 'done',
      label: language === 'ar' ? 'مكتملة' : 'Terminées',
      count: filteredTasks.filter((t) => t.status === 'done').length,
    },
  ];

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            {language === 'ar' ? 'عاجل' : 'Urgent'}
          </span>
        );
      case 'high':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            {language === 'ar' ? 'مرتفعة' : 'Haute'}
          </span>
        );
      case 'medium':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            {language === 'ar' ? 'متوسطة' : 'Moyenne'}
          </span>
        );
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold bg-white/10 text-zinc-400 border border-white/10">
            {language === 'ar' ? 'عادية' : 'Basse'}
          </span>
        );
    }
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  const completedCount = tasks.filter((t) => t.status === 'done').length;
  const overdueCount = tasks.filter(
    (t) => t.status !== 'done' && new Date(t.dueDate) < new Date()
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            {language === 'ar' ? 'إدارة العمليات والمهام' : 'Operations & Project Tasks'}
          </span>
          <h1 className="font-serif italic text-2xl sm:text-3xl text-white font-normal mt-0.5">
            {language === 'ar' ? 'لوحة تتبع المهام والمسؤوليات' : 'Tableau des Tâches & Équipe'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-mono">
            {language === 'ar'
              ? 'تتبع مهام المشاريع، العملاء، الأولويات والمواعيد النهائية بدقة'
              : 'Gérez le flux de travail de vos projets, assignez des responsabilités et surveillez les échéances critiques.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded bg-[#0C0C0C] border border-white/10 p-0.5">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                viewMode === 'list' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {language === 'ar' ? 'قائمة' : 'Liste'}
            </button>
          </div>

          <button
            onClick={() => setActiveModal('new_task')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? '+ مهمة جديدة' : '+ Nouvelle Tâche'}</span>
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
            {language === 'ar' ? 'إجمالي المهام' : 'Total Tâches'}
          </span>
          <div className="font-mono text-xl sm:text-2xl font-bold text-white mt-1">
            {tasks.length}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10">
          <span className="text-[10px] uppercase font-mono tracking-wider text-blue-400">
            {language === 'ar' ? 'قيد الإنجاز' : 'En Cours'}
          </span>
          <div className="font-mono text-xl sm:text-2xl font-bold text-blue-400 mt-1">
            {tasks.filter((t) => t.status === 'in_progress').length}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10">
          <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400">
            {language === 'ar' ? 'تم إنجازها' : 'Complétées'}
          </span>
          <div className="font-mono text-xl sm:text-2xl font-bold text-emerald-400 mt-1">
            {completedCount}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10">
          <span className="text-[10px] uppercase font-mono tracking-wider text-rose-400">
            {language === 'ar' ? 'متأخرة عن الموعد' : 'En Retard'}
          </span>
          <div className="font-mono text-xl sm:text-2xl font-bold text-rose-400 mt-1">
            {overdueCount}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'ar' ? 'بحث في المهام أو المشاريع...' : 'Rechercher une tâche, projet...'}
            className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-white/30 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <div className="flex rounded bg-[#080808] border border-white/10 p-0.5">
            <button
              onClick={() => setFilterAssignee('all')}
              className={`px-2.5 py-1.5 rounded text-[11px] font-mono ${
                filterAssignee === 'all' ? 'bg-white/10 text-white font-bold' : 'text-zinc-400'
              }`}
            >
              {language === 'ar' ? 'الكل' : 'Toutes'}
            </button>
            <button
              onClick={() => setFilterAssignee('my')}
              className={`px-2.5 py-1.5 rounded text-[11px] font-mono ${
                filterAssignee === 'my' ? 'bg-white/10 text-white font-bold' : 'text-zinc-400'
              }`}
            >
              {language === 'ar' ? 'مهامي أنا' : 'Mes Tâches'}
            </button>
          </div>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-300 font-mono focus:outline-hidden"
          >
            <option value="all">{language === 'ar' ? 'جميع الأولويات' : 'Toutes priorités'}</option>
            <option value="urgent">{language === 'ar' ? 'عاجل' : 'Urgent'}</option>
            <option value="high">{language === 'ar' ? 'مرتفعة' : 'Haute'}</option>
            <option value="medium">{language === 'ar' ? 'متوسطة' : 'Moyenne'}</option>
            <option value="low">{language === 'ar' ? 'عادية' : 'Basse'}</option>
          </select>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-[#0C0C0C] border border-white/10 rounded-lg p-3 flex flex-col min-h-[500px]"
              >
                {/* Column header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      {col.label}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/10 text-zinc-300">
                      {col.count}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveModal('new_task')}
                    className="p-1 rounded hover:bg-white/10 text-zinc-500 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Tasks cards list */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[650px] pr-1">
                  {colTasks.length === 0 ? (
                    <div className="py-12 text-center text-zinc-600 font-mono text-[11px] border border-dashed border-white/5 rounded">
                      {language === 'ar' ? 'لا توجد مهام' : 'Aucune tâche'}
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 rounded bg-[#080808] border border-white/10 hover:border-white/20 transition-all shadow-xs group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          {getPriorityBadge(task.priority)}
                          <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(task.dueDate, language)}
                          </span>
                        </div>

                        <h4 className="font-sans font-medium text-white text-xs leading-snug mb-1">
                          {task.title}
                        </h4>

                        {task.description && (
                          <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2 font-sans">
                            {task.description}
                          </p>
                        )}

                        {task.projectName && (
                          <div className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded mb-2">
                            <FolderKanban className="w-2.5 h-2.5 text-zinc-400" />
                            <span className="truncate max-w-[150px]">{task.projectName}</span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3 h-3 text-zinc-500" />
                            <span>{task.assigneeName}</span>
                          </div>

                          {/* Quick status cycle button */}
                          <div className="flex items-center gap-1">
                            {col.id !== 'done' && (
                              <button
                                onClick={() => {
                                  const nextStatus: TaskStatus =
                                    col.id === 'todo'
                                      ? 'in_progress'
                                      : col.id === 'in_progress'
                                      ? 'in_review'
                                      : 'done';
                                  handleStatusChange(task.id, nextStatus);
                                }}
                                className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10"
                                title="Avancer le statut"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1 rounded text-zinc-600 hover:text-rose-400 hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="rounded-lg bg-[#0C0C0C] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#080808] text-[10px] uppercase font-mono tracking-widest text-zinc-400">
                  <th className="py-3 px-4">{language === 'ar' ? 'المهمة' : 'Tâche'}</th>
                  <th className="py-3 px-4">{language === 'ar' ? 'المشروع المرتبط' : 'Projet'}</th>
                  <th className="py-3 px-4">{language === 'ar' ? 'المسؤول' : 'Assigné à'}</th>
                  <th className="py-3 px-4">{language === 'ar' ? 'تاريخ الاستحقاق' : 'Échéance'}</th>
                  <th className="py-3 px-4">{language === 'ar' ? 'الأولوية' : 'Priorité'}</th>
                  <th className="py-3 px-4">{language === 'ar' ? 'الحالة' : 'Statut'}</th>
                  <th className="py-3 px-4 text-right rtl:text-left">{language === 'ar' ? 'إجراء' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-mono">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-medium text-white">{task.title}</td>
                    <td className="py-3.5 px-4 text-zinc-400">{task.projectName || '-'}</td>
                    <td className="py-3.5 px-4 text-zinc-300">{task.assigneeName}</td>
                    <td className="py-3.5 px-4 text-zinc-400">{formatDate(task.dueDate, language)}</td>
                    <td className="py-3.5 px-4">{getPriorityBadge(task.priority)}</td>
                    <td className="py-3.5 px-4">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                        className="px-2 py-1 rounded bg-[#080808] border border-white/10 text-xs text-white"
                      >
                        <option value="todo">{language === 'ar' ? 'للقيام به' : 'À Faire'}</option>
                        <option value="in_progress">{language === 'ar' ? 'قيد التنفيذ' : 'En Cours'}</option>
                        <option value="in_review">{language === 'ar' ? 'قيد المراجعة' : 'En Révision'}</option>
                        <option value="done">{language === 'ar' ? 'مكتملة' : 'Terminée'}</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right rtl:text-left">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-white/5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
