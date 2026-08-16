import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Copy,
  Check,
  Calendar,
  AlertCircle,
  Plus,
  RefreshCw,
  Wallet,
} from 'lucide-react';
import { formatMAD, formatDate } from '../../utils/formatters';

export const BankingView: React.FC<{ initialTab?: 'accounts' | 'forecast' }> = ({
  initialTab = 'accounts',
}) => {
  const { bankAccounts, payments, expenses, invoices, purchaseOrders, language, t } = useApp();
  const [tab, setTab] = useState<'accounts' | 'forecast'>(initialTab);
  const [copiedRib, setCopiedRib] = useState<string | null>(null);

  const totalBankBalances = bankAccounts.reduce((acc, b) => acc + b.currentBalance, 0);

  const handleCopyRib = (rib: string) => {
    navigator.clipboard.writeText(rib);
    setCopiedRib(rib);
    setTimeout(() => setCopiedRib(null), 2500);
  };

  // Forecast Calculations (Next 30, 60, 90 Days)
  const incoming30Days = invoices
    .filter((i) => i.status !== 'paid' && i.status !== 'cancelled')
    .reduce((acc, i) => acc + i.balanceDue, 0);

  const outgoing30Days =
    expenses
      .filter((e) => e.status !== 'paid' && e.status !== 'rejected')
      .reduce((acc, e) => acc + e.totalTTC, 0) +
    purchaseOrders
      .filter((po) => po.status === 'sent')
      .reduce((acc, po) => acc + po.totalTTC, 0);

  const projectedCash30Days = totalBankBalances + incoming30Days - outgoing30Days;
  const projectedCash60Days = projectedCash30Days + incoming30Days * 0.8 - outgoing30Days * 0.9;
  const projectedCash90Days = projectedCash60Days + incoming30Days * 0.7 - outgoing30Days * 0.85;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            {language === 'ar' ? 'الخزينة والسيولة المالية' : 'Treasury, Liquidity & Moroccan Banks'}
          </span>
          <h1 className="font-serif italic text-2xl sm:text-3xl text-white font-normal mt-0.5">
            {language === 'ar' ? 'إدارة الحسابات البنكية وتوقعات السيولة' : 'Comptes Bancaires & Prévisionnel de Trésorerie'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-mono">
            {language === 'ar'
              ? 'تتبع أرصدة الحسابات المغربية (Attijari, BCP, BMCE, CIH)، أرقام RIB الرسمية، وتوقعات التدفق النقدي'
              : 'Gérez vos comptes bancaires au Maroc, copiez les RIB officiels 24 chiffres et simulez vos flux de trésorerie prévisionnels.'}
          </p>
        </div>

        <div className="px-4 py-2.5 rounded bg-[#0C0C0C] border border-white/10 text-xs font-mono shrink-0">
          <span className="text-zinc-500 mr-2 uppercase tracking-wider text-[10px]">
            {language === 'ar' ? 'إجمالي السيولة المتاحة:' : 'Trésorerie Globale :'}
          </span>
          <span className="text-base font-bold text-emerald-400">
            {formatMAD(totalBankBalances, language)}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setTab('accounts')}
          className={`px-4 py-2 rounded text-xs font-mono transition-colors flex items-center gap-2 ${
            tab === 'accounts'
              ? 'bg-white text-black font-bold'
              : 'text-zinc-400 hover:text-white bg-[#0C0C0C]'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'الحسابات البنكية و RIB' : 'Comptes Bancaires & RIBs'}</span>
        </button>

        <button
          onClick={() => setTab('forecast')}
          className={`px-4 py-2 rounded text-xs font-mono transition-colors flex items-center gap-2 ${
            tab === 'forecast'
              ? 'bg-white text-black font-bold'
              : 'text-zinc-400 hover:text-white bg-[#0C0C0C]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'توقعات التدفق النقدي (Cash Flow)' : 'Prévisionnel de Trésorerie (30/60/90j)'}</span>
        </button>
      </div>

      {tab === 'accounts' ? (
        <>
          {/* Moroccan Bank Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {bankAccounts.map((account) => (
              <div
                key={account.id}
                className="p-5 rounded-lg bg-[#0C0C0C] border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded bg-white/5 border border-white/10 text-white flex items-center justify-center font-bold">
                        <Landmark className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white text-xs">{account.bankName}</h3>
                        <p className="text-[11px] text-zinc-500 font-mono">{account.accountName}</p>
                      </div>
                    </div>

                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-white/5 border border-white/10 text-zinc-400">
                      {account.currency}
                    </span>
                  </div>

                  <div className="mt-5 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      {language === 'ar' ? 'الرصيد الفعلي المتاح' : 'Solde Actuel Disponible'}
                    </span>
                    <p className="text-2xl font-mono font-bold text-white">
                      {formatMAD(account.currentBalance, language)}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-[9px] uppercase font-mono tracking-wider text-zinc-500 mb-1">
                      <span>{language === 'ar' ? 'رقم الحساب RIB المغربي (24 رقماً)' : 'RIB Maroc (24 chiffres)'}</span>
                      <button
                        onClick={() => handleCopyRib(account.rib)}
                        className="text-zinc-400 hover:text-white flex items-center gap-1 normal-case text-[10px]"
                      >
                        {copiedRib === account.rib ? (
                          <span className="text-emerald-400 flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Copié
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5">
                            <Copy className="w-3 h-3" /> Copier
                          </span>
                        )}
                      </button>
                    </div>
                    <p className="font-mono text-xs text-zinc-300 select-all tracking-wider bg-[#080808] p-1.5 rounded border border-white/5">
                      {account.rib}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-2 text-[10px] font-mono text-zinc-500 flex items-center justify-between border-t border-white/5">
                  <span>{language === 'ar' ? 'المطابقة البنكية' : 'Rapprochement bancaire'}</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> {language === 'ar' ? 'محين' : 'À jour'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Bank Inflows & Outflows Feed */}
          <div className="bg-[#0C0C0C] rounded-lg border border-white/10 p-6">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
              {language === 'ar' ? 'سجل العمليات الأخير' : 'Cash Flow Logs'}
            </span>
            <h3 className="font-serif italic text-white text-lg mt-0.5 mb-4">
              {language === 'ar' ? 'آخر التحويلات والعمليات المسجلة' : 'Derniers Mouvements de Trésorerie'}
            </h3>

            <div className="divide-y divide-white/5 text-xs font-mono">
              {payments.slice(0, 5).map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-sans font-medium text-white">
                        Encaissement Client - {p.customerName}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        {p.paymentMethod} • Réf: {p.paymentNumber} • {formatDate(p.date, language)}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-400 text-xs">
                    +{formatMAD(p.amount, language)}
                  </span>
                </div>
              ))}

              {expenses.slice(0, 3).map((e) => (
                <div key={e.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-sans font-medium text-white">
                        Dépense : {e.title}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        {e.supplierName} • {e.category} • {formatDate(e.date, language)}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-rose-400 text-xs">
                    -{formatMAD(e.totalTTC, language)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Cash Flow Forecast 30/60/90 Days */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-lg bg-[#0C0C0C] border border-white/10">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                {language === 'ar' ? 'السيولة المتوقعة بعد 30 يوماً' : 'Trésorerie Prévue à 30 jours'}
              </span>
              <div className="font-mono text-2xl font-bold text-emerald-400 mt-2">
                {formatMAD(projectedCash30Days, language)}
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                + {formatMAD(incoming30Days, language)} entrées prévues
              </span>
            </div>

            <div className="p-5 rounded-lg bg-[#0C0C0C] border border-white/10">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                {language === 'ar' ? 'السيولة المتوقعة بعد 60 يوماً' : 'Trésorerie Prévue à 60 jours'}
              </span>
              <div className="font-mono text-2xl font-bold text-white mt-2">
                {formatMAD(projectedCash60Days, language)}
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                Basé sur le cycle moyen d'encaissement
              </span>
            </div>

            <div className="p-5 rounded-lg bg-[#0C0C0C] border border-white/10">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                {language === 'ar' ? 'السيولة المتوقعة بعد 90 يوماً' : 'Trésorerie Prévue à 90 jours'}
              </span>
              <div className="font-mono text-2xl font-bold text-white mt-2">
                {formatMAD(projectedCash90Days, language)}
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                Runway sécurisé sans tension
              </span>
            </div>
          </div>

          <div className="bg-[#0C0C0C] rounded-lg border border-white/10 p-6 max-w-3xl space-y-4">
            <h3 className="font-serif italic text-white text-base">
              {language === 'ar' ? 'تفاصيل التدفقات الداخلة والخارجة المتوقعة' : 'Détail des Flux Entrants et Sortants Prévus'}
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between p-3 rounded bg-[#080808] border border-white/5 text-zinc-300">
                <span>(+) Factures clients en attente de règlement :</span>
                <span className="text-emerald-400 font-bold">+{formatMAD(incoming30Days, language)}</span>
              </div>

              <div className="flex justify-between p-3 rounded bg-[#080808] border border-white/5 text-zinc-300">
                <span>(-) Dépenses récurrentes & Bons de commande fournisseurs :</span>
                <span className="text-rose-400 font-bold">-{formatMAD(outgoing30Days, language)}</span>
              </div>

              <div className="flex justify-between p-3 rounded bg-white/5 border border-white/20 text-white font-bold">
                <span>(=) Solde Net Prévu :</span>
                <span className="text-emerald-400">{formatMAD(projectedCash30Days, language)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
