import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, Search } from 'lucide-react';
import { formatMAD, formatDate } from '../../utils/formatters';

export const PaymentsView: React.FC = () => {
  const { payments, language, t } = useApp();
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  const filteredPayments = payments.filter((p) => {
    const matchSearch =
      p.paymentNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      (p.reference && p.reference.toLowerCase().includes(search.toLowerCase()));

    const matchMethod = methodFilter === 'all' || p.paymentMethod === methodFilter;
    return matchSearch && matchMethod;
  });

  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            Cash Inflows
          </span>
          <h2 className="text-2xl lg:text-3xl font-serif italic text-white leading-tight mt-0.5">
            {t.payments}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {language === 'ar'
              ? 'سجل المقبوضات والتحصيلات، الشيكات والتحويلات البنكية المودعة'
              : 'Journal des encaissements clients et rapprochements bancaires.'}
          </p>
        </div>

        <div className="px-4 py-2 rounded-lg bg-[#0C0C0C] border border-white/10 font-mono">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 mr-2">
            {language === 'ar' ? 'إجمالي المحصل:' : 'Total Encaissé :'}
          </span>
          <span className="text-base font-bold text-emerald-400">
            {formatMAD(totalCollected, language)}
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-3 bg-[#0C0C0C] rounded-lg border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-4 py-1.5 rounded bg-[#080808] border border-white/10 text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-white/30"
            placeholder={
              language === 'ar'
                ? 'ابحث برقم الإيصال، الزبون، الفاتورة...'
                : 'Rechercher par n° reçu, client, facture, chèque...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="px-3 py-1.5 rounded bg-[#080808] border border-white/10 text-xs font-mono text-zinc-300 focus:outline-hidden self-end sm:self-auto"
        >
          <option value="all">{language === 'ar' ? 'جميع طرق الدفع' : 'Tous les modes de paiement'}</option>
          <option value="Virement bancaire">Virement bancaire</option>
          <option value="Chèque">Chèque</option>
          <option value="Espèces">Espèces (Caisse)</option>
          <option value="Effet de commerce (LCN)">Effet de commerce (LCN)</option>
          <option value="Carte bancaire CMI">Carte bancaire CMI</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="bg-[#0C0C0C] rounded-lg border border-white/10 overflow-hidden font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="bg-[#080808] border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <th className="py-3 px-4">{language === 'ar' ? 'رقم الإيصال' : 'N° Reçu'}</th>
                <th className="py-3 px-4 font-sans font-normal text-zinc-400">{t.customer}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'الفاتورة المرتبطة' : 'Facture Liée'}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'طريقة الدفع' : 'Mode & Réf.'}</th>
                <th className="py-3 px-4">{t.bank}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'المبلغ المحصل' : 'Montant Encaissé (MAD)'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>{language === 'ar' ? 'لا توجد مقبوضات مسجلة' : 'Aucun encaissement enregistré.'}</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {p.paymentNumber}
                      <p className="text-[10px] text-zinc-500 font-normal">{formatDate(p.paymentDate, language)}</p>
                    </td>

                    <td className="py-3.5 px-4 font-sans font-medium text-white">
                      {p.customerName}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[11px] font-bold text-white bg-white/10 px-2 py-0.5 rounded border border-white/10">
                        {p.invoiceNumber}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <p className="text-zinc-200">{p.paymentMethod}</p>
                      {p.reference && <p className="text-[10px] text-zinc-500">Réf: {p.reference}</p>}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-400">
                      {p.bankAccountName || 'Compte Principal'}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-xs text-emerald-400">
                      +{formatMAD(p.amount, language)}
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
