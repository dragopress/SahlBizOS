import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  Plus,
  Phone,
  MapPin,
  CheckCircle,
  Edit2,
  Trash2,
  Eye,
} from 'lucide-react';
import { formatMAD } from '../../utils/formatters';

export const CustomersView: React.FC = () => {
  const { customers, deleteCustomer, setActiveModal, language, t } = useApp();
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCustomers = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.ice && c.ice.includes(search)) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
      c.city.toLowerCase().includes(search.toLowerCase());

    const matchCity = cityFilter === 'all' || c.city === cityFilter;
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'due' && c.balanceDueMAD > 0) ||
      (statusFilter === 'clear' && c.balanceDueMAD === 0);

    return matchSearch && matchCity && matchStatus;
  });

  const cities = Array.from(new Set(customers.map((c) => c.city).filter(Boolean)));

  const totalReceivables = customers.reduce((acc, c) => acc + c.balanceDueMAD, 0);
  const totalBilled = customers.reduce((acc, c) => acc + c.totalBilledMAD, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            Client Directory
          </span>
          <h2 className="text-2xl lg:text-3xl font-serif italic text-white leading-tight mt-0.5">
            {t.customers}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {language === 'ar'
              ? 'إدارة قاعدة بيانات الزبائن المغاربة، المعرفات الضريبية (ICE / IF / RC) والديون'
              : 'Répertoire des clients B2B/B2C, identifiants fiscaux marocains et encours financiers.'}
          </p>
        </div>

        <button
          onClick={() => setActiveModal('new_customer')}
          className="flex items-center gap-2 px-4 py-2.5 rounded bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.newCustomer}</span>
        </button>
      </div>

      {/* Summary KPI Mini-cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg bg-[#0C0C0C] border border-white/10">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            {language === 'ar' ? 'إجمالي عدد الزبائن' : 'Total Clients'}
          </span>
          <p className="text-xl lg:text-2xl font-mono font-bold text-white mt-1.5">
            {customers.length}
          </p>
        </div>

        <div className="p-5 rounded-lg bg-[#0C0C0C] border border-white/10">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            {language === 'ar' ? 'إجمالي المبيعات المفوترة' : 'Chiffre d’Affaires Cumulé'}
          </span>
          <p className="text-xl lg:text-2xl font-mono font-bold text-emerald-400 mt-1.5">
            {formatMAD(totalBilled, language)}
          </p>
        </div>

        <div className="p-5 rounded-lg bg-[#0C0C0C] border border-white/10">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            {language === 'ar' ? 'إجمالي الديون المستحقة' : 'Encours Client Global'}
          </span>
          <p className="text-xl lg:text-2xl font-mono font-bold text-amber-400 mt-1.5">
            {formatMAD(totalReceivables, language)}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-4 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-white/30 font-mono"
            placeholder={
              language === 'ar'
                ? 'ابحث باسم الزبون، ICE، المدينة...'
                : 'Rechercher par nom, ICE, email, ville...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto font-mono">
          {/* City Filter */}
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-200 focus:outline-hidden"
          >
            <option value="all">{language === 'ar' ? 'كل المدن' : 'Toutes les villes'}</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* Balance status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-200 focus:outline-hidden"
          >
            <option value="all">{language === 'ar' ? 'جميع الحالات' : 'Tous les statuts'}</option>
            <option value="due">{language === 'ar' ? 'مع رصيد مستحق' : 'Avec solde dû'}</option>
            <option value="clear">{language === 'ar' ? 'مسدد بالكامل' : 'À jour (0 MAD)'}</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#0C0C0C] rounded-lg border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="bg-[#080808] border-b border-white/10 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                <th className="py-3 px-4">{t.customer}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'المعرفات الضريبية' : 'Identifiants (ICE/IF/RC)'}</th>
                <th className="py-3 px-4">{t.city} & {t.phone}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'إجمالي الفوترة' : 'CA Facturé'}</th>
                <th className="py-3 px-4">{language === 'ar' ? 'الرصيد المستحق' : 'Solde Dû (MAD)'}</th>
                <th className="py-3 px-4 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500 font-mono text-xs">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>{language === 'ar' ? 'لا يوجد زبناء يطابقون البحث' : 'Aucun client trouvé.'}</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    onClick={() => setActiveModal('customer_detail', c)}
                  >
                    {/* Name & Type */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-white/5 border border-white/10 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white group-hover:text-zinc-200 transition-colors">
                            {c.name}
                          </p>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-white/5 text-zinc-400 border border-white/5 mt-0.5">
                            {c.category || 'B2B'} • {c.legalForm || 'SARL'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Tax Identifiers */}
                    <td className="py-3 px-4 font-mono">
                      <div className="space-y-0.5">
                        <p className="text-zinc-300">
                          <span className="text-zinc-500 font-normal">ICE:</span> {c.ice || '—'}
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          {c.identifiantFiscal && `IF: ${c.identifiantFiscal} • `}
                          {c.registreCommerce && `RC: ${c.registreCommerce}`}
                        </p>
                      </div>
                    </td>

                    {/* Contact & City */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <p className="font-medium text-zinc-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-zinc-500" />
                          {c.city}
                        </p>
                        <p className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-zinc-600" />
                          {c.phone || c.email || '—'}
                        </p>
                      </div>
                    </td>

                    {/* Total Billed */}
                    <td className="py-3 px-4 font-mono font-medium text-white">
                      {formatMAD(c.totalBilledMAD, language)}
                    </td>

                    {/* Balance Due */}
                    <td className="py-3 px-4 font-mono">
                      {c.balanceDueMAD > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          {formatMAD(c.balanceDueMAD, language)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-xs">
                          <CheckCircle className="w-3 h-3" />
                          0 MAD
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setActiveModal('customer_detail', c)}
                          title="Fiche 360°"
                          className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setActiveModal('edit_customer', c)}
                          title="Modifier"
                          className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Supprimer le client ${c.name} ?`)) {
                              deleteCustomer(c.id);
                            }
                          }}
                          title="Supprimer"
                          className="p-1.5 rounded text-zinc-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
