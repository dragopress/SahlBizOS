import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';
import { X, FolderKanban } from 'lucide-react';

interface ProjectBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectBuilderModal: React.FC<ProjectBuilderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { customers, addProject, currentOrg, language, t } = useApp();

  const [title, setTitle] = useState('');
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [description, setDescription] = useState('');
  const [budgetMAD, setBudgetMAD] = useState(25000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  if (!isOpen) return null;

  const selectedCustomer = customers.find((c) => c.id === customerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedCustomer) {
      alert('Veuillez remplir le titre et sélectionner le client.');
      return;
    }

    addProject({
      organizationId: currentOrg.id,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      title,
      description,
      status: 'in_progress',
      budgetMAD: Number(budgetMAD),
      billedAmountMAD: 0,
      startDate,
      endDate,
      progressPercent: 0,
      tasks: [],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0C0C0C] border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-white/5 border border-white/10 text-white">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                New Project
              </span>
              <h3 className="font-serif italic text-white text-lg leading-tight">
                {language === 'ar' ? 'إضافة مشروع جديد' : 'Nouveau Projet Client'}
              </h3>
              <p className="text-[10px] font-mono text-zinc-500">Planification des livrables & budget</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
              Nom du projet / Mission *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Refonte Plateforme E-Commerce B2B"
              className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Client associé *
              </label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-200 focus:outline-hidden"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Budget prévisionnel HT (MAD)
              </label>
              <input
                type="number"
                required
                min="0"
                value={budgetMAD}
                onChange={(e) => setBudgetMAD(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 font-bold text-xs text-emerald-400 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Date de début
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Date de livraison prévue
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
              Description & Objectifs
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails du cahier des charges, livrables attendus..."
              className="w-full p-2.5 rounded bg-[#080808] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden font-sans"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-transparent border border-white/10 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-white text-black hover:bg-zinc-200 text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              Créer le Projet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
