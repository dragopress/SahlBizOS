import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  FileCheck2,
  Receipt,
  Landmark,
  Target,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Plus,
  Clock,
  ChevronRight,
  Calendar,
  Layers,
  Zap,
} from 'lucide-react';
import { formatMAD, formatDate, formatPercent } from '../../utils/formatters';

export const DashboardView: React.FC = () => {
  const {
    invoices,
    quotes,
    expenses,
    bankAccounts,
    opportunities,
    products,
    tasks,
    projects,
    auditLogs,
    setCurrentView,
    setActiveModal,
    language,
    t,
    currentOrg,
  } = useApp();

  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');

  // Financial calculations
  const totalInvoicedTTC = invoices.reduce(
    (acc, inv) => acc + (inv.status !== 'cancelled' ? inv.totalTTC : 0),
    0
  );
  const totalPaidTTC = invoices.reduce((acc, inv) => acc + inv.amountPaid, 0);
  const unpaidInvoices = invoices.filter((inv) => inv.balanceDue > 0);
  const totalUnpaidTTC = unpaidInvoices.reduce((acc, inv) => acc + inv.balanceDue, 0);
  const overdueInvoices = invoices.filter((inv) => inv.status === 'overdue');
  const totalOverdueTTC = overdueInvoices.reduce((acc, inv) => acc + inv.balanceDue, 0);

  const totalExpensesTTC = expenses.reduce((acc, exp) => acc + exp.totalTTC, 0);
  const totalCashMAD = bankAccounts.reduce((acc, ba) => acc + ba.currentBalance, 0);

  // Conversion rate: accepted + converted quotes / total quotes
  const acceptedQuotesCount = quotes.filter((q) => q.status === 'accepted' || q.status === 'converted').length;
  const quoteConversionRate = quotes.length > 0 ? (acceptedQuotesCount / quotes.length) * 100 : 0;

  // Pipeline active sum
  const activePipelineMAD = opportunities
    .filter((o) => o.stage !== 'lost')
    .reduce((acc, o) => acc + o.expectedRevenueMAD, 0);

  // Low stock alert items
  const lowStockProducts = products.filter(
    (p) => p.type === 'product' && p.currentStock <= p.minStockAlert
  );

  // Overdue & urgent tasks
  const urgentTasks = tasks.filter(
    (t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'done'
  );

  // Monthly breakdown for visual charts
  const monthlyRevenueData = [
    { month: 'Mars', revenue: 95000, expenses: 42000 },
    { month: 'Avril', revenue: 112000, expenses: 48000 },
    { month: 'Mai', revenue: 128000, expenses: 51000 },
    { month: 'Juin', revenue: 135000, expenses: 49000 },
    { month: 'Juillet', revenue: 142000, expenses: 53000 },
    { month: 'Août (En cours)', revenue: totalInvoicedTTC || 124850, expenses: totalExpensesTTC || 46280 },
  ];

  const maxChartVal = Math.max(...monthlyRevenueData.map((d) => Math.max(d.revenue, d.expenses))) * 1.15;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-lg bg-[#0C0C0C] border border-white/10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
              Protocol Dashboard
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
          </div>
          <h2 className="text-2xl lg:text-3xl font-serif italic text-white leading-tight">
            {language === 'ar' ? 'لوحة قيادة المقاولة' : `Executive Command — ${currentOrg.name}`}
          </h2>
          <p className="text-xs text-zinc-400 max-w-xl mt-1 leading-relaxed">
            {language === 'ar'
              ? 'إليك النظرة الشاملة واللحظية على نشاطك التجاري، الخزينة، الفواتير والعمليات اليومية بالمغرب.'
              : 'Système unifié de pilotage commercial, trésorerie multi-comptes, factures conformes DGI et opérations MAD.'}
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <div className="inline-flex rounded bg-[#080808] p-1 border border-white/10 text-xs font-mono">
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 rounded transition-all text-xs font-bold uppercase tracking-wider ${
                timeRange === 'month' ? 'bg-white text-black shadow-xs' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {language === 'ar' ? 'هذا الشهر' : 'Ce Mois'}
            </button>
            <button
              onClick={() => setTimeRange('quarter')}
              className={`px-3 py-1.5 rounded transition-all text-xs font-bold uppercase tracking-wider ${
                timeRange === 'quarter' ? 'bg-white text-black shadow-xs' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {language === 'ar' ? 'هذا الربع' : 'Ce Trimestre'}
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1.5 rounded transition-all text-xs font-bold uppercase tracking-wider ${
                timeRange === 'year' ? 'bg-white text-black shadow-xs' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {language === 'ar' ? 'هذه السنة' : 'Cette Année'}
            </button>
          </div>
        </div>
      </div>

      {/* AI Smart Executive Summary Banner */}
      <div className="p-5 rounded-lg bg-[#0C0C0C] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded bg-white/10 text-white border border-white/15 shrink-0">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">
                Intelligence Synthesis
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                LIVE GEMINI 3.7
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              {language === 'ar'
                ? `رقم المعاملات في تصاعد مستمر (+14%). لديك ${overdueInvoices.length} فواتير متأخرة بقيمة ${formatMAD(totalOverdueTTC, language)}. نوصي بإرسال تذكير فوري للزبائن وتأكيد استلام الدفعات.`
                : `Croissance soutenue du Chiffre d’Affaires (+14%). Vous avez ${overdueInvoices.length} facture(s) en retard totalisant ${formatMAD(totalOverdueTTC, language)}. Priorité : Relance recouvrement client.`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setCurrentView('ai_assistant')}
          className="px-4 py-2 bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-zinc-200 transition-colors shadow-sm shrink-0 flex items-center gap-1.5"
        >
          <span>{language === 'ar' ? 'استشر المساعد الذكي' : 'Consulter l’IA'}</span>
          <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
        </button>
      </div>

      {/* ================= 6 CORE CLICKABLE KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* KPI 1: Revenue */}
        <div
          onClick={() => setCurrentView('invoices')}
          className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 hover:border-white/25 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 truncate">
              {t.monthlyRevenue}
            </span>
            <div className="p-1.5 rounded bg-white/5 text-zinc-300 group-hover:text-emerald-400 transition-colors">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-mono font-bold text-white tracking-tight">
            {formatMAD(totalInvoicedTTC, language)}
          </p>
          <div className="flex items-center gap-1 mt-2 text-[11px] font-mono font-medium text-emerald-400">
            <ArrowUpRight className="w-3 h-3" />
            <span>+12.4% vs M-1</span>
          </div>
        </div>

        {/* KPI 2: Unpaid Receivables */}
        <div
          onClick={() => setCurrentView('invoices')}
          className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 hover:border-white/25 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 truncate">
              {t.unpaidInvoices}
            </span>
            <div className="p-1.5 rounded bg-white/5 text-amber-400">
              <FileCheck2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-mono font-bold text-amber-400 tracking-tight">
            {formatMAD(totalUnpaidTTC, language)}
          </p>
          <p className="text-[10px] font-mono text-zinc-500 mt-2">
            {unpaidInvoices.length} {language === 'ar' ? 'فواتير غير مسددة' : 'factures en attente'}
          </p>
        </div>

        {/* KPI 3: Available Cash */}
        <div
          onClick={() => setCurrentView('bank_accounts')}
          className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 hover:border-white/25 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 truncate">
              {t.availableCash}
            </span>
            <div className="p-1.5 rounded bg-white/5 text-zinc-300 group-hover:text-white">
              <Landmark className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-mono font-bold text-white tracking-tight">
            {formatMAD(totalCashMAD, language)}
          </p>
          <p className="text-[10px] font-mono text-zinc-500 mt-2">
            {bankAccounts.length} {language === 'ar' ? 'حسابات بنكية' : 'comptes bancaires'}
          </p>
        </div>

        {/* KPI 4: Monthly Expenses */}
        <div
          onClick={() => setCurrentView('expenses')}
          className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 hover:border-white/25 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 truncate">
              {t.monthlyExpenses}
            </span>
            <div className="p-1.5 rounded bg-white/5 text-rose-400">
              <Receipt className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-mono font-bold text-rose-400 tracking-tight">
            {formatMAD(totalExpensesTTC, language)}
          </p>
          <div className="flex items-center gap-1 mt-2 text-[10px] font-mono text-zinc-500">
            <span>{expenses.length} {language === 'ar' ? 'مصروف مقيد' : 'dépenses'}</span>
          </div>
        </div>

        {/* KPI 5: Pipeline Deals */}
        <div
          onClick={() => setCurrentView('leads')}
          className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 hover:border-white/25 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 truncate">
              {t.pipelineValue}
            </span>
            <div className="p-1.5 rounded bg-white/5 text-purple-400">
              <Target className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-mono font-bold text-purple-400 tracking-tight">
            {formatMAD(activePipelineMAD, language)}
          </p>
          <p className="text-[10px] font-mono text-zinc-500 mt-2">
            {opportunities.length} {language === 'ar' ? 'صفقات محتملة' : 'opportunités actives'}
          </p>
        </div>

        {/* KPI 6: Quotes Conversion */}
        <div
          onClick={() => setCurrentView('quotes')}
          className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 hover:border-white/25 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 truncate">
              {t.conversionRate}
            </span>
            <div className="p-1.5 rounded bg-white/5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-mono font-bold text-emerald-400 tracking-tight">
            {formatPercent(quoteConversionRate)}
          </p>
          <p className="text-[10px] font-mono text-zinc-500 mt-2">
            {acceptedQuotesCount} / {quotes.length} {language === 'ar' ? 'عرض مقبول' : 'devis validés'}
          </p>
        </div>
      </div>

      {/* ================= TWO-COLUMN MAIN ANALYTICS SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Revenue vs Expenses Trend & Funnel (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue vs Expenses Multi-month Chart */}
          <div className="p-6 rounded-lg bg-[#0C0C0C] border border-white/10">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                  Financial Analytics
                </span>
                <h3 className="font-serif italic text-white text-lg mt-0.5">
                  {language === 'ar' ? 'مقارنة المبيعات والمصاريف (MAD)' : 'Évolution Chiffre d’Affaires vs Dépenses'}
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-white" />
                  <span className="text-zinc-300">CA Facturé</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                  <span className="text-zinc-300">Dépenses</span>
                </div>
              </div>
            </div>

            {/* Custom Bar Chart Visualizer */}
            <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-white/5 bg-[#080808]/50 rounded-sm">
              {monthlyRevenueData.map((d, i) => {
                const revHeight = (d.revenue / maxChartVal) * 100;
                const expHeight = (d.expenses / maxChartVal) * 100;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      {/* Revenue Bar */}
                      <div
                        style={{ height: `${revHeight}%` }}
                        className="w-5 sm:w-7 bg-white hover:bg-zinc-200 transition-all duration-300 relative group/bar"
                      >
                        <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white text-[10px] font-mono py-1 px-2 rounded whitespace-nowrap z-20 pointer-events-none transition-opacity">
                          {formatMAD(d.revenue, language)}
                        </div>
                      </div>
                      {/* Expenses Bar */}
                      <div
                        style={{ height: `${expHeight}%` }}
                        className="w-5 sm:w-7 bg-rose-500/80 hover:bg-rose-400 transition-all duration-300 relative group/bar2"
                      >
                        <div className="opacity-0 group-hover/bar2:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white text-[10px] font-mono py-1 px-2 rounded whitespace-nowrap z-20 pointer-events-none transition-opacity">
                          {formatMAD(d.expenses, language)}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 truncate">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sales Pipeline Funnel Overview */}
          <div className="p-6 rounded-lg bg-[#0C0C0C] border border-white/10">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                  Deal Flow
                </span>
                <h3 className="font-serif italic text-white text-lg mt-0.5">
                  {language === 'ar' ? 'مراحل خط المبيعات والصفقات' : 'Pipeline Commercial & Taux de Conversion'}
                </h3>
              </div>
              <button
                onClick={() => setCurrentView('leads')}
                className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>{t.viewAll}</span>
                <ChevronRight className="w-3 h-3 rtl:rotate-180" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { stage: 'lead', label: 'Lead / Prospect', color: 'bg-zinc-500', count: 1 },
                { stage: 'qualified', label: 'Qualifié', color: 'bg-blue-400', count: 1 },
                { stage: 'proposal', label: 'Proposition', color: 'bg-amber-400', count: 1 },
                { stage: 'negotiation', label: 'Négociation', color: 'bg-purple-400', count: 1 },
                { stage: 'won', label: 'Gagné (Won)', color: 'bg-emerald-400', count: 1 },
              ].map((st, idx) => {
                const stageOpps = opportunities.filter((o) => o.stage === st.stage);
                const totalStageMAD = stageOpps.reduce((acc, o) => acc + o.expectedRevenueMAD, 0);

                return (
                  <div
                    key={idx}
                    onClick={() => setCurrentView('leads')}
                    className="p-3.5 rounded bg-[#080808] border border-white/10 hover:border-white/20 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${st.color}`} />
                      <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 truncate">{st.label}</p>
                    </div>
                    <p className="text-sm font-mono font-bold text-white">{formatMAD(totalStageMAD, language)}</p>
                    <p className="text-[9px] font-mono text-zinc-500 mt-1">{stageOpps.length} {language === 'ar' ? 'صفقة' : 'deal(s)'}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Urgent Alerts & Real-time Action Feeds (1 Col) */}
        <div className="space-y-6">
          {/* Urgent Overdue Invoices Alert Card */}
          <div className="p-6 rounded-lg bg-[#0C0C0C] border border-white/10">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                <h3 className="font-serif italic text-white text-base">
                  {language === 'ar' ? 'فواتير متأخرة تستوجب المتابعة' : 'Factures Échues'}
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                {overdueInvoices.length}
              </span>
            </div>

            {overdueInvoices.length === 0 ? (
              <div className="py-6 text-center text-zinc-500 font-mono text-xs">
                <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-500 mb-2 opacity-80" />
                <p>{language === 'ar' ? 'ممتاز! لا توجد أي فواتير متأخرة' : 'Aucune facture en retard.'}</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {overdueInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => {
                      setCurrentView('invoices');
                      setActiveModal('invoice_print', inv);
                    }}
                    className="p-3 rounded bg-[#080808] border border-rose-500/20 hover:border-rose-500/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-white">{inv.invoiceNumber}</span>
                      <span className="font-mono font-bold text-xs text-rose-400">
                        {formatMAD(inv.balanceDue, language)}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 truncate">{inv.customerName}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[9px] font-mono text-zinc-500">
                      <span>Échéance: {inv.dueDate}</span>
                      <span className="text-rose-400 font-bold uppercase tracking-wider">{language === 'ar' ? 'تذكير بالدفع' : 'Relancer'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Stock Reorder Warning */}
          {lowStockProducts.length > 0 && (
            <div className="p-6 rounded-lg bg-[#0C0C0C] border border-white/10">
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                  <h3 className="font-serif italic text-white text-base">
                    {language === 'ar' ? 'تنبيه مخزون منخفض' : 'Alerte Stocks'}
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/30">
                  {lowStockProducts.length}
                </span>
              </div>

              <div className="space-y-2">
                {lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setCurrentView('inventory')}
                    className="p-2.5 rounded bg-[#080808] border border-amber-400/20 flex items-center justify-between cursor-pointer hover:border-amber-400/40 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-xs text-white">{p.name}</p>
                      <p className="text-[10px] font-mono text-zinc-500">{p.warehouseName || 'Dépôt Casablanca'}</p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-xs font-bold text-amber-400">
                        {p.currentStock} {p.unit}
                      </span>
                      <p className="text-[9px] text-zinc-500">Min: {p.minStockAlert}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chronological Real-time Activity Timeline */}
          <div className="p-6 rounded-lg bg-[#0C0C0C] border border-white/10">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
              System Audit
            </span>
            <h3 className="font-serif italic text-white text-base mb-3 mt-0.5">
              {language === 'ar' ? 'سجل الأنشطة الحديثة' : 'Journal des Activités'}
            </h3>
            <div className="space-y-3">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white truncate">
                      {log.action} - <span className="font-normal text-zinc-400">{log.entityName}</span>
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate">{log.details}</p>
                    <span className="text-[9px] font-mono text-zinc-600 flex items-center gap-1 mt-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {formatDate(log.timestamp, language)} • {log.userName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
