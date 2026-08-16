import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice } from '../../types';
import {
  FileCheck2,
  Plus,
  Search,
  CheckCircle,
  Clock,
  AlertOctagon,
  Printer,
  CreditCard,
  Ban,
  Send,
} from 'lucide-react';
import { formatMAD } from '../../utils/formatters';

export const InvoicesView: React.FC = () => {
  const { invoices, setActiveModal, language, t } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (inv.customerICE && inv.customerICE.includes(search));

    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-2.5 h-2.5" />
            {t.paid}
          </span>
        );
      case 'partially_paid':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Clock className="w-2.5 h-2.5" />
            {t.partiallyPaid}
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <AlertOctagon className="w-2.5 h-2.5" />
            {t.overdue}
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Send className="w-2.5 h-2.5" />
            {t.sent}
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-zinc-800 text-zinc-500 border border-zinc-700">
            <Ban className="w-2.5 h-2.5" />
            {t.cancelled}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white/5 text-zinc-400 border border-white/10">
            {t.draft}
          </span>
        );
    }
  };

  const totalInvoiced = invoices.reduce((acc, i) => acc + (i.status !== 'cancelled' ? i.totalTTC : 0), 0);
  const totalEncaisse = invoices.reduce((acc, i) => acc + i.amountPaid, 0);
  const totalRestant = invoices.reduce((acc, i) => acc + (i.status !== 'cancelled' ? i.balanceDue : 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            Revenue Ledger
          </span>
          <h2 className="text-2xl lg:text-3xl font-serif italic text-white leading-tight mt-0.5">
            {t.invoices}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {language === 'ar'
              ? 'إدارة الفواتير المغربية الرسمية، تتبع المدفوعات والديون، والطباعة القانونية'
              : 'Factures de vente B2B conformes DGI Maroc, encaissements et relances clients.'}
          </p>
        </div>

        <button
          onClick={() => setActiveModal('new_invoice')}
          className="flex items-center gap-2 px-4 py-2.5 rounded bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.newInvoice}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg bg-[#0C0C0C] border border-white/10">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            {language === 'ar' ? 'إجمالي الفواتير الصادرة' : 'Total Facturé TTC'}
          </span>
          <p className="text-xl lg:text-2xl font-mono font-bold text-white mt-1.5">
            {formatMAD(totalInvoiced, language)}
          </p>
        </div>

        <div className="p-5 rounded-lg bg-[#0C0C0C] border border-white/10">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            {language === 'ar' ? 'المبالغ المحصلة' : 'Total Encaissé'}
          </span>
          <p className="text-xl lg:text-2xl font-mono font-bold text-emerald-400 mt-1.5">
            {formatMAD(totalEncaisse, language)}
          </p>
        </div>

        <div className="p-5 rounded-lg bg-[#0C0C0C] border border-white/10">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            {language === 'ar' ? 'الديون المتبقية (Créances)' : 'Solde Restant Dû'}
          </span>
          <p className="text-xl lg:text-2xl font-mono font-bold text-amber-400 mt-1.5">
            {formatMAD(totalRestant, language)}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-4 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-white/30 font-mono"
            placeholder={
              language === 'ar'
                ? 'ابحث برقم الفاتورة، الزبون، ICE...'
                : 'Rechercher par numéro, client, ICE...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs font-mono text-zinc-200 focus:outline-hidden self-end sm:self-auto"
        >
          <option value="all">{language === 'ar' ? 'كل الحالات' : 'Tous les statuts'}</option>
          <option value="paid">{t.paid}</option>
          <option value="partially_paid">{t.partiallyPaid}</option>
          <option value="overdue">{t.overdue}</option>
          <option value="sent">{t.sent}</option>
          <option value="cancelled">{t.cancelled}</option>
        </select>
      </div>

      {/* Invoices Table */}
      <div className="bg-[#0C0C0C] rounded-lg border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="bg-[#080808] border-b border-white/10 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                <th className="py-3 px-4">{language === 'ar' ? 'رقم الفاتورة' : 'N° Facture'}</th>
                <th className="py-3 px-4">{t.customer}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'التاريخ والإشعار' : 'Date & Échéance'}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'المبلغ الإجمالي TTC' : 'Montant TTC'}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'المتبقي للسداد' : 'Reste Dû'}</th>
                <th className="py-3 px-4">{t.status}</th>
                <th className="py-3 px-4 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500 font-mono text-xs">
                    <FileCheck2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>{language === 'ar' ? 'لا توجد فواتير' : 'Aucune facture trouvée.'}</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    onClick={() => setActiveModal('invoice_print', inv)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-zinc-200">{inv.customerName}</p>
                        <p className="text-[10px] font-mono text-zinc-500">ICE: {inv.customerICE || '—'}</p>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="text-zinc-300 font-mono text-xs">{inv.date}</p>
                      <p className="text-[10px] font-mono text-zinc-500">Échéance: {inv.dueDate}</p>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {formatMAD(inv.totalTTC, language)}
                    </td>

                    <td className="py-3 px-4 font-mono">
                      {inv.balanceDue > 0 ? (
                        <span className="font-bold text-amber-400">
                          {formatMAD(inv.balanceDue, language)}
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium">0 MAD</span>
                      )}
                    </td>

                    <td className="py-3 px-4">{getStatusBadge(inv.status)}</td>

                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Print / PDF Action */}
                        <button
                          onClick={() => setActiveModal('invoice_print', inv)}
                          title="Imprimer / Télécharger Facture PDF"
                          className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* Record Payment Button */}
                        {inv.balanceDue > 0 && inv.status !== 'cancelled' && (
                          <button
                            onClick={() => setActiveModal('record_payment', inv)}
                            title="Encaisser un paiement"
                            className="px-2.5 py-1 rounded bg-white text-black hover:bg-zinc-200 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors shadow-xs flex items-center gap-1"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>{language === 'ar' ? 'تحصيل' : 'Encaisser'}</span>
                          </button>
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

