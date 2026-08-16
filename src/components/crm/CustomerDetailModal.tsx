import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  FolderKanban,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Receipt,
} from 'lucide-react';
import { formatMAD, formatDate } from '../../utils/formatters';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  isOpen,
  onClose,
  customer,
}) => {
  const { invoices, quotes, payments, projects, setActiveModal, language, t } = useApp();
  const [activeTab, setActiveTab] = useState<'invoices' | 'quotes' | 'payments' | 'projects'>('invoices');

  if (!isOpen || !customer) return null;

  // Filter linked documents
  const customerInvoices = invoices.filter((i) => i.customerId === customer.id);
  const customerQuotes = quotes.filter((q) => q.customerId === customer.id);
  const customerPayments = payments.filter((p) => p.customerId === customer.id);
  const customerProjects = projects.filter((prj) => prj.customerId === customer.id);

  const totalInvoiced = customerInvoices.reduce((acc, i) => acc + (i.status !== 'cancelled' ? i.totalTTC : 0), 0);
  const totalPaid = customerPayments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-[#0C0C0C] border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Profile Section */}
        <div className="p-6 bg-[#080808] border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded bg-white/5 border border-white/10 text-white font-mono font-bold text-xl flex items-center justify-center">
              {customer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif italic text-xl text-white">
                  {customer.name}
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-white/5 border border-white/10 text-zinc-400">
                  {customer.legalForm || 'SARL'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                ICE: <span className="text-zinc-300">{customer.ice || 'Non renseigné'}</span> • IF: {customer.identifiantFiscal || '—'} • RC: {customer.registreCommerce || '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => {
                onClose();
                setActiveModal('new_invoice', { customerId: customer.id, customerName: customer.name });
              }}
              className="px-3.5 py-2 rounded bg-white text-black hover:bg-zinc-200 text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'إنشاء فاتورة' : 'Nouvelle Facture'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x rtl:divide-x-reverse divide-white/5 border-b border-white/10 bg-[#0C0C0C] text-center p-3 font-mono">
          <div className="p-2">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              {language === 'ar' ? 'المفوتر الإجمالي' : 'Total Facturé'}
            </span>
            <p className="text-sm font-bold text-white mt-0.5">
              {formatMAD(totalInvoiced, language)}
            </p>
          </div>
          <div className="p-2">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              {language === 'ar' ? 'المبالغ المحصلة' : 'Total Encaissé'}
            </span>
            <p className="text-sm font-bold text-emerald-400 mt-0.5">
              {formatMAD(totalPaid, language)}
            </p>
          </div>
          <div className="p-2">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              {language === 'ar' ? 'الرصيد المستحق (Créance)' : 'Solde Restant Dû'}
            </span>
            <p className="text-sm font-bold text-amber-400 mt-0.5">
              {formatMAD(customer.balanceDueMAD, language)}
            </p>
          </div>
          <div className="p-2">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              {language === 'ar' ? 'شروط السداد' : 'Conditions'}
            </span>
            <p className="text-xs font-mono text-zinc-300 mt-1">
              {customer.paymentTerms || '30 jours'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-white/10 flex gap-4 text-xs font-mono">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-3 border-b-2 uppercase tracking-wider transition-colors flex items-center gap-1.5 text-xs ${
              activeTab === 'invoices'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.invoices} ({customerInvoices.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`py-3 border-b-2 uppercase tracking-wider transition-colors flex items-center gap-1.5 text-xs ${
              activeTab === 'quotes'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{t.quotes} ({customerQuotes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-3 border-b-2 uppercase tracking-wider transition-colors flex items-center gap-1.5 text-xs ${
              activeTab === 'payments'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{t.payments} ({customerPayments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-3 border-b-2 uppercase tracking-wider transition-colors flex items-center gap-1.5 text-xs ${
              activeTab === 'projects'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>{t.projects} ({customerProjects.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3 font-mono">
          {/* Tab 1: Invoices */}
          {activeTab === 'invoices' && (
            <div className="space-y-2">
              {customerInvoices.length === 0 ? (
                <p className="py-8 text-center text-zinc-500 text-xs">
                  {language === 'ar' ? 'لا توجد فواتير مسجلة لهذا الزبون' : 'Aucune facture pour ce client.'}
                </p>
              ) : (
                customerInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => {
                      onClose();
                      setActiveModal('invoice_print', inv);
                    }}
                    className="p-3.5 rounded bg-[#080808] border border-white/10 flex items-center justify-between hover:border-white/20 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">
                          {inv.invoiceNumber}
                        </span>
                        <span className="text-[10px] text-zinc-500">{inv.date}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Échéance: {inv.dueDate}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-xs text-white">
                        {formatMAD(inv.totalTTC, language)}
                      </p>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 mt-0.5 inline-block">
                        {t[inv.status as keyof typeof t] || inv.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 2: Quotes */}
          {activeTab === 'quotes' && (
            <div className="space-y-2">
              {customerQuotes.length === 0 ? (
                <p className="py-8 text-center text-zinc-500 text-xs">
                  {language === 'ar' ? 'لا توجد عروض أسعار مسجلة' : 'Aucun devis enregistré.'}
                </p>
              ) : (
                customerQuotes.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => {
                      onClose();
                      setActiveModal('quote_print', q);
                    }}
                    className="p-3.5 rounded bg-[#080808] border border-white/10 flex items-center justify-between hover:border-white/20 cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-bold text-xs text-white">
                        {q.quoteNumber}
                      </span>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Validité: {q.validUntil}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xs text-white">
                        {formatMAD(q.totalTTC, language)}
                      </p>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 mt-0.5 inline-block">
                        {t[q.status as keyof typeof t] || q.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Payments */}
          {activeTab === 'payments' && (
            <div className="space-y-2">
              {customerPayments.length === 0 ? (
                <p className="py-8 text-center text-zinc-500 text-xs">
                  {language === 'ar' ? 'لا توجد دفعات مسجلة' : 'Aucun encaissement enregistré.'}
                </p>
              ) : (
                customerPayments.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded bg-[#080808] border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-xs text-emerald-400">
                        {p.paymentNumber}
                      </span>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        {p.paymentMethod} • Réf: {p.reference || '—'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xs text-white">
                        +{formatMAD(p.amount, language)}
                      </p>
                      <span className="text-[10px] text-zinc-500">{formatDate(p.paymentDate, language)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 4: Projects */}
          {activeTab === 'projects' && (
            <div className="space-y-2">
              {customerProjects.length === 0 ? (
                <p className="py-8 text-center text-zinc-500 text-xs">
                  {language === 'ar' ? 'لا توجد مشاريع مخصصة لهذا الزبون' : 'Aucun projet assigné.'}
                </p>
              ) : (
                customerProjects.map((prj) => (
                  <div
                    key={prj.id}
                    className="p-3.5 rounded bg-[#080808] border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-medium text-xs text-white">{prj.name}</span>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        Avancement: {prj.progressPercent}% • Budget: {formatMAD(prj.budgetMAD, language)}
                      </p>
                    </div>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">
                      {prj.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
