import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Expense } from '../../types';
import {
  Receipt,
  Plus,
  Search,
  Sparkles,
  Paperclip,
  CheckCircle,
  Clock,
  Trash2,
  PieChart,
  Layers,
} from 'lucide-react';
import { formatMAD, formatDate } from '../../utils/formatters';

export const ExpensesView: React.FC = () => {
  const { expenses, deleteExpense, setActiveModal, language, t } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredExpenses = expenses.filter((e) => {
    const matchSearch =
      e.expenseNumber.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      (e.supplierName && e.supplierName.toLowerCase().includes(search.toLowerCase()));

    const matchCat = categoryFilter === 'all' || e.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const totalExpensesTTC = expenses.reduce((acc, e) => acc + e.amountTTC, 0);
  const totalTvaRecuperable = expenses
    .filter((e) => e.isDeductible)
    .reduce((acc, e) => acc + e.tvaAmount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            Purchases & Operating Costs
          </span>
          <h2 className="text-2xl lg:text-3xl font-serif italic text-white leading-tight mt-0.5">
            {t.expenses}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {language === 'ar'
              ? 'تسجيل النفقات والمصاريف التشغيلية، احتساب الضريبة القابلة للاسترداد وتصنيف التكاليف'
              : 'Journal des charges, TVA récupérable, notes de frais et reconnaissance OCR de reçus.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* AI OCR Scanner Button */}
          <button
            onClick={() => setActiveModal('ai_ocr')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono text-xs uppercase tracking-wider transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'المسح بالذكاء الاصطناعي' : 'Scanner Reçu (OCR)'}</span>
          </button>

          <button
            onClick={() => setActiveModal('new_expense')}
            className="flex items-center gap-2 px-4 py-2 rounded bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تسجيل نفقة جديدة' : 'Nouvelle Dépense'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 font-mono">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">
            {language === 'ar' ? 'إجمالي النفقات TTC' : 'Total Dépenses TTC'}
          </span>
          <p className="text-xl font-bold text-white mt-1">
            {formatMAD(totalExpensesTTC, language)}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 font-mono">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">
            {language === 'ar' ? 'الضريبة القابلة للاسترداد (TVA)' : 'TVA Récupérable (Déductible)'}
          </span>
          <p className="text-xl font-bold text-emerald-400 mt-1">
            {formatMAD(totalTvaRecuperable, language)}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 font-mono">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">
            {language === 'ar' ? 'عدد النفقات المسجلة' : 'Nombre de Pièces'}
          </span>
          <p className="text-xl font-bold text-white mt-1">
            {expenses.length}
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
                ? 'ابحث بالرقم، الوصف، المورد...'
                : 'Rechercher par libellé, fournisseur...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-1.5 rounded bg-[#080808] border border-white/10 text-xs font-mono text-zinc-300 focus:outline-hidden self-end sm:self-auto"
        >
          <option value="all">{language === 'ar' ? 'جميع الفئات' : 'Toutes les catégories'}</option>
          <option value="Loyer & Charges">Loyer & Charges</option>
          <option value="Abonnements & Logiciels">Abonnements & Logiciels</option>
          <option value="Télécoms & Internet">Télécoms & Internet</option>
          <option value="Carburant & Déplacements">Carburant & Déplacements</option>
          <option value="Fournitures & Bureautique">Fournitures & Bureautique</option>
          <option value="Honoraires & Comptabilité">Honoraires & Comptabilité</option>
          <option value="Marketing & Publicité">Marketing & Publicité</option>
        </select>
      </div>

      {/* Expenses Table */}
      <div className="bg-[#0C0C0C] rounded-lg border border-white/10 overflow-hidden font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="bg-[#080808] border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <th className="py-3 px-4">{language === 'ar' ? 'رقم النفقة' : 'N° Pièce'}</th>
                <th className="py-3 px-4 font-sans font-normal text-zinc-400">{language === 'ar' ? 'الوصف والتصنيف' : 'Désignation & Catégorie'}</th>
                <th className="py-3 px-4 font-sans font-normal text-zinc-400">{t.supplier}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'التاريخ والدفع' : 'Date & Mode'}</th>
                <th className="py-3 px-4">TVA (%)</th>
                <th className="py-3 px-4">{language === 'ar' ? 'المبلغ الإجمالي TTC' : 'Montant TTC'}</th>
                <th className="py-3 px-4 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>{language === 'ar' ? 'لا توجد نفقات مسجلة' : 'Aucune dépense trouvée.'}</p>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {exp.expenseNumber}
                    </td>

                    <td className="py-3.5 px-4 font-sans">
                      <p className="font-medium text-white text-xs">{exp.description}</p>
                      <span className="inline-block mt-0.5 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-zinc-300">
                        {exp.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-sans text-zinc-300 text-xs">
                      {exp.supplierName || 'Divers'}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="text-zinc-300 font-medium">{formatDate(exp.date, language)}</p>
                      <p className="text-[10px] text-zinc-500">{exp.paymentMethod}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-zinc-300">{exp.tvaRate}%</span>
                      {exp.isDeductible && (
                        <p className="text-[10px] text-emerald-400 font-semibold">
                          +{formatMAD(exp.tvaAmount, language)}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-xs text-white">
                      {formatMAD(exp.amountTTC, language)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          if (window.confirm('Supprimer cette charge ?')) {
                            deleteExpense(exp.id);
                          }
                        }}
                        className="p-1.5 rounded text-zinc-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
