import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Calculator,
  ShieldCheck,
  Printer,
  Download,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Building2,
  Calendar,
} from 'lucide-react';
import { formatMAD } from '../../utils/formatters';

export const TaxReportView: React.FC = () => {
  const { invoices, expenses, payments, currentOrg, language, t } = useApp();

  const [period, setPeriod] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Year'>('Q2');

  // Calculate TVA Collectée (based on paid invoices)
  const totalTVACollectee = invoices
    .filter((inv) => inv.status !== 'cancelled')
    .reduce((acc, inv) => acc + inv.totalTVA, 0);

  // Calculate TVA Déductible
  const totalTVADeductible = expenses
    .filter((e) => e.isDeductible)
    .reduce((acc, e) => acc + e.tvaAmount, 0);

  const netTVADue = totalTVACollectee - totalTVADeductible;

  // Calculate Annual Turnover & IS Estimation
  const totalChiffreAffairesHT = invoices
    .filter((inv) => inv.status !== 'cancelled')
    .reduce((acc, inv) => acc + inv.subtotalHT, 0);

  const totalChargesHT = expenses.reduce((acc, exp) => acc + exp.amountHT, 0);
  const resultatFiscalEstime = Math.max(0, totalChiffreAffairesHT - totalChargesHT);

  // Moroccan Corporate Tax (IS) Tranches:
  // <= 300,000 MAD : 10%
  // 300,001 to 1,000,000 MAD : 20%
  // > 1,000,000 MAD : 35%
  let isEstime = 0;
  if (resultatFiscalEstime <= 300000) {
    isEstime = resultatFiscalEstime * 0.10;
  } else if (resultatFiscalEstime <= 1000000) {
    isEstime = 30000 + (resultatFiscalEstime - 300000) * 0.20;
  } else {
    isEstime = 30000 + 140000 + (resultatFiscalEstime - 1000000) * 0.35;
  }

  // Cotisation Minimale Maroc (0.5% du CA HT)
  const cotisationMinimale = totalChiffreAffairesHT * 0.005;
  const isFinalPayable = Math.max(isEstime, cotisationMinimale);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            Tax & Regulatory Compliance
          </span>
          <h2 className="text-2xl lg:text-3xl font-serif italic text-white leading-tight mt-0.5">
            {t.taxReport}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {language === 'ar'
              ? 'محاكي الإقرار الضريبي المغربي، الضريبة على القيمة المضافة (TVA)، والضريبة على الشركات (IS)'
              : 'Simulateur de déclaration fiscale marocaine (TVA DGI, Cotisation minimale & IS).'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="px-3 py-1.5 rounded bg-[#080808] border border-white/10 text-xs font-mono text-zinc-300 focus:outline-hidden"
          >
            <option value="Q1">1er Trimestre (Jan - Mar)</option>
            <option value="Q2">2ème Trimestre (Avr - Juin)</option>
            <option value="Q3">3ème Trimestre (Juil - Sept)</option>
            <option value="Q4">4ème Trimestre (Oct - Déc)</option>
            <option value="Year">Année Complète 2026</option>
          </select>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-white hover:bg-zinc-200 text-black text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer DGI</span>
          </button>
        </div>
      </div>

      {/* TVA Balance Highlight Banner */}
      <div className="p-6 rounded-lg bg-[#0C0C0C] border border-white/10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {period === 'Year' ? 'Bilan Fiscal Annuel 2026' : `Déclaration TVA Trimestrielle • ${period} 2026`}
          </span>
          <h3 className="text-2xl font-serif italic mt-2">
            {netTVADue > 0 ? 'TVA Nette à Verser à l’État' : 'Crédit de TVA à Reporter'}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-lg font-sans">
            Calcul conforme au Code Général des Impôts (CGI Maroc). Déclaration à télédéclarer sur la plateforme SIMPL-TVA de la DGI avant le 20 du mois suivant.
          </p>
        </div>

        <div className="p-4 rounded bg-[#080808] border border-white/10 text-right min-w-[220px]">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
            Solde Net TVA ({currentOrg.ice})
          </span>
          <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
            {formatMAD(Math.abs(netTVADue), language)}
          </p>
          <span className="text-[10px] font-mono text-zinc-400">
            {netTVADue > 0 ? 'À régler par télépaiement DGI' : 'Crédit reportable sur trimestre'}
          </span>
        </div>
      </div>

      {/* Grid of Calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: TVA Breakdown */}
        <div className="p-6 rounded-lg bg-[#0C0C0C] border border-white/10 space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <h4 className="font-sans font-medium text-white text-sm">
              1. Détail Taxe sur la Valeur Ajoutée (TVA)
            </h4>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded bg-[#080808] border border-white/10 flex items-center justify-between">
              <div>
                <p className="font-medium text-white">TVA Collectée sur Ventes</p>
                <p className="text-[10px] text-zinc-500 font-sans">Total factures clients émises</p>
              </div>
              <span className="font-bold text-xs text-white">
                +{formatMAD(totalTVACollectee, language)}
              </span>
            </div>

            <div className="p-3.5 rounded bg-[#080808] border border-white/10 flex items-center justify-between">
              <div>
                <p className="font-medium text-white">TVA Récupérable sur Charges</p>
                <p className="text-[10px] text-zinc-500 font-sans">Achats matériels, loyer, télécoms déductibles</p>
              </div>
              <span className="font-bold text-xs text-emerald-400">
                -{formatMAD(totalTVADeductible, language)}
              </span>
            </div>

            <div className="p-4 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <span className="font-medium text-white font-sans text-xs">
                TVA Due / Solde Net à reverser :
              </span>
              <span className="font-bold text-sm text-emerald-400 font-mono">
                {formatMAD(netTVADue, language)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: IS & Cotisation Minimale Estimation */}
        <div className="p-6 rounded-lg bg-[#0C0C0C] border border-white/10 space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <h4 className="font-sans font-medium text-white text-sm">
              2. Estimation Impôt sur les Sociétés (IS Maroc)
            </h4>
            <Calculator className="w-4 h-4 text-purple-400" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded bg-[#080808] border border-white/10 flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Chiffre d'Affaires Global HT</p>
                <p className="text-[10px] text-zinc-500 font-sans">Base pour la Cotisation Minimale</p>
              </div>
              <span className="font-bold text-xs text-white">
                {formatMAD(totalChiffreAffairesHT, language)}
              </span>
            </div>

            <div className="p-3.5 rounded bg-[#080808] border border-white/10 flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Résultat Fiscal Estimé</p>
                <p className="text-[10px] text-zinc-500 font-sans">CA HT - Total Charges Déductibles HT</p>
              </div>
              <span className="font-bold text-xs text-emerald-400">
                {formatMAD(resultatFiscalEstime, language)}
              </span>
            </div>

            <div className="p-3.5 rounded bg-[#080808] border border-white/10 flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Cotisation Minimale (0.5% du CA)</p>
                <p className="text-[10px] text-zinc-500 font-sans">Minimum légal non remboursable</p>
              </div>
              <span className="font-medium text-xs text-zinc-300">
                {formatMAD(cotisationMinimale, language)}
              </span>
            </div>

            <div className="p-4 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
              <span className="font-medium text-white font-sans text-xs">
                IS Prévisionnel Payable (Max IS / CM) :
              </span>
              <span className="font-bold text-sm text-purple-300 font-mono">
                {formatMAD(isFinalPayable, language)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
