import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Supplier } from '../../types';
import {
  Truck,
  Plus,
  Search,
  Building2,
  Phone,
  Mail,
  MapPin,
  Edit2,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { formatMAD } from '../../utils/formatters';

export const SuppliersView: React.FC = () => {
  const { suppliers, deleteSupplier, setActiveModal, language, t } = useApp();
  const [search, setSearch] = useState('');

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.ice.includes(search) ||
      s.city.toLowerCase().includes(search.toLowerCase()) ||
      (s.category && s.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            Procurement & Vendors
          </span>
          <h2 className="text-2xl lg:text-3xl font-serif italic text-white leading-tight mt-0.5">
            {t.suppliers}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {language === 'ar'
              ? 'دليل الموردين والشركاء، أرقام التعريف الموحد للمقاولة (ICE)، والمشتريات'
              : 'Répertoire des fournisseurs et sous-traitants, ICE, IF et conditions de paiement.'}
          </p>
        </div>

        <button
          onClick={() => setActiveModal('new_supplier')}
          className="flex items-center gap-2 px-4 py-2 rounded bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.newSupplier}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 bg-[#0C0C0C] rounded-lg border border-white/10 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-4 py-1.5 rounded bg-[#080808] border border-white/10 text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-white/30"
            placeholder={
              language === 'ar'
                ? 'ابحث باسم المورد، ICE، المدينة...'
                : 'Rechercher fournisseur, ICE, ville...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-500 bg-[#0C0C0C] rounded-lg border border-white/10 font-mono">
            <Truck className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs">{language === 'ar' ? 'لا يوجد موردون' : 'Aucun fournisseur trouvé.'}</p>
          </div>
        ) : (
          filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="p-5 rounded-lg bg-[#0C0C0C] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-sans font-medium text-white text-sm">
                      {supplier.name}
                    </h3>
                    <span className="inline-block mt-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">
                      {supplier.category || 'Fournisseur Général'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveModal('edit_supplier', supplier)}
                      className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Supprimer le fournisseur ${supplier.name} ?`)) {
                          deleteSupplier(supplier.id);
                        }
                      }}
                      className="p-1.5 rounded text-zinc-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-zinc-300 font-mono">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[11px]">ICE: {supplier.ice || 'Non renseigné'}</span>
                  </div>

                  <div className="flex items-center gap-2 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span>{supplier.city}, Maroc</span>
                  </div>

                  {supplier.phone && (
                    <div className="flex items-center gap-2 font-mono">
                      <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span>{supplier.phone}</span>
                    </div>
                  )}

                  {supplier.email && (
                    <div className="flex items-center gap-2 font-mono">
                      <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate">{supplier.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500 text-[11px]">Délai règlement:</span>
                <span className="font-bold text-zinc-200">{supplier.paymentTerms}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
