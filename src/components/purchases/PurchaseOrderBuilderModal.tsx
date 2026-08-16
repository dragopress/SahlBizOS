import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2, ShoppingCart, Calculator, AlertCircle } from 'lucide-react';
import { LineItem } from '../../types';
import { calculateLineTotals } from '../../utils/taxCalculator';
import { formatMAD } from '../../utils/formatters';

interface PurchaseOrderBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PurchaseOrderBuilderModal: React.FC<PurchaseOrderBuilderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentOrg, suppliers, products, addPurchaseOrder, language } = useApp();

  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  const [items, setItems] = useState<LineItem[]>([
    {
      id: 'po_item_1',
      description: products[0]?.name || 'Fourniture industrielle',
      quantity: 5,
      unit: 'Unité',
      unitPriceHT: products[0]?.purchasePriceHT || 500,
      discountPercent: 0,
      tvaRate: 20,
      totalHT: (products[0]?.purchasePriceHT || 500) * 5,
      totalTVA: ((products[0]?.purchasePriceHT || 500) * 5 * 20) / 100,
      totalTTC: (products[0]?.purchasePriceHT || 500) * 5 * 1.2,
      productId: products[0]?.id,
    },
  ]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    const newItem: LineItem = {
      id: 'po_item_' + Date.now(),
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

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: keyof LineItem, value: any) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: value };

    // If selecting a known product
    if (field === 'productId') {
      const prod = products.find((p) => p.id === value);
      if (prod) {
        current.description = prod.name;
        current.unitPriceHT = prod.purchasePriceHT;
        current.tvaRate = prod.tvaRate;
      }
    }

    const { totalHT, totalTVA, totalTTC } = calculateLineTotals(
      Number(current.quantity) || 0,
      Number(current.unitPriceHT) || 0,
      Number(current.discountPercent) || 0,
      Number(current.tvaRate) || 0
    );

    current.totalHT = totalHT;
    current.totalTVA = totalTVA;
    current.totalTTC = totalTTC;

    updated[index] = current;
    setItems(updated);
  };

  const subtotalHT = items.reduce((sum, item) => sum + item.totalHT, 0);
  const totalTVA = items.reduce((sum, item) => sum + item.totalTVA, 0);
  const totalTTC = subtotalHT + totalTVA;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find((s) => s.id === supplierId);
    if (!sup) return;

    addPurchaseOrder({
      organizationId: currentOrg.id,
      supplierId: sup.id,
      supplierName: sup.name,
      date,
      expectedDeliveryDate,
      items,
      subtotalHT: Number(subtotalHT.toFixed(2)),
      totalTVA: Number(totalTVA.toFixed(2)),
      totalTTC: Number(totalTTC.toFixed(2)),
      status: 'sent',
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#0C0C0C] border border-white/10 rounded-lg max-w-3xl w-full shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#080808]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-white/5 border border-white/10 text-white">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold">
                {language === 'ar' ? 'أمر شراء' : 'Bon de Commande'}
              </span>
              <h3 className="font-serif italic text-lg text-white font-normal leading-tight">
                {language === 'ar' ? 'إصدار أمر شراء مورد جديد' : 'Nouveau Bon de Commande Fournisseur'}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs font-mono">
          {/* Supplier and Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                {language === 'ar' ? 'المورد *' : 'Fournisseur *'}
              </label>
              <select
                required
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-white focus:outline-hidden focus:border-white/30"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.ice ? `(ICE: ${s.ice})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                {language === 'ar' ? 'تاريخ الطلب' : 'Date de Commande'}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-white focus:outline-hidden focus:border-white/30"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                {language === 'ar' ? 'تاريخ التسليم المتوقع' : 'Livraison Souhaitée'}
              </label>
              <input
                type="date"
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-white focus:outline-hidden focus:border-white/30"
              />
            </div>
          </div>

          {/* Line items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400">
                {language === 'ar' ? 'عناصر أمر الشراء' : 'Lignes de Commande'}
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1 text-[11px] text-white hover:text-zinc-300 font-bold"
              >
                <Plus className="w-3 h-3" />
                <span>{language === 'ar' ? 'إضافة سطر' : 'Ajouter une ligne'}</span>
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 rounded bg-[#080808] border border-white/10 grid grid-cols-12 gap-2 items-center"
                >
                  <div className="col-span-12 sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Description de l'article"
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-[#0C0C0C] border border-white/10 text-white text-xs"
                      required
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qté"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded bg-[#0C0C0C] border border-white/10 text-white text-xs"
                      required
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Prix Achat HT"
                      value={item.unitPriceHT}
                      onChange={(e) => handleItemChange(idx, 'unitPriceHT', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded bg-[#0C0C0C] border border-white/10 text-white text-xs"
                      required
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <select
                      value={item.tvaRate}
                      onChange={(e) => handleItemChange(idx, 'tvaRate', Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded bg-[#0C0C0C] border border-white/10 text-white text-xs"
                    >
                      <option value="20">TVA 20%</option>
                      <option value="14">TVA 14%</option>
                      <option value="10">TVA 10%</option>
                      <option value="7">TVA 7%</option>
                      <option value="0">TVA 0%</option>
                    </select>
                  </div>

                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      disabled={items.length <= 1}
                      className="p-1 rounded text-zinc-500 hover:text-rose-400 disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes & Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                {language === 'ar' ? 'شروط وملاحظات التسليم' : 'Instructions & Conditions Fournisseur'}
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Livraison au dépôt Casablanca avec bon de livraison conforme..."
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-white text-xs focus:outline-hidden"
              />
            </div>

            <div className="p-3.5 rounded bg-[#080808] border border-white/10 space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Total HT :</span>
                <span>{formatMAD(subtotalHT, language)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Total TVA Récupérable :</span>
                <span>{formatMAD(totalTVA, language)}</span>
              </div>
              <div className="flex justify-between text-white font-bold border-t border-white/10 pt-1 text-sm">
                <span>Total TTC :</span>
                <span>{formatMAD(totalTTC, language)}</span>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="border-t border-white/10 pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors font-mono text-xs"
            >
              {language === 'ar' ? 'إلغاء' : 'Annuler'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors"
            >
              {language === 'ar' ? 'إصدار أمر الشراء' : 'Valider & Émettre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
