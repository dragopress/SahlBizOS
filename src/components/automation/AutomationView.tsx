import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  Plus,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Mail,
  MessageSquare,
  CheckSquare,
  Bell,
  Power,
  RefreshCw,
} from 'lucide-react';
import { AutomationRule, AutomationTrigger, AutomationAction } from '../../types';
import { formatDate } from '../../utils/formatters';

export const AutomationView: React.FC = () => {
  const { automations, toggleAutomation, setActiveModal, language, t } = useApp();

  const [testingRuleId, setTestingRuleId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const getTriggerLabel = (trigger: AutomationTrigger) => {
    switch (trigger) {
      case 'invoice_overdue':
        return language === 'ar' ? 'عند تأخر سداد فاتورة' : 'Quand une facture devient échue (> 15j)';
      case 'quote_accepted':
        return language === 'ar' ? 'عند قبول عرض سعر' : 'Quand un devis est validé/accepté';
      case 'stock_low':
        return language === 'ar' ? 'عند وصول المخزون للحد الأدنى' : 'Quand le stock passe sous le seuil d’alerte';
      case 'payment_received':
        return language === 'ar' ? 'عند تسجيل دفعة جديدة' : 'Quand un encaissement est enregistré';
      case 'task_overdue':
        return language === 'ar' ? 'عند تأخر مهمة عمل' : 'Quand une tâche dépasse son échéance';
      default:
        return trigger;
    }
  };

  const getActionIcon = (action: AutomationAction) => {
    switch (action) {
      case 'send_email_reminder':
        return <Mail className="w-3.5 h-3.5 text-blue-400" />;
      case 'send_whatsapp_template':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />;
      case 'create_followup_task':
        return <CheckSquare className="w-3.5 h-3.5 text-amber-400" />;
      case 'notify_manager':
        return <Bell className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Zap className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  const handleTestRun = (rule: AutomationRule) => {
    setTestingRuleId(rule.id);
    setTimeout(() => {
      setTestingRuleId(null);
      setSuccessToast(
        language === 'ar'
          ? `تم تنفيذ قاعدة الأتمتة «${rule.name}» بنجاح!`
          : `Règle d'automatisation « ${rule.name} » exécutée avec succès !`
      );
      setTimeout(() => setSuccessToast(null), 3500);
    }, 800);
  };

  const activeCount = automations.filter((a) => a.active).length;
  const totalExecutions = automations.reduce((sum, a) => sum + a.executionCount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast */}
      {successToast && (
        <div className="fixed top-5 right-5 rtl:right-auto rtl:left-5 z-50 p-4 rounded bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            {language === 'ar' ? 'أتمتة الأعمال والعمليات' : 'Workflow Automation & Smart Triggers'}
          </span>
          <h1 className="font-serif italic text-2xl sm:text-3xl text-white font-normal mt-0.5">
            {language === 'ar' ? 'محرك الأتمتة وسير العمل الذكي' : 'Moteur d’Automatisation des Tâches'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-mono">
            {language === 'ar'
              ? 'أتمتة التذكير بالفواتير عبر البريد وواتساب، تنبيهات المخزون المنخفض، وإسناد المهام التلقائي'
              : 'Automatisez vos relances clients, alertes de réapprovisionnement et notifications selon la logique DÉCLENCHEUR → CONDITION → ACTION.'}
          </p>
        </div>

        <button
          onClick={() => setActiveModal('new_automation_rule')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? '+ قاعدة أتمتة جديدة' : '+ Nouvelle Règle'}</span>
        </button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
            {language === 'ar' ? 'القواعد النشطة' : 'Règles Actives'}
          </span>
          <div className="font-mono text-xl sm:text-2xl font-bold text-emerald-400 mt-1">
            {activeCount} / {automations.length}
          </div>
          <span className="text-[10px] text-zinc-500 font-mono mt-1">
            {language === 'ar' ? 'تعمل في الخلفية 24/7' : 'Surveillance temps réel 24/7'}
          </span>
        </div>

        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
            {language === 'ar' ? 'إجمالي مرات التنفيذ' : 'Exécutions Automatiques'}
          </span>
          <div className="font-mono text-xl sm:text-2xl font-bold text-white mt-1">
            {totalExecutions}
          </div>
          <span className="text-[10px] text-zinc-500 font-mono mt-1">
            {language === 'ar' ? 'وفرت ساعات من العمل اليدوي' : 'Temps administratif économisé'}
          </span>
        </div>

        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
            {language === 'ar' ? 'الموصلات المتاحة' : 'Connecteurs Opérationnels'}
          </span>
          <div className="font-mono text-xl sm:text-2xl font-bold text-purple-400 mt-1">
            4 / 4
          </div>
          <span className="text-[10px] text-zinc-500 font-mono mt-1">
            Email, WhatsApp Business, Tâches OS, Alertes
          </span>
        </div>
      </div>

      {/* Rules list */}
      <div className="space-y-3">
        {automations.map((rule) => (
          <div
            key={rule.id}
            className={`p-5 rounded-lg bg-[#0C0C0C] border transition-all ${
              rule.active ? 'border-white/15' : 'border-white/5 opacity-60'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-1.5 rounded ${
                      rule.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-zinc-500'
                    }`}
                  >
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h3 className="font-sans font-medium text-white text-sm">{rule.name}</h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                      rule.active
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/10 text-zinc-400 border border-white/10'
                    }`}
                  >
                    {rule.active ? (language === 'ar' ? 'نشطة' : 'Active') : language === 'ar' ? 'معطلة' : 'Désactivée'}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 font-sans">{rule.description}</p>

                {/* Visual Logic Flow */}
                <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
                  <div className="px-2.5 py-1 rounded bg-[#080808] border border-white/10 text-zinc-300 flex items-center gap-1.5">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">WHEN:</span>
                    <span>{getTriggerLabel(rule.trigger)}</span>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-zinc-600 rtl:rotate-180" />

                  <div className="px-2.5 py-1 rounded bg-[#080808] border border-white/10 text-zinc-300 flex items-center gap-1.5">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">IF:</span>
                    <span>
                      {rule.conditionField} {rule.conditionOperator === 'greater_than' ? '>' : '='}{' '}
                      {rule.conditionValue}
                    </span>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-zinc-600 rtl:rotate-180" />

                  <div className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white flex items-center gap-1.5">
                    <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold">THEN:</span>
                    {getActionIcon(rule.action)}
                    <span className="font-bold">{rule.action.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Actions & Toggle */}
              <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5 font-mono text-xs">
                <button
                  onClick={() => handleTestRun(rule)}
                  disabled={testingRuleId === rule.id}
                  className="px-3 py-1.5 rounded bg-[#080808] hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
                  title="Tester l'exécution"
                >
                  <Play className={`w-3 h-3 ${testingRuleId === rule.id ? 'animate-spin' : ''}`} />
                  <span>{language === 'ar' ? 'اختبار' : 'Tester'}</span>
                </button>

                <button
                  onClick={() => toggleAutomation(rule.id)}
                  className={`px-3 py-1.5 rounded border transition-colors flex items-center gap-1.5 ${
                    rule.active
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Power className="w-3 h-3" />
                  <span>{rule.active ? (language === 'ar' ? 'إيقاف' : 'Désactiver') : language === 'ar' ? 'تفعيل' : 'Activer'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
