import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  Printer,
  Calendar,
  DollarSign,
  PieChart,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Package,
  Clock,
  Filter,
} from 'lucide-react';
import { formatMAD, formatDate } from '../../utils/formatters';

export const ReportsView: React.FC = () => {
  const { invoices, quotes, expenses, payments, customers, products, projects, language, t } = useApp();

  const [activeTab, setActiveTab] = useState<'sales' | 'pnl' | 'aging' | 'custom'>('sales');
  const [dateRange, setDateRange] = useState<'month' | 'quarter' | 'year' | 'all'>('year');

  // Custom report builder state
  const [customDataset, setCustomDataset] = useState<'invoices' | 'expenses' | 'customers' | 'projects'>('invoices');
  const [customGroupBy, setCustomGroupBy] = useState<'month' | 'category' | 'customer' | 'status'>('month');

  // Financial Calculations
  const totalRevenueHT = invoices
    .filter((i) => i.status !== 'cancelled')
    .reduce((sum, i) => sum + i.subtotalHT, 0);

  const totalRevenueTTC = invoices
    .filter((i) => i.status !== 'cancelled')
    .reduce((sum, i) => sum + i.totalTTC, 0);

  const totalPaidRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalUnpaidReceivables = invoices
    .filter((i) => i.status !== 'paid' && i.status !== 'cancelled')
    .reduce((sum, i) => sum + i.balanceDue, 0);

  const totalExpensesHT = expenses.reduce((sum, e) => sum + e.amountHT, 0);
  const totalExpensesTTC = expenses.reduce((sum, e) => sum + e.totalTTC, 0);

  const grossProfitHT = totalRevenueHT - totalExpensesHT;
  const grossMarginPercent = totalRevenueHT > 0 ? (grossProfitHT / totalRevenueHT) * 100 : 0;

  // Quotes conversion stats
  const totalQuotesCount = quotes.length;
  const acceptedQuotesCount = quotes.filter((q) => q.status === 'accepted' || q.convertedToInvoiceId).length;
  const quoteConversionRate = totalQuotesCount > 0 ? (acceptedQuotesCount / totalQuotesCount) * 100 : 0;

  // Top Customers by revenue
  const customerRevenueMap: Record<string, { name: string; totalHT: number; count: number }> = {};
  invoices.forEach((inv) => {
    if (inv.status !== 'cancelled') {
      if (!customerRevenueMap[inv.customerId]) {
        customerRevenueMap[inv.customerId] = { name: inv.customerName, totalHT: 0, count: 0 };
      }
      customerRevenueMap[inv.customerId].totalHT += inv.subtotalHT;
      customerRevenueMap[inv.customerId].count += 1;
    }
  });

  const topCustomers = Object.values(customerRevenueMap)
    .sort((a, b) => b.totalHT - a.totalHT)
    .slice(0, 5);

  // Aging Analysis (Balance Âgée des Créances)
  const now = new Date().getTime();
  let agingCurrent = 0; // Not yet overdue or <= 30 days
  let aging30to60 = 0;
  let aging60to90 = 0;
  let agingOver90 = 0;

  invoices.forEach((inv) => {
    if (inv.status !== 'paid' && inv.status !== 'cancelled' && inv.balanceDue > 0) {
      const dueTime = new Date(inv.dueDate).getTime();
      const diffDays = Math.floor((now - dueTime) / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        agingCurrent += inv.balanceDue;
      } else if (diffDays <= 30) {
        agingCurrent += inv.balanceDue;
      } else if (diffDays <= 60) {
        aging30to60 += inv.balanceDue;
      } else if (diffDays <= 90) {
        aging60to90 += inv.balanceDue;
      } else {
        agingOver90 += inv.balanceDue;
      }
    }
  });

  // Export helper
  const handleExportCSV = () => {
    let rows: string[][] = [];
    let headers: string[] = [];

    if (activeTab === 'sales') {
      headers = ['Numero', 'Client', 'Date', 'Total_HT_MAD', 'Total_TTC_MAD', 'Statut'];
      rows = invoices.map((i) => [
        i.invoiceNumber,
        `"${i.customerName}"`,
        i.date,
        i.subtotalHT.toString(),
        i.totalTTC.toString(),
        i.status,
      ]);
    } else if (activeTab === 'pnl') {
      headers = ['Poste', 'Montant_MAD'];
      rows = [
        ['Chiffre d affaires HT', totalRevenueHT.toString()],
        ['Charges et Depenses HT', totalExpensesHT.toString()],
        ['Marge Brute HT', grossProfitHT.toString()],
        ['Marge en Pourcentage', grossMarginPercent.toFixed(1) + '%'],
      ];
    } else {
      headers = ['Tranche', 'Montant_MAD'];
      rows = [
        ['0 a 30 jours', agingCurrent.toString()],
        ['31 a 60 jours', aging30to60.toString()],
        ['61 a 90 jours', aging60to90.toString()],
        ['Plus de 90 jours', agingOver90.toString()],
      ];
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SahlBiz_Rapport_${activeTab}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            {language === 'ar' ? 'التحليلات والذكاء المالي' : 'Business Intelligence & Financial Analytics'}
          </span>
          <h1 className="font-serif italic text-2xl sm:text-3xl text-white font-normal mt-0.5">
            {language === 'ar' ? 'التقارير ولوحة القيادة التنفيذية' : 'Rapports & États Financiers'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-mono">
            {language === 'ar'
              ? 'تحليل المبيعات، هوامش الربح، تقادم الديون، وأداة إنشاء التقارير المخصصة'
              : 'Analysez votre rentabilité, la balance âgée de vos créances clients et générez des états décisionnels exportables.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-[#0C0C0C] hover:bg-white/10 border border-white/10 text-white font-mono text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تصدير CSV' : 'Exporter CSV'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'طباعة التقرير' : 'Imprimer'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('sales')}
          className={`px-4 py-2 rounded text-xs font-mono transition-colors ${
            activeTab === 'sales'
              ? 'bg-white text-black font-bold'
              : 'text-zinc-400 hover:text-white bg-[#0C0C0C]'
          }`}
        >
          {language === 'ar' ? '📊 تقرير المبيعات' : '📊 Ventes & Performance'}
        </button>
        <button
          onClick={() => setActiveTab('pnl')}
          className={`px-4 py-2 rounded text-xs font-mono transition-colors ${
            activeTab === 'pnl'
              ? 'bg-white text-black font-bold'
              : 'text-zinc-400 hover:text-white bg-[#0C0C0C]'
          }`}
        >
          {language === 'ar' ? '📈 حساب النتائج والهامش' : '📈 Compte de Résultat & Marge'}
        </button>
        <button
          onClick={() => setActiveTab('aging')}
          className={`px-4 py-2 rounded text-xs font-mono transition-colors ${
            activeTab === 'aging'
              ? 'bg-white text-black font-bold'
              : 'text-zinc-400 hover:text-white bg-[#0C0C0C]'
          }`}
        >
          {language === 'ar' ? '⏳ تقادم الديون (Balance Âgée)' : '⏳ Balance Âgée des Créances'}
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-4 py-2 rounded text-xs font-mono transition-colors ${
            activeTab === 'custom'
              ? 'bg-white text-black font-bold'
              : 'text-zinc-400 hover:text-white bg-[#0C0C0C]'
          }`}
        >
          {language === 'ar' ? '⚙️ منشئ التقارير المخصص' : '⚙️ Générateur de Rapport'}
        </button>
      </div>

      {/* TAB 1: SALES & REVENUE */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                {language === 'ar' ? 'رقم المعاملات الإجمالي HT' : 'CA Total HT'}
              </span>
              <div className="font-mono text-xl sm:text-2xl font-bold text-white mt-1">
                {formatMAD(totalRevenueHT, language)}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10">
              <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400">
                {language === 'ar' ? 'المداخيل المحصلة' : 'Encaissements Reçus'}
              </span>
              <div className="font-mono text-xl sm:text-2xl font-bold text-emerald-400 mt-1">
                {formatMAD(totalPaidRevenue, language)}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10">
              <span className="text-[10px] uppercase font-mono tracking-wider text-rose-400">
                {language === 'ar' ? 'مستحقات غير محصلة' : 'Créances à Recouvrer'}
              </span>
              <div className="font-mono text-xl sm:text-2xl font-bold text-rose-400 mt-1">
                {formatMAD(totalUnpaidReceivables, language)}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10">
              <span className="text-[10px] uppercase font-mono tracking-wider text-blue-400">
                {language === 'ar' ? 'نسبة تحويل العروض' : 'Taux Conversion Devis'}
              </span>
              <div className="font-mono text-xl sm:text-2xl font-bold text-blue-400 mt-1">
                {quoteConversionRate.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Top 5 Customers Table */}
          <div className="bg-[#0C0C0C] border border-white/10 rounded-lg p-5">
            <h3 className="font-serif italic text-white text-base mb-3">
              {language === 'ar' ? 'أفضل العملاء من حيث الإيرادات' : 'Top 5 Clients par Chiffre d’Affaires HT'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] uppercase text-zinc-400">
                    <th className="py-2.5 px-3">Client</th>
                    <th className="py-2.5 px-3 text-center">Factures</th>
                    <th className="py-2.5 px-3 text-right rtl:text-left">Total Facturé HT</th>
                    <th className="py-2.5 px-3 text-right rtl:text-left">% du CA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {topCustomers.map((cust, idx) => {
                    const share = totalRevenueHT > 0 ? (cust.totalHT / totalRevenueHT) * 100 : 0;
                    return (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3 font-sans font-medium text-white">{cust.name}</td>
                        <td className="py-3 px-3 text-center text-zinc-400">{cust.count}</td>
                        <td className="py-3 px-3 text-right rtl:text-left font-bold text-white">
                          {formatMAD(cust.totalHT, language)}
                        </td>
                        <td className="py-3 px-3 text-right rtl:text-left text-zinc-400">
                          {share.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: P&L AND PROFITABILITY */}
      {activeTab === 'pnl' && (
        <div className="space-y-6">
          <div className="bg-[#0C0C0C] border border-white/10 rounded-lg p-6 max-w-3xl">
            <h3 className="font-serif italic text-white text-lg mb-4">
              {language === 'ar' ? 'بيان الأرباح والخسائر التقديري' : 'Compte de Résultat Simplifié (MAD)'}
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between p-3 rounded bg-[#080808] border border-white/5 text-white">
                <span className="font-bold">(+) Chiffre d'Affaires Brut HT :</span>
                <span className="font-bold text-emerald-400">{formatMAD(totalRevenueHT, language)}</span>
              </div>

              <div className="flex justify-between p-3 rounded bg-[#080808] border border-white/5 text-zinc-300">
                <span>(-) Total Charges & Dépenses HT :</span>
                <span className="text-rose-400">{formatMAD(totalExpensesHT, language)}</span>
              </div>

              <div className="flex justify-between p-4 rounded bg-white/5 border border-white/20 text-white font-bold text-sm">
                <span>(=) Résultat Net d’Exploitation :</span>
                <span className={grossProfitHT >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {formatMAD(grossProfitHT, language)}
                </span>
              </div>

              <div className="flex justify-between px-3 py-2 text-zinc-400 text-[11px]">
                <span>Taux de Marge Opérationnelle :</span>
                <span className="font-bold text-white">{grossMarginPercent.toFixed(1)} %</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AGING (BALANCE ÂGÉE) */}
      {activeTab === 'aging' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10">
              <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400">
                0 à 30 jours (Normal)
              </span>
              <div className="font-mono text-xl sm:text-2xl font-bold text-white mt-1">
                {formatMAD(agingCurrent, language)}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10">
              <span className="text-[10px] uppercase font-mono tracking-wider text-blue-400">
                31 à 60 jours (À Relancer)
              </span>
              <div className="font-mono text-xl sm:text-2xl font-bold text-blue-400 mt-1">
                {formatMAD(aging30to60, language)}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400">
                61 à 90 jours (Alerte)
              </span>
              <div className="font-mono text-xl sm:text-2xl font-bold text-amber-400 mt-1">
                {formatMAD(aging60to90, language)}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10">
              <span className="text-[10px] uppercase font-mono tracking-wider text-rose-400">
                &gt; 90 jours (Contentieux)
              </span>
              <div className="font-mono text-xl sm:text-2xl font-bold text-rose-400 mt-1">
                {formatMAD(agingOver90, language)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOM REPORT BUILDER */}
      {activeTab === 'custom' && (
        <div className="bg-[#0C0C0C] border border-white/10 rounded-lg p-6 max-w-2xl space-y-4 font-mono text-xs">
          <h3 className="font-serif italic text-white text-base">
            {language === 'ar' ? 'إعداد استعلام تقرير مخصص' : 'Configurateur de Rapport Dynamique'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                {language === 'ar' ? 'مجموعة البيانات' : 'Jeu de Données'}
              </label>
              <select
                value={customDataset}
                onChange={(e) => setCustomDataset(e.target.value as any)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-white"
              >
                <option value="invoices">Factures de Ventes</option>
                <option value="expenses">Dépenses & Charges</option>
                <option value="customers">Répertoire Clients</option>
                <option value="projects">Projets & Chantiers</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                {language === 'ar' ? 'تجميع حسب' : 'Grouper Par'}
              </label>
              <select
                value={customGroupBy}
                onChange={(e) => setCustomGroupBy(e.target.value as any)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-white"
              >
                <option value="month">Période Mensuelle</option>
                <option value="category">Catégorie / Secteur</option>
                <option value="customer">Client / Partenaire</option>
                <option value="status">Statut de Traitement</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded bg-[#080808] border border-white/10 text-zinc-400 space-y-2">
            <p className="text-white font-medium">Résumé de la configuration :</p>
            <p>• Données sources : <span className="text-white">{customDataset}</span></p>
            <p>• Regroupement : <span className="text-white">{customGroupBy}</span></p>
            <p>• Période : Année fiscale 2026</p>
          </div>

          <button
            onClick={handleExportCSV}
            className="w-full py-2.5 rounded bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-wider transition-colors"
          >
            {language === 'ar' ? 'توليد وتنزيل التقرير (CSV)' : 'Générer & Télécharger le Rapport'}
          </button>
        </div>
      )}
    </div>
  );
};
