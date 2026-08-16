import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StockMovement } from '../../types';
import {
  ArrowUpDown,
  Search,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const InventoryMovementsView: React.FC = () => {
  const { stockMovements, warehouses, setActiveModal, language, t } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [warehouseFilter, setWarehouseFilter] = useState('all');

  const filteredMovements = stockMovements.filter((m) => {
    const matchSearch =
      m.productName.toLowerCase().includes(search.toLowerCase()) ||
      (m.reference && m.reference.toLowerCase().includes(search.toLowerCase())) ||
      (m.notes && m.notes.toLowerCase().includes(search.toLowerCase()));

    const matchType = typeFilter === 'all' || m.type === typeFilter;
    const matchWh = warehouseFilter === 'all' || m.warehouseId === warehouseFilter;
    return matchSearch && matchType && matchWh;
  });

  const getMovementTypeBadge = (type: StockMovement['type']) => {
    switch (type) {
      case 'purchase':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ArrowDownLeft className="w-3 h-3 text-emerald-400" />
            Achat / Réception
          </span>
        );
      case 'sale':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ArrowUpRight className="w-3 h-3 text-rose-400" />
            Sortie Vente
          </span>
        );
      case 'adjustment':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Ajustement
          </span>
        );
      case 'transfer':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <RefreshCw className="w-3 h-3 text-sky-400" />
            Transfert
          </span>
        );
      case 'return':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Retour
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/5 text-zinc-300 border border-white/10">
            Mouvement
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            Audit & Stock Flows
          </span>
          <h2 className="text-2xl lg:text-3xl font-serif italic text-white leading-tight mt-0.5">
            {t.stockMovements}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {language === 'ar'
              ? 'تتبع حركات المخزون، المبيعات، الواردات، وتعديلات الجرد الدوري للمستودعات'
              : 'Journal des entrées, sorties, ventes et transferts de stocks entre dépôts.'}
          </p>
        </div>

        <button
          onClick={() => setActiveModal('stock_movement')}
          className="flex items-center gap-2 px-4 py-2 rounded bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'تسجيل حركة مخزون' : 'Nouvel Ajustement'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-3 bg-[#0C0C0C] rounded-lg border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-4 py-1.5 rounded bg-[#080808] border border-white/10 text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-white/30"
            placeholder={
              language === 'ar'
                ? 'ابحث بالمنتج، المرجع، الملاحظات...'
                : 'Rechercher par article, référence...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="px-3 py-1.5 rounded bg-[#080808] border border-white/10 text-xs font-mono text-zinc-300 focus:outline-hidden"
          >
            <option value="all">{language === 'ar' ? 'جميع المستودعات' : 'Tous les dépôts'}</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded bg-[#080808] border border-white/10 text-xs font-mono text-zinc-300 focus:outline-hidden"
          >
            <option value="all">{language === 'ar' ? 'جميع أنواع الحركات' : 'Tous les types'}</option>
            <option value="in_purchase">Entrée Achat</option>
            <option value="out_sale">Sortie Vente</option>
            <option value="in_adjustment">Ajustement Positif</option>
            <option value="out_adjustment">Ajustement Négatif</option>
            <option value="transfer">Transfert Inter-dépôt</option>
          </select>
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-[#0C0C0C] rounded-lg border border-white/10 overflow-hidden font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="bg-[#080808] border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <th className="py-3 px-4">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                <th className="py-3 px-4 font-sans font-normal text-zinc-400">{language === 'ar' ? 'المادة' : 'Article'}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'نوع الحركة' : 'Type'}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'الكمية' : 'Quantité'}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'المستودع' : 'Entrepôt'}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'المرجع والملاحظات' : 'Réf. & Remarques'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    <ArrowUpDown className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>{language === 'ar' ? 'لا توجد حركات مخزون' : 'Aucun mouvement de stock enregistré.'}</p>
                  </td>
                </tr>
              ) : (
                filteredMovements.map((m) => {
                  const isPositive = m.quantity > 0;
                  return (
                    <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                        {formatDate(m.date, language)}
                      </td>

                      <td className="py-3.5 px-4 font-sans font-medium text-white">
                        {m.productName}
                      </td>

                      <td className="py-3.5 px-4">{getMovementTypeBadge(m.type)}</td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold text-xs font-mono ${
                            isPositive ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isPositive ? `+${m.quantity}` : m.quantity}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-zinc-300 text-xs">
                        {m.warehouseName || 'Dépôt Casablanca'}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-mono text-white text-xs">
                          {m.reference || 'Ajustement manuel'}
                        </p>
                        {m.notes && <p className="text-[10px] text-zinc-500 font-sans">{m.notes}</p>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
