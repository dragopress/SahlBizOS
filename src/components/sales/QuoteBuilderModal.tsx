import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InvoiceItem, MoroccanTvaRate, Quote } from '../../types';
import { X, Plus, Trash2, FileSpreadsheet, Building2, Calculator, Sparkles } from 'lucide-react';
import { calculateInvoiceTotals, MOROCCAN_TVA_RATES } from '../../utils/taxCalculator';
import { formatMAD } from '../../utils/formatters';

interface QuoteBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuote?: Quote | null;
}

export const QuoteBuilderModal: React.FC<QuoteBuilderModalProps> = ({
  isOpen,
  onClose,
  initialQuote,
}) => {
  const { customers, products, addQuote, updateQuote, currentOrg, language, t } = useApp();

  const [customerId, setCustomerId] = useState(initialQuote?.customerId || customers[0]?.id || '');
  const [date, setDate] = useState(initialQuote?.date || new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState(
    initialQuote?.validUntil ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [paymentTerms, setPaymentTerms] = useState(initialQuote?.paymentTerms || '30 jours');
  const [notes, setNotes] = useState(
    initialQuote?.notes || 'Offre valable 30 jours à compter de la date d’émission. Règlement par virement bancaire.'
  );

  const [items, setItems] = useState<InvoiceItem[]>(
    initialQuote?.items || [
      {
        id: 'item_1',
        description: 'Prestation de conseil & intégration ERP SahlBiz',
        quantity: 1,
        unit: 'Prestation',
        unitPriceHT: 8500,
        discountPercent: 0,
        tvaRate: 20,
        totalHT: 8500,
        totalTVA: 1700,
        totalTTC: 10200,
      },
    ]
  );

  const [discountPercent, setDiscountPercent] = useState<number>(initialQuote?.discountPercent || 0);

  if (!isOpen) return null;

  const selectedCustomer = customers.find((c) => c.id === customerId);

  // Recalculate totals whenever items or discount change
  const totals = calculateInvoiceTotals(items, discountPercent);

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: 'item_' + Date.now(),
      description: '',
      quantity: 1,
      unit: 'Unité',
      unitPriceHT: 0,
      discountPercent: 0,
      tvaRate: 20,
      totalHT: 0,
      totalTVA: 0,
      totalTTC: 0,
    };
    setItems([...items, newItem]);
  };

  const handleProductSelect = (index: number, productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const newItems = [...items];
    const item = newItems[index];
    const qty = item.quantity || 1;
    const price = prod.sellingPriceHT;
    const tva = prod.tvaRate;
    const totHT = qty * price;
    const totTTC = totHT * (1 + tva / 100);

    newItems[index] = {
      ...item,
      productId: prod.id,
      description: prod.name + (prod.description ? ` - ${prod.description}` : ''),
      unitPriceHT: price,
      tvaRate: tva,
      quantity: qty,
      totalHT: totHT,
      totalTTC: totTTC,
    };
    setItems(newItems);
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, val: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: val };

    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPriceHT) || 0;
    const tva = Number(item.tvaRate) || 0;

    item.totalHT = qty * price;
    item.totalTTC = item.totalHT * (1 + tva / 100);

    newItems[index] = item;
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) {
      alert('Veuillez sélectionner un client.');
      return;
    }

    if (items.length === 0 || items.some((i) => !i.description.trim())) {
      alert('Veuillez saisir la description de chaque ligne.');
      return;
    }

    if (initialQuote) {
      updateQuote(initialQuote.id, {
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        customerICE: selectedCustomer.ice,
        customerAddress: selectedCustomer.address,
        customerCity: selectedCustomer.city,
        date,
        validUntil,
        paymentTerms,
        notes,
        items,
        subtotalHT: totals.subtotalHT,
        discountAmount: totals.discountAmount,
        discountPercent,
        tvaDetails: totals.tvaDetails,
        totalTVA: totals.totalTVA,
        totalTTC: totals.totalTTC,
      });
    } else {
      addQuote({
        organizationId: currentOrg.id,
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        customerICE: selectedCustomer.ice,
        customerAddress: selectedCustomer.address,
        customerCity: selectedCustomer.city,
        date,
        validUntil,
        status: 'sent',
        paymentTerms,
        notes,
        items,
        subtotalHT: totals.subtotalHT,
        discountAmount: totals.discountAmount,
        discountPercent,
        tvaDetails: totals.tvaDetails,
        totalTVA: totals.totalTVA,
        totalTTC: totals.totalTTC,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-[#0C0C0C] border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-white/5 border border-white/10 text-white">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                Commercial Proposal
              </span>
              <h3 className="font-serif italic text-white text-lg leading-tight">
                {initialQuote
                  ? language === 'ar'
                    ? 'تعديل عرض السعر'
                    : 'Modifier le Devis'
                  : language === 'ar'
                  ? 'إنشاء عرض سعر مغربي جديد'
                  : 'Nouveau Devis Commercial (Maroc)'}
              </h3>
              <p className="text-[10px] font-mono text-zinc-500">
                {currentOrg.name} • {currentOrg.city}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs font-mono">
          {/* Client & Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-[#080808] border border-white/10">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Client destinataire *
              </label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#0C0C0C] border border-white/10 text-xs font-mono text-zinc-200 focus:outline-hidden"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city})
                  </option>
                ))}
              </select>
              {selectedCustomer && (
                <p className="text-[10px] text-zinc-500 mt-1">
                  ICE: {selectedCustomer.ice || 'Non renseigné'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Date d'émission
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#0C0C0C] border border-white/10 text-xs text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Date de validité (Échéance)
              </label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#0C0C0C] border border-white/10 text-xs text-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[10px] uppercase tracking-wider text-zinc-400">
                Lignes de prestations / Articles (TVA Marocaine)
              </h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-white hover:text-zinc-300"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une ligne</span>
              </button>
            </div>

            <div className="border border-white/10 rounded-lg overflow-hidden bg-[#080808]">
              <table className="w-full text-left rtl:text-right border-collapse">
                <thead className="bg-[#0C0C0C] text-[10px] uppercase font-bold text-zinc-400 border-b border-white/10">
                  <tr>
                    <th className="p-2.5 w-1/3">Désignation / Article</th>
                    <th className="p-2.5 w-20 text-center">Qté</th>
                    <th className="p-2.5 w-28">P.U HT (MAD)</th>
                    <th className="p-2.5 w-24">TVA (%)</th>
                    <th className="p-2.5 w-28 text-right">Total HT</th>
                    <th className="p-2.5 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map((item, idx) => (
                    <tr key={item.id || idx} className="bg-[#080808]">
                      <td className="p-2 space-y-1">
                        <select
                          onChange={(e) => handleProductSelect(idx, e.target.value)}
                          className="w-full text-[10px] p-1 rounded bg-[#0C0C0C] border border-white/10 text-zinc-300 mb-1"
                        >
                          <option value="">-- Choisir depuis catalogue --</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.sellingPriceHT} MAD HT)
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="Description de la prestation..."
                          className="w-full px-2 py-1.5 rounded bg-[#0C0C0C] border border-white/10 text-xs text-white placeholder:text-zinc-500 font-sans"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded bg-[#0C0C0C] border border-white/10 text-xs text-center font-bold text-white"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPriceHT}
                          onChange={(e) => handleItemChange(idx, 'unitPriceHT', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded bg-[#0C0C0C] border border-white/10 text-xs font-bold text-white"
                        />
                      </td>

                      <td className="p-2">
                        <select
                          value={item.tvaRate}
                          onChange={(e) => handleItemChange(idx, 'tvaRate', Number(e.target.value) as MoroccanTvaRate)}
                          className="w-full px-2 py-1.5 rounded bg-[#0C0C0C] border border-white/10 text-xs text-zinc-300 font-mono"
                        >
                          {MOROCCAN_TVA_RATES.map((rate) => (
                            <option key={rate.rate} value={rate.rate}>
                              {rate.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-2 text-right font-bold text-xs text-white">
                        {formatMAD(item.totalHT, language)}
                      </td>

                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 rounded text-zinc-500 hover:text-rose-400"
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

          {/* Bottom Grid: Notes & Summary Recap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Conditions & Notes du devis
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 rounded bg-[#080808] border border-white/10 text-xs text-zinc-300 font-sans"
              />
            </div>

            <div className="p-4 rounded-lg bg-[#080808] border border-white/10 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Sous-total HT :</span>
                <span className="font-bold text-white">{formatMAD(totals.subtotalHT, language)}</span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Remise ({discountPercent}%) :</span>
                  <span className="font-bold">-{formatMAD(totals.discountAmount, language)}</span>
                </div>
              )}

              {/* TVA Details breakdown */}
              {totals.tvaDetails.map((tva, i) => (
                <div key={i} className="flex justify-between text-zinc-500 text-[10px]">
                  <span>TVA {tva.rate}% (Base: {formatMAD(tva.baseHT, language)}) :</span>
                  <span>{formatMAD(tva.taxAmount, language)}</span>
                </div>
              ))}

              <div className="flex justify-between text-zinc-300 pt-1 border-t border-white/10">
                <span>Total TVA :</span>
                <span className="font-bold text-white">{formatMAD(totals.totalTVA, language)}</span>
              </div>

              <div className="flex justify-between text-white pt-2 border-t border-white/20 text-sm font-bold">
                <span>Total Net TTC (MAD) :</span>
                <span className="text-emerald-400">{formatMAD(totals.totalTTC, language)}</span>
              </div>
            </div>
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
              {initialQuote ? 'Enregistrer le Devis' : 'Générer le Devis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
