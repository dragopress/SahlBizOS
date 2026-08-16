import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Quote } from '../../types';
import {
  FileSpreadsheet,
  Plus,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Printer,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import { formatMAD } from '../../utils/formatters';

export const QuotesView: React.FC = () => {
  const { quotes, convertQuoteToInvoice, setActiveModal, language, t } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredQuotes = quotes.filter((q) => {
    const matchSearch =
      q.quoteNumber.toLowerCase().includes(search.toLowerCase()) ||
      q.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (q.customerICE && q.customerICE.includes(search));

    const matchStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: Quote['status']) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" />
            {t.accepted}
          </span>
        );
      case 'converted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <FileCheck2 className="w-3 h-3" />
            {t.converted}
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            {t.sent}
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" />
            {t.rejected}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/5 text-zinc-400 border border-white/10">
            {t.draft}
          </span>
        );
    }
  };

  const totalQuotesValue = quotes.reduce((acc, q) => acc + q.totalTTC, 0);
  const acceptedQuotesValue = quotes
    .filter((q) => q.status === 'accepted' || q.status === 'converted')
    .reduce((acc, q) => acc + q.totalTTC, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            Sales & Proposals
          </span>
          <h2 className="text-2xl lg:text-3xl font-serif italic text-white leading-tight mt-0.5">
            {t.quotes}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {language === 'ar'
              ? 'إنشاء عروض الأسعار والتحويل بنقرة واحدة إلى فواتير مغربية رسمية مع خصم المخزون'
              : 'Gestion des devis commerciaux et conversion en 1-clic vers factures officielles.'}
          </p>
        </div>

        <button
          onClick={() => setActiveModal('new_quote')}
          className="flex items-center gap-2 px-4 py-2 rounded bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.newQuote}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 font-mono">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">
            {language === 'ar' ? 'إجمالي عروض الأسعار' : 'Total Devis Émis'}
          </span>
          <p className="text-xl font-bold text-white mt-1">
            {formatMAD(totalQuotesValue, language)}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 font-mono">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">
            {language === 'ar' ? 'العروض المقبولة والمحولة' : 'Devis Acceptés / Convertis'}
          </span>
          <p className="text-xl font-bold text-emerald-400 mt-1">
            {formatMAD(acceptedQuotesValue, language)}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 font-mono">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">
            {language === 'ar' ? 'معدل النجاح والتحويل' : 'Taux de Clôture'}
          </span>
          <p className="text-xl font-bold text-sky-400 mt-1">
            {quotes.length > 0 ? Math.round((acceptedQuotesValue / totalQuotesValue) * 100) : 0}%
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
                ? 'ابحث برقم العرض، الزبون، ICE...'
                : 'Rechercher par numéro, client, ICE...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 rounded bg-[#080808] border border-white/10 text-xs font-mono text-zinc-300 focus:outline-hidden self-end sm:self-auto"
        >
          <option value="all">{language === 'ar' ? 'كل الحالات' : 'Tous les statuts'}</option>
          <option value="draft">Brouillon</option>
          <option value="sent">Envoyé</option>
          <option value="accepted">Accepté</option>
          <option value="converted">Converti en facture</option>
          <option value="rejected">Refusé</option>
        </select>
      </div>

      {/* Quotes Table */}
      <div className="bg-[#0C0C0C] rounded-lg border border-white/10 overflow-hidden font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="bg-[#080808] border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <th className="py-3 px-4">{language === 'ar' ? 'رقم العرض' : 'N° Devis'}</th>
                <th className="py-3 px-4 font-sans font-normal text-zinc-400">{t.customer}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'التاريخ والمدة' : 'Date & Validité'}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'المبلغ الإجمالي TTC' : 'Montant TTC (MAD)'}</th>
                <th className="py-3 px-4">{t.status}</th>
                <th className="py-3 px-4 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>{language === 'ar' ? 'لا توجد عروض أسعار' : 'Aucun devis trouvé.'}</p>
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((q) => (
                  <tr
                    key={q.id}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    onClick={() => setActiveModal('quote_print', q)}
                  >
                    <td className="py-3.5 px-4 font-bold text-white">
                      {q.quoteNumber}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <div>
                        <p className="font-medium text-white">{q.customerName}</p>
                        <p className="text-[10px] font-mono text-zinc-500">ICE: {q.customerICE || '—'}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[11px]">
                      <p className="text-zinc-300 font-medium">{q.date}</p>
                      <p className="text-[10px] text-zinc-500">Validité: {q.validUntil}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-xs text-white">
                        {formatMAD(q.totalTTC, language)}
                      </p>
                      <p className="text-[10px] text-zinc-500">HT: {formatMAD(q.subtotalHT, language)}</p>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(q.status)}</td>
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Print / Preview Action */}
                        <button
                          onClick={() => setActiveModal('quote_print', q)}
                          title="Imprimer / PDF"
                          className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* 1-Click Convert to Invoice Action */}
                        {q.status !== 'converted' ? (
                          <button
                            onClick={() => {
                              try {
                                const newInv = convertQuoteToInvoice(q.id);
                                setActiveModal('invoice_print', newInv);
                              } catch (err: any) {
                                alert(err.message);
                              }
                            }}
                            title="Convertir en Facture officielle"
                            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white hover:text-black text-zinc-300 text-[10px] font-mono uppercase tracking-wider transition-all border border-white/10 flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>{language === 'ar' ? 'تحويل لفاتورة' : 'Facturer'}</span>
                          </button>
                        ) : (
                          <span className="text-[10px] font-mono text-sky-400 flex items-center gap-0.5">
                            {q.convertedToInvoiceNumber}
                          </span>
                        )}
                      </div>
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
