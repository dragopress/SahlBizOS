import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Cpu, Zap, ArrowRight, Check } from 'lucide-react';
import { AutomationTrigger, AutomationAction, AutomationRule } from '../../types';

interface AutomationRuleBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AutomationRuleBuilderModal: React.FC<AutomationRuleBuilderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentOrg, language } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [trigger, setTrigger] = useState<AutomationTrigger>('invoice_overdue');
  const [conditionField, setConditionField] = useState('amount_due');
  const [conditionOperator, setConditionOperator] = useState<'equals' | 'greater_than' | 'less_than' | 'contains'>('greater_than');
  const [conditionValue, setConditionValue] = useState('5000');
  const [action, setAction] = useState<AutomationAction>('send_email_reminder');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Simulation of rule registration
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#0C0C0C] border border-white/10 rounded-lg max-w-lg w-full shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#080808]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-white/5 border border-white/10 text-white">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold">
                {language === 'ar' ? 'سير العمل الذكي' : 'Workflow Automation'}
              </span>
              <h3 className="font-serif italic text-lg text-white font-normal leading-tight">
                {language === 'ar' ? 'إنشاء قاعدة أتمتة جديدة' : 'Nouvelle Règle d’Automatisation'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
              {language === 'ar' ? 'اسم القاعدة *' : 'Intitulé de la règle *'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Relance automatique facture > 5 000 MAD à J+15"
              className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-white text-xs focus:outline-hidden focus:border-white/30"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
              {language === 'ar' ? 'وصف الهدف' : 'Description du processus'}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Envoie un rappel automatique par email et notifie le comptable..."
              className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-white text-xs focus:outline-hidden"
            />
          </div>

          {/* Trigger Block */}
          <div className="p-3.5 rounded bg-[#080808] border border-white/10 space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold block">
              1. DÉCLENCHEUR (TRIGGER)
            </span>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value as AutomationTrigger)}
              className="w-full px-3 py-2 rounded bg-[#0C0C0C] border border-white/10 text-white"
            >
              <option value="invoice_overdue">Facture client échue / impayée</option>
              <option value="quote_accepted">Devis accepté par le client</option>
              <option value="stock_low">Stock produit sous le seuil d'alerte</option>
              <option value="payment_received">Encaissement / paiement reçu</option>
              <option value="task_overdue">Tâche projet en retard</option>
            </select>
          </div>

          {/* Condition Block */}
          <div className="p-3.5 rounded bg-[#080808] border border-white/10 space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold block">
              2. CONDITION (IF)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={conditionField}
                onChange={(e) => setConditionField(e.target.value)}
                placeholder="Champ"
                className="px-2 py-1.5 rounded bg-[#0C0C0C] border border-white/10 text-white"
              />
              <select
                value={conditionOperator}
                onChange={(e) => setConditionOperator(e.target.value as any)}
                className="px-2 py-1.5 rounded bg-[#0C0C0C] border border-white/10 text-white"
              >
                <option value="greater_than">&gt; Supérieur à</option>
                <option value="equals">= Égal à</option>
                <option value="less_than">&lt; Inférieur à</option>
                <option value="contains">Contient</option>
              </select>
              <input
                type="text"
                value={conditionValue}
                onChange={(e) => setConditionValue(e.target.value)}
                placeholder="Valeur"
                className="px-2 py-1.5 rounded bg-[#0C0C0C] border border-white/10 text-white"
              />
            </div>
          </div>

          {/* Action Block */}
          <div className="p-3.5 rounded bg-[#080808] border border-white/10 space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold block">
              3. ACTION AUTOMATIQUE (THEN)
            </span>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as AutomationAction)}
              className="w-full px-3 py-2 rounded bg-[#0C0C0C] border border-white/10 text-white"
            >
              <option value="send_email_reminder">Envoyer un email de relance modèle DGI/MAD</option>
              <option value="send_whatsapp_template">Notifier sur WhatsApp Business</option>
              <option value="create_followup_task">Créer une tâche d'assignation équipe</option>
              <option value="notify_manager">Alerter le gérant dans le flux d'activité</option>
            </select>
          </div>

          {/* Footer buttons */}
          <div className="border-t border-white/10 pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Annuler'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-wider transition-colors"
            >
              {language === 'ar' ? 'حفظ وتفعيل الأتمتة' : 'Activer la Règle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
