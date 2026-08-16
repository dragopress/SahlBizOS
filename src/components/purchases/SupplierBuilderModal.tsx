import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Supplier } from '../../types';
import { X, Truck, Building2, ShieldCheck } from 'lucide-react';
import { MOROCCAN_CITIES } from '../../data/initialData';

interface SupplierBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSupplier?: Supplier | null;
}

export const SupplierBuilderModal: React.FC<SupplierBuilderModalProps> = ({
  isOpen,
  onClose,
  initialSupplier,
}) => {
  const { addSupplier, updateSupplier, currentOrg, language, t } = useApp();

  const [formData, setFormData] = useState({
    name: initialSupplier?.name || '',
    ice: initialSupplier?.ice || '',
    identifiantFiscal: initialSupplier?.identifiantFiscal || '',
    category: initialSupplier?.category || 'Fournisseur Matériel IT',
    contactPerson: initialSupplier?.contactPerson || '',
    phone: initialSupplier?.phone || '+212 522 ',
    email: initialSupplier?.email || '',
    city: initialSupplier?.city || 'Casablanca',
    address: initialSupplier?.address || '',
    paymentTerms: initialSupplier?.paymentTerms || '30 jours fin de mois',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Veuillez saisir la raison sociale du fournisseur.');
      return;
    }

    if (initialSupplier) {
      updateSupplier(initialSupplier.id, formData);
    } else {
      addSupplier({
        organizationId: currentOrg.id,
        ...formData,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0C0C0C] border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-white/5 border border-white/10 text-white">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                Vendor Profile
              </span>
              <h3 className="font-serif italic text-white text-lg leading-tight">
                {initialSupplier ? 'Modifier le Fournisseur' : 'Nouveau Fournisseur (Maroc)'}
              </h3>
              <p className="text-[10px] font-mono text-zinc-500">Identifiants fiscaux & Conditions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs font-mono">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
              Raison Sociale / Nom du Fournisseur *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Disway Maroc S.A"
              className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                ICE (15 chiffres) *
              </label>
              <input
                type="text"
                value={formData.ice}
                onChange={(e) => setFormData({ ...formData, ice: e.target.value })}
                placeholder="001524312000045"
                maxLength={15}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 font-mono text-xs text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Identifiant Fiscal (IF)
              </label>
              <input
                type="text"
                value={formData.identifiantFiscal}
                onChange={(e) => setFormData({ ...formData, identifiantFiscal: e.target.value })}
                placeholder="14526987"
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 font-mono text-xs text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Catégorie d'activité
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ex: Grossiste IT, Transport..."
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white focus:outline-hidden font-sans"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Ville
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-200 focus:outline-hidden font-mono"
              >
                {MOROCCAN_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Téléphone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@fournisseur.ma"
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
              Délai & Conditions de Paiement
            </label>
            <input
              type="text"
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              placeholder="Ex: 60 jours fin de mois / Virement"
              className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white focus:outline-hidden font-sans"
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
              {initialSupplier ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
