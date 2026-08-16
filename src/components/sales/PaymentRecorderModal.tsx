import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice, MoroccanPaymentMethod } from '../../types';
import { X, CreditCard, CheckCircle, Building, AlertCircle } from 'lucide-react';
import { formatMAD } from '../../utils/formatters';

interface PaymentRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export const PaymentRecorderModal: React.FC<PaymentRecorderModalProps> = ({
  isOpen,
  onClose,
  invoice,
}) => {
  const { recordPayment, bankAccounts, currentOrg, language, t } = useApp();

  const [amount, setAmount] = useState<number>(invoice?.balanceDue || 0);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<MoroccanPaymentMethod>('Virement bancaire');
  const [bankAccountId, setBankAccountId] = useState<string>(bankAccounts[0]?.id || 'bank_attijari');
  const [reference, setReference] = useState<string>('');
  const [notes, setNotes] = useState<string>('Règlement reçu.');

  if (!isOpen || !invoice) return null;

  const selectedBank = bankAccounts.find((b) => b.id === bankAccountId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('Le montant doit être supérieur à 0.');
      return;
    }

    if (amount > invoice.balanceDue) {
      if (!window.confirm(`Le montant (${amount} MAD) dépasse le reste dû (${invoice.balanceDue} MAD). Continuer ?`)) {
        return;
      }
    }

    recordPayment({
      organizationId: currentOrg.id,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      customerId: invoice.customerId,
      customerName: invoice.customerName,
      amount,
      paymentDate,
      paymentMethod,
      bankAccountId,
      bankAccountName: selectedBank?.bankName || 'Banque',
      reference,
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
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                Payment Collection
              </span>
              <h3 className="font-serif italic text-white text-lg leading-tight">
                {language === 'ar' ? 'تسجيل دفعة جديدة' : 'Enregistrer un Encaissement'}
              </h3>
              <p className="text-[10px] font-mono text-zinc-500">
                {invoice.invoiceNumber} • {invoice.customerName}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
          {/* Invoice Summary Pill */}
          <div className="p-3.5 rounded bg-[#080808] border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Montant Total TTC :</p>
              <p className="font-bold text-white text-xs mt-0.5">{formatMAD(invoice.totalTTC, language)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Reste Dû :</p>
              <p className="font-bold text-amber-400 text-xs mt-0.5">{formatMAD(invoice.balanceDue, language)}</p>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
              Montant encaissé (MAD) *
            </label>
            <input
              type="number"
              required
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-base font-bold text-emerald-400 focus:outline-hidden font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Date de règlement
              </label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Mode de paiement
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as MoroccanPaymentMethod)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-200 focus:outline-hidden font-mono"
              >
                <option value="Virement bancaire">Virement bancaire</option>
                <option value="Chèque">Chèque</option>
                <option value="Espèces">Espèces (Caisse)</option>
                <option value="Effet de commerce (LCN)">Effet de commerce (LCN)</option>
                <option value="Carte bancaire CMI">Carte bancaire (CMI)</option>
                <option value="Prélèvement">Prélèvement</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Compte d'encaissement
              </label>
              <select
                value={bankAccountId}
                onChange={(e) => setBankAccountId(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-200 focus:outline-hidden font-mono"
              >
                {bankAccounts.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bankName} - {b.accountName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                N° Réf. Chèque / Virement
              </label>
              <input
                type="text"
                placeholder="Ex: CHQ-981245 ou VIR-8712"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
              Remarques
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white focus:outline-hidden font-sans"
            />
          </div>

          {/* Footer Actions */}
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
              Valider l'Encaissement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
