import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckSquare, Calendar, User, FolderKanban, Tag } from 'lucide-react';
import { TaskPriority, TaskStatus } from '../../types';

interface TaskBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaskBuilderModal: React.FC<TaskBuilderModalProps> = ({ isOpen, onClose }) => {
  const { currentOrg, projects, customers, users, currentUser, addTask, language } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState<string>('');
  const [customerId, setCustomerId] = useState<string>('');
  const [assigneeId, setAssigneeId] = useState<string>(currentUser.id);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [estimatedHours, setEstimatedHours] = useState<number>(4);
  const [labelInput, setLabelInput] = useState('Urgent, Maroc, DGI');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignedUser = users.find((u) => u.id === assigneeId) || currentUser;
    const project = projects.find((p) => p.id === projectId);
    const customer = customers.find((c) => c.id === customerId);

    const labels = labelInput
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean);

    addTask({
      organizationId: currentOrg.id,
      title,
      description,
      projectId: project ? project.id : undefined,
      projectName: project ? project.name : undefined,
      customerId: customer ? customer.id : undefined,
      customerName: customer ? customer.companyName : undefined,
      assigneeId: assignedUser.id,
      assigneeName: assignedUser.name,
      priority,
      status,
      dueDate,
      estimatedHours: Number(estimatedHours) || 0,
      labels,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#0C0C0C] border border-white/10 rounded-lg max-w-xl w-full shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#080808]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-white/5 border border-white/10 text-white">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold">
                {language === 'ar' ? 'إدارة المهام' : 'Planification Opérationnelle'}
              </span>
              <h3 className="font-serif italic text-lg text-white font-normal leading-tight">
                {language === 'ar' ? 'إنشاء مهمة عمل جديدة' : 'Nouvelle Tâche & Responsabilité'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
              {language === 'ar' ? 'عنوان المهمة *' : 'Intitulé de la tâche *'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Préparer la liasse fiscale TVA pour le comptable"
              className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-white text-xs focus:outline-hidden focus:border-white/30"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
              {language === 'ar' ? 'الوصف والتفاصيل' : 'Description & Instructions'}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails des livrables attendus..."
              className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-white text-xs focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                {language === 'ar' ? 'المشروع المرتبط' : 'Projet Associé'}
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-white focus:outline-hidden"
              >
                <option value="">{language === 'ar' ? 'بدون مشروع (عام)' : 'Général (Aucun)'}</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                {language === 'ar' ? 'العميل المرتبط' : 'Client Associé'}
              </label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-white focus:outline-hidden"
              >
                <option value="">{language === 'ar' ? 'بدون عميل' : 'Aucun client'}</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                {language === 'ar' ? 'المسؤول المكلف' : 'Assigné à'}
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-white focus:outline-hidden"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                {language === 'ar' ? 'الأولوية' : 'Priorité'}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-white focus:outline-hidden"
              >
                <option value="urgent">{language === 'ar' ? 'عاجل جداً' : 'Urgente'}</option>
                <option value="high">{language === 'ar' ? 'مرتفعة' : 'Haute'}</option>
                <option value="medium">{language === 'ar' ? 'متوسطة' : 'Moyenne'}</option>
                <option value="low">{language === 'ar' ? 'عادية' : 'Basse'}</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                {language === 'ar' ? 'تاريخ الاستحقاق' : 'Échéance'}
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                {language === 'ar' ? 'التقدير الزمني (بالساعات)' : 'Temps Estimé (heures)'}
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                {language === 'ar' ? 'الوسوم (مفصولة بفواصل)' : 'Tags / Étiquettes'}
              </label>
              <input
                type="text"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                placeholder="Finance, DGI, Client"
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="border-t border-white/10 pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Annuler'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-wider transition-colors"
            >
              {language === 'ar' ? 'حفظ المهمة' : 'Enregistrer la Tâche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
