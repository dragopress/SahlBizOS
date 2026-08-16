import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';
import {
  FolderKanban,
  Plus,
  Search,
  CheckCircle,
  Clock,
  User,
  Calendar,
  DollarSign,
  TrendingUp,
  Briefcase,
} from 'lucide-react';
import { formatMAD, formatDate } from '../../utils/formatters';

export const ProjectsView: React.FC = () => {
  const { projects, updateProject, setActiveModal, language, t } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProjects = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-2.5 h-2.5" />
            {t.completed}
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Clock className="w-2.5 h-2.5" />
            {t.inProgress}
          </span>
        );
      case 'on_hold':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
            En pause
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-zinc-400">
            Planifié
          </span>
        );
    }
  };

  const totalBudget = projects.reduce((acc, p) => acc + p.budgetMAD, 0);
  const totalBilled = projects.reduce((acc, p) => acc + p.billedAmountMAD, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            Delivery & Milestones
          </span>
          <h2 className="text-2xl lg:text-3xl font-serif italic text-white leading-tight mt-0.5">
            {t.projects}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {language === 'ar'
              ? 'متابعة المشاريع والخدمات، الميزانيات ونسب التقدم والربحية'
              : 'Pilotage des projets clients, avancement des livrables et rentabilité financière.'}
          </p>
        </div>

        <button
          onClick={() => setActiveModal('new_project')}
          className="flex items-center gap-2 px-4 py-2 rounded bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.newProject}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            {language === 'ar' ? 'إجمالي ميزانية المشاريع' : 'Budget Global des Projets'}
          </span>
          <p className="text-xl font-mono font-bold text-white mt-1">
            {formatMAD(totalBudget, language)}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            {language === 'ar' ? 'المبالغ المفوترة للمشاريع' : 'Montant Facturé / Réalisé'}
          </span>
          <p className="text-xl font-mono font-bold text-emerald-400 mt-1">
            {formatMAD(totalBilled, language)}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            {language === 'ar' ? 'المشاريع الجارية' : 'Projets en Cours'}
          </span>
          <p className="text-xl font-mono font-bold text-blue-400 mt-1">
            {projects.filter((p) => p.status === 'in_progress').length}
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="p-5 rounded-lg bg-[#0C0C0C] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-sans font-medium text-white text-sm">
                    {project.title}
                  </h3>
                  <p className="text-xs font-mono text-zinc-400 mt-0.5">
                    {project.customerName}
                  </p>
                </div>
                {getStatusBadge(project.status)}
              </div>

              <p className="text-xs text-zinc-400 mt-2 line-clamp-2 font-sans">
                {project.description || 'Aucune description saisie.'}
              </p>

              {/* Progress Bar */}
              <div className="mt-4 space-y-1.5 font-mono">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500 text-[11px]">Avancement :</span>
                  <span className="text-zinc-200 font-bold">{project.progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${project.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Budget Details */}
              <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase">Budget HT</span>
                  <p className="font-bold text-white mt-0.5">{formatMAD(project.budgetMAD, language)}</p>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase">Facturé</span>
                  <p className="font-bold text-emerald-400 mt-0.5">{formatMAD(project.billedAmountMAD, language)}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>Échéance: {project.endDate || 'Non définie'}</span>
              <button
                onClick={() => {
                  const newProgress = Math.min(100, project.progressPercent + 25);
                  updateProject(project.id, {
                    progressPercent: newProgress,
                    status: newProgress === 100 ? 'completed' : 'in_progress',
                  });
                }}
                className="font-bold text-white hover:text-emerald-400 uppercase tracking-wider text-[10px] transition-colors"
              >
                +25% Avancement
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
