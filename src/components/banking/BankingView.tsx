import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { formatMAD, formatDate } from '../../utils/formatters';

export const BankingView: React.FC = () => {
  const { bankAccounts, payments, expenses, language, t } = useApp();

  const totalBankBalances = bankAccounts.reduce((acc, b) => acc + b.currentBalanceMAD, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            Treasury & Liquidity
          </span>
          <h2 className="text-2xl lg:text-3xl font-serif italic text-white leading-tight mt-0.5">
            {t.bankAccounts}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {language === 'ar'
              ? 'إدارة الحسابات البنكية المغربية (التجاري وفابنك، البنك الشعبي، CIH...) وسجل المعاملات والسيولة'
              : 'Comptes bancaires marocains, RIB officiels, trésorerie et rapprochement des flux financiers.'}
          </p>
        </div>

        <div className="px-4 py-2.5 rounded bg-[#0C0C0C] border border-white/10 text-xs font-mono">
          <span className="text-zinc-500 mr-2 uppercase tracking-wider text-[10px]">{language === 'ar' ? 'إجمالي السيولة:' : 'Trésorerie Globale :'}</span>
          <span className="text-base font-bold text-emerald-400">
            {formatMAD(totalBankBalances, language)}
          </span>
        </div>
      </div>

      {/* Moroccan Bank Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {bankAccounts.map((account) => (
          <div
            key={account.id}
            className="p-5 rounded-lg bg-[#0C0C0C] border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-white/5 border border-white/10 text-white flex items-center justify-center font-bold">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-xs">
                      {account.bankName}
                    </h3>
                    <p className="text-[11px] text-zinc-500 font-mono">{account.accountName}</p>
                  </div>
                </div>

                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-white/5 border border-white/10 text-zinc-400">
                  {account.currency}
                </span>
              </div>

              <div className="mt-5 space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  Solde Actuel Disponible
                </span>
                <p className="text-2xl font-mono font-bold text-white">
                  {formatMAD(account.currentBalanceMAD, language)}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10">
                <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-500">RIB Maroc (24 chiffres)</span>
                <p className="font-mono text-xs text-zinc-300 mt-0.5 select-all">
                  {account.rib}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-2 text-[10px] font-mono text-zinc-500 flex items-center justify-between border-t border-white/5">
              <span>Rapprochement bancaire</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> À jour
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bank Inflows & Outflows Feed */}
      <div className="bg-[#0C0C0C] rounded-lg border border-white/10 p-6">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
          Cash Flow Logs
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
                    {p.paymentMethod} • Réf: {p.paymentNumber} • {formatDate(p.paymentDate, language)}
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
                    Dépense : {e.description}
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    {e.supplierName} • {e.category} • {formatDate(e.date, language)}
                  </p>
                </div>
              </div>
              <span className="font-bold text-rose-400 text-xs">
                -{formatMAD(e.amountTTC, language)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
