import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  Edit2,
  Trash2,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { formatMAD } from '../../utils/formatters';

export const ProductsView: React.FC = () => {
  const { products, deleteProduct, setActiveModal, language, t } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'product' | 'service'>('all');

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()));

    const matchType = typeFilter === 'all' || p.type === typeFilter;
    return matchSearch && matchType;
  });

  const lowStockCount = products.filter((p) => p.type === 'product' && p.currentStock <= p.minStockAlert).length;
  const totalStockValueHT = products
    .filter((p) => p.type === 'product')
    .reduce((acc, p) => acc + p.currentStock * (p.purchasePriceHT || p.sellingPriceHT * 0.7), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            Catalog & Inventory
          </span>
          <h2 className="text-2xl lg:text-3xl font-serif italic text-white leading-tight mt-0.5">
            {t.productsServices}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {language === 'ar'
              ? 'دليل المنتجات والخدمات، الأسعار بدون ضريبة (HT)، نسب الضريبة على القيمة المضافة ومستويات المخزون'
              : 'Catalogue articles et prestations, prix HT/TTC, gestion des stocks et alertes seuils.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModal('stock_movement')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 font-mono text-xs uppercase tracking-wider transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <span>{language === 'ar' ? 'حركة مخزون' : 'Ajustement Stock'}</span>
          </button>

          <button
            onClick={() => setActiveModal('new_product')}
            className="flex items-center gap-2 px-4 py-2 rounded bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'إضافة منتج/خدمة' : 'Nouvel Article'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 font-mono">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">
            {language === 'ar' ? 'إجمالي المواد والخدمات' : 'Articles au Catalogue'}
          </span>
          <p className="text-xl font-bold text-white mt-1">
            {products.length}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 font-mono">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">
            {language === 'ar' ? 'القيمة التقديرية للمخزون' : 'Valeur Stock Estimée'}
          </span>
          <p className="text-xl font-bold text-emerald-400 mt-1">
            {formatMAD(totalStockValueHT, language)}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 font-mono">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">
            {language === 'ar' ? 'تنبيهات المخزون المنخفض' : 'Alertes Stock Min'}
          </span>
          <p className={`text-xl font-bold mt-1 ${lowStockCount > 0 ? 'text-amber-400' : 'text-white'}`}>
            {lowStockCount} {language === 'ar' ? 'مواد' : 'articles'}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-3 bg-[#0C0C0C] rounded-lg border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-4 py-1.5 rounded bg-[#080808] border border-white/10 text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-white/30"
            placeholder={
              language === 'ar'
                ? 'ابحث بالاسم، المرجع SKU، التصنيف...'
                : 'Rechercher par référence, désignation...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="inline-flex rounded bg-[#080808] p-1 border border-white/10 text-xs font-mono self-end sm:self-auto">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1 rounded transition-colors text-[10px] uppercase tracking-wider ${
              typeFilter === 'all' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Tous ({products.length})
          </button>
          <button
            onClick={() => setTypeFilter('product')}
            className={`px-3 py-1 rounded transition-colors text-[10px] uppercase tracking-wider ${
              typeFilter === 'product' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Produits Physiques
          </button>
          <button
            onClick={() => setTypeFilter('service')}
            className={`px-3 py-1 rounded transition-colors text-[10px] uppercase tracking-wider ${
              typeFilter === 'service' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Services & Prestations
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#0C0C0C] rounded-lg border border-white/10 overflow-hidden font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="bg-[#080808] border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <th className="py-3 px-4">{language === 'ar' ? 'المادة / الخدمة' : 'Article / Prestation'}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'المرجع والتصنيف' : 'Réf. & Catégorie'}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'سعر البيع HT' : 'Prix Vente HT'}</th>
                <th className="py-3 px-4">TVA (%)</th>
                <th className="py-3 px-4">{t.stock}</th>
                <th className="py-3 px-4 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>{language === 'ar' ? 'لا توجد عناصر مطابقة' : 'Aucun article trouvé.'}</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLow = p.type === 'product' && p.currentStock <= p.minStockAlert;
                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-sans">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded bg-white/5 border border-white/10 text-zinc-300">
                            {p.type === 'service' ? <Layers className="w-3.5 h-3.5 text-sky-400" /> : <Package className="w-3.5 h-3.5 text-emerald-400" />}
                          </div>
                          <div>
                            <p className="font-medium text-white text-xs">{p.name}</p>
                            <p className="text-[10px] font-mono text-zinc-500 truncate max-w-xs">{p.description}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs text-white">{p.sku}</span>
                        <p className="text-[10px] text-zinc-500">{p.category || 'Général'}</p>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-xs text-white">
                        {formatMAD(p.sellingPriceHT, language)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-zinc-300">{p.tvaRate}%</span>
                      </td>

                      <td className="py-3.5 px-4">
                        {p.type === 'service' ? (
                          <span className="text-zinc-500 italic text-[11px]">Service (Illimité)</span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded border ${
                                isLow
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              }`}
                            >
                              {p.currentStock} {p.unit}
                            </span>
                            {isLow && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setActiveModal('edit_product', p)}
                            className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Supprimer l'article ${p.name} ?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 rounded text-zinc-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
