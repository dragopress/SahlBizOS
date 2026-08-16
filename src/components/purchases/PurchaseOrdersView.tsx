import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingCart,
  Plus,
  Search,
  CheckCircle2,
  FileText,
  Truck,
  ArrowUpRight,
  Filter,
  Calendar,
  Building2,
  Clock,
  Ban,
  Package,
} from 'lucide-react';
import { formatMAD, formatDate } from '../../utils/formatters';
import { PurchaseOrder, PurchaseOrderStatus } from '../../types';

export const PurchaseOrdersView: React.FC = () => {
  const { purchaseOrders, suppliers, language, t, setActiveModal, receivePurchaseOrder } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('all');

  const filteredOrders = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      (po.notes && po.notes.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    const matchesSupplier = selectedSupplierId === 'all' || po.supplierId === selectedSupplierId;

    return matchesSearch && matchesStatus && matchesSupplier;
  });

  const totalCommittedMAD = purchaseOrders
    .filter((po) => po.status !== 'cancelled')
    .reduce((sum, po) => sum + po.totalTTC, 0);

  const pendingReceptionCount = purchaseOrders.filter((po) => po.status === 'sent').length;

  const getStatusBadge = (status: PurchaseOrderStatus) => {
    switch (status) {
      case 'received':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            {language === 'ar' ? 'تم الاستلام' : 'Réceptionné'}
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Truck className="w-3 h-3" />
            {language === 'ar' ? 'مرسل للمورد' : 'Envoyé'}
          </span>
        );
      case 'billed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <FileText className="w-3 h-3" />
            {language === 'ar' ? 'مفوتر' : 'Facturé'}
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <Ban className="w-3 h-3" />
            {language === 'ar' ? 'ملغى' : 'Annulé'}
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold bg-white/10 text-zinc-300 border border-white/10">
            <Clock className="w-3 h-3" />
            {language === 'ar' ? 'مسودة' : 'Brouillon'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            {language === 'ar' ? 'إدارة المشتريات والتوريد' : 'Procurement & Supply Chain'}
          </span>
          <h1 className="font-serif italic text-2xl sm:text-3xl text-white font-normal mt-0.5">
            {language === 'ar' ? 'أوامر الشراء للموردين' : 'Bons de Commande Fournisseur'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-mono">
            {language === 'ar'
              ? 'تتبع أوامر الشراء والواردات إلى المخازن المغربية وحسابات ضريبة الشراء'
              : 'Générez des bons de commande, suivez les réceptions de stock et transformez vos achats en factures fournisseurs.'}
          </p>
        </div>

        <button
          onClick={() => setActiveModal('new_purchase_order')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? '+ أمر شراء جديد' : '+ Nouveau Bon de Commande'}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>{language === 'ar' ? 'إجمالي المشتريات الملتزم بها' : 'Total Engagé Achats'}</span>
            <ShoppingCart className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="mt-3">
            <div className="font-mono text-xl sm:text-2xl font-bold text-white tracking-tight">
              {formatMAD(totalCommittedMAD, language)}
            </div>
            <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
              {purchaseOrders.length} {language === 'ar' ? 'أمر شراء نشط' : 'commandes enregistrées'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>{language === 'ar' ? 'في انتظار الاستلام' : 'En Attente de Réception'}</span>
            <Truck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-3">
            <div className="font-mono text-xl sm:text-2xl font-bold text-blue-400 tracking-tight">
              {pendingReceptionCount}
            </div>
            <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
              {language === 'ar' ? 'سوف يتم إدخالها للمخزون فور التأكيد' : 'Mise en stock automatique à la validation'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>{language === 'ar' ? 'موردي الشركة' : 'Fournisseurs Actifs'}</span>
            <Building2 className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="mt-3">
            <div className="font-mono text-xl sm:text-2xl font-bold text-white tracking-tight">
              {suppliers.length}
            </div>
            <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
              {language === 'ar' ? 'معلومات المعرفات الضريبية ICE متطابقة' : 'Conformes DGI (ICE/IF/RC)'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'ar' ? 'بحث برقم الأمر أو المورد...' : 'Rechercher par N° BC, fournisseur...'}
            className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-white/30 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-300 font-mono focus:outline-hidden"
          >
            <option value="all">{language === 'ar' ? 'جميع الحالات' : 'Tous les statuts'}</option>
            <option value="draft">{language === 'ar' ? 'مسودة' : 'Brouillon'}</option>
            <option value="sent">{language === 'ar' ? 'مرسل' : 'Envoyé'}</option>
            <option value="received">{language === 'ar' ? 'مستلم في المخزن' : 'Réceptionné'}</option>
            <option value="billed">{language === 'ar' ? 'مفوتر' : 'Facturé'}</option>
            <option value="cancelled">{language === 'ar' ? 'ملغى' : 'Annulé'}</option>
          </select>

          <select
            value={selectedSupplierId}
            onChange={(e) => setSelectedSupplierId(e.target.value)}
            className="px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-300 font-mono focus:outline-hidden max-w-[200px]"
          >
            <option value="all">{language === 'ar' ? 'جميع الموردين' : 'Tous les fournisseurs'}</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-lg bg-[#0C0C0C] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#080808] text-[10px] uppercase font-mono tracking-widest text-zinc-400">
                <th className="py-3 px-4">{language === 'ar' ? 'رقم الطلب' : 'N° Commande'}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'المورد' : 'Fournisseur'}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'تاريخ الإصدار' : 'Date Émission'}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'تاريخ الاستلام المتوقع' : 'Livraison Prévue'}</th>
                <th className="py-3 px-4 text-right rtl:text-left">{language === 'ar' ? 'المبلغ الإجمالي TTC' : 'Montant TTC'}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'الحالة' : 'Statut'}</th>
                <th className="py-3 px-4 text-right rtl:text-left">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-mono">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-30 text-white" />
                    <p>{language === 'ar' ? 'لا توجد أوامر شراء مطابقة' : 'Aucun bon de commande trouvé.'}</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-3.5 px-4 font-bold text-white">{po.orderNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-sans font-medium text-white">{po.supplierName}</div>
                      <span className="text-[10px] text-zinc-500">
                        {po.items.length} {language === 'ar' ? 'عناصر' : 'lignes'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">{formatDate(po.date, language)}</td>
                    <td className="py-3.5 px-4 text-zinc-400">{formatDate(po.expectedDeliveryDate, language)}</td>
                    <td className="py-3.5 px-4 text-right rtl:text-left font-bold text-white">
                      {formatMAD(po.totalTTC, language)}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(po.status)}</td>
                    <td className="py-3.5 px-4 text-right rtl:text-left">
                      <div className="flex items-center justify-end rtl:justify-start gap-1.5">
                        {po.status === 'sent' && (
                          <button
                            onClick={() => receivePurchaseOrder(po.id)}
                            className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-bold tracking-wider transition-colors"
                            title="Entrer en stock"
                          >
                            {language === 'ar' ? 'استلام المخزون' : 'Réceptionner'}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setActiveModal('ai_ocr');
                          }}
                          className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                          title="Scanner facture liée"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
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
