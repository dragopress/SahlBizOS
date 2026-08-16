import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MoroccanTvaRate, MoroccanPaymentMethod } from '../../types';
import { X, Receipt, Calculator } from 'lucide-react';
import { MOROCCAN_TVA_RATES, calculateTvaFromTTC } from '../../utils/taxCalculator';
import { formatMAD } from '../../utils/formatters';

interface ExpenseBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpenseBuilderModal: React.FC<ExpenseBuilderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { suppliers, addExpense, currentOrg, language, t } = useApp();

  const [description, setDescription] = useState('');
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [category, setCategory] = useState('Loyer & Charges');
  const [amountTTC, setAmountTTC] = useState<number>(1200);
  const [tvaRate, setTvaRate] = useState<MoroccanTvaRate>(20);
  const [isDeductible, setIsDeductible] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<MoroccanPaymentMethod>('Virement bancaire');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const selectedSupplier = suppliers.find((s) => s.id === supplierId);
  const tvaCalc = calculateTvaFromTTC(amountTTC, tvaRate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Veuillez renseigner le libellé de la dépense.');
      return;
    }

    addExpense({
      organizationId: currentOrg.id,
      supplierId: selectedSupplier?.id,
      supplierName: selectedSupplier?.name || 'Fournisseur externe',
      category,
      description,
      amountHT: tvaCalc.baseHT,
      tvaRate,
      tvaAmount: tvaCalc.taxAmount,
      amountTTC: Number(amountTTC),
      isDeductible,
      paymentMethod,
      date,
      status: 'paid',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0C0C0C] border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-white/5 border border-white/10 text-white">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                Operating Expense
              </span>
              <h3 className="font-serif italic text-white text-lg leading-tight">
                {language === 'ar' ? 'تسجيل نفقة جديدة' : 'Nouvelle Charge / Note de Frais'}
              </h3>
              <p className="text-[10px] font-mono text-zinc-500">Calcul automatique de la TVA déductible</p>
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
              Libellé / Désignation de la dépense *
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Facture Maroc Telecom Fibre Optique Mai"
              className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Fournisseur
              </label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-200 focus:outline-hidden font-mono"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Catégorie de Charge
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-200 focus:outline-hidden font-mono"
              >
                <option value="Loyer & Charges">Loyer & Charges</option>
                <option value="Abonnements & Logiciels">Abonnements & Logiciels</option>
                <option value="Télécoms & Internet">Télécoms & Internet</option>
                <option value="Carburant & Déplacements">Carburant & Déplacements</option>
                <option value="Fournitures & Bureautique">Fournitures & Bureautique</option>
                <option value="Honoraires & Comptabilité">Honoraires & Comptabilité</option>
                <option value="Marketing & Publicité">Marketing & Publicité</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Montant TTC (MAD) *
              </label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={amountTTC}
                onChange={(e) => setAmountTTC(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 font-bold text-xs text-white focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Taux TVA
              </label>
              <select
                value={tvaRate}
                onChange={(e) => setTvaRate(Number(e.target.value) as MoroccanTvaRate)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-200 focus:outline-hidden font-mono"
              >
                {MOROCCAN_TVA_RATES.map((r) => (
                  <option key={r.rate} value={r.rate}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tax Breakdown Pill */}
          <div className="p-3 rounded bg-[#080808] border border-white/10 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-zinc-500">Montant HT:</span>{' '}
              <span className="font-bold text-white">{formatMAD(tvaCalc.baseHT, language)}</span>
            </div>
            <div>
              <span className="text-purple-400 font-medium">TVA Déductible:</span>{' '}
              <span className="font-bold text-purple-300">+{formatMAD(tvaCalc.taxAmount, language)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Date de paiement
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Mode de règlement
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as MoroccanPaymentMethod)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-200 focus:outline-hidden font-mono"
              >
                <option value="Virement bancaire">Virement bancaire</option>
                <option value="Carte bancaire CMI">Carte bancaire (CMI)</option>
                <option value="Chèque">Chèque</option>
                <option value="Espèces">Espèces (Caisse)</option>
                <option value="Prélèvement">Prélèvement automatique</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 font-sans">
            <input
              type="checkbox"
              id="deductible"
              checked={isDeductible}
              onChange={(e) => setIsDeductible(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-zinc-900 text-white focus:ring-0"
            />
            <label htmlFor="deductible" className="text-xs text-zinc-300">
              TVA Récupérable déductible de la déclaration fiscale trimestrielle
            </label>
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
              Enregistrer la Dépense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
