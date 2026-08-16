import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OpportunityStage } from '../../types';
import { X, Target } from 'lucide-react';

interface OpportunityBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OpportunityBuilderModal: React.FC<OpportunityBuilderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { customers, addOpportunity, currentOrg, language, t } = useApp();

  const [title, setTitle] = useState('');
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [expectedRevenueMAD, setExpectedRevenueMAD] = useState(45000);
  const [probabilityPercent, setProbabilityPercent] = useState(50);
  const [stage, setStage] = useState<OpportunityStage>('lead');
  const [expectedCloseDate, setExpectedCloseDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('Premier contact établi avec le directeur des achats.');

  if (!isOpen) return null;

  const selectedCustomer = customers.find((c) => c.id === customerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedCustomer) {
      alert('Veuillez remplir le titre et le client.');
      return;
    }

    addOpportunity({
      organizationId: currentOrg.id,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      title,
      expectedRevenueMAD: Number(expectedRevenueMAD),
      probabilityPercent: Number(probabilityPercent),
      stage,
      expectedCloseDate,
      notes,
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
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                Pipeline Deal
              </span>
              <h3 className="font-serif italic text-white text-lg leading-tight">
                {language === 'ar' ? 'إضافة فرصة تجارية جديدة' : 'Nouvelle Opportunité Commerciale'}
              </h3>
              <p className="text-[10px] font-mono text-zinc-500">Pipeline de vente & probabilité</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Titre de l'opportunité *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Contrat de maintenance annuelle ERP"
              className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Client / Prospect
              </label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-200 focus:outline-hidden font-mono"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Étape du Pipeline
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as OpportunityStage)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-200 focus:outline-hidden font-mono"
              >
                <option value="lead">Lead / Prospect</option>
                <option value="qualified">Qualifié</option>
                <option value="proposal">Proposition / Devis</option>
                <option value="negotiation">Négociation</option>
                <option value="won">Gagné (Won)</option>
                <option value="lost">Perdu</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Valeur estimée (MAD) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={expectedRevenueMAD}
                onChange={(e) => setExpectedRevenueMAD(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 font-bold text-xs text-emerald-400 focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Probabilité ({probabilityPercent}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={probabilityPercent}
                onChange={(e) => setProbabilityPercent(Number(e.target.value))}
                className="w-full h-1.5 mt-3 bg-white/10 rounded appearance-none cursor-pointer accent-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Date prévisionnelle de signature
            </label>
            <input
              type="date"
              required
              value={expectedCloseDate}
              onChange={(e) => setExpectedCloseDate(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white focus:outline-hidden font-mono"
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
              Ajouter au Pipeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
