import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { X, Building2, User, Phone, Mail, MapPin, Hash, ShieldAlert } from 'lucide-react';

interface CustomerBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCustomer?: Customer | null;
}

export const CustomerBuilderModal: React.FC<CustomerBuilderModalProps> = ({
  isOpen,
  onClose,
  initialCustomer,
}) => {
  const { addCustomer, updateCustomer, currentOrg, language, t } = useApp();

  const [formData, setFormData] = useState({
    name: initialCustomer?.name || '',
    legalForm: initialCustomer?.legalForm || 'SARL',
    ice: initialCustomer?.ice || '',
    identifiantFiscal: initialCustomer?.identifiantFiscal || '',
    registreCommerce: initialCustomer?.registreCommerce || '',
    taxeProfessionnelle: initialCustomer?.taxeProfessionnelle || '',
    email: initialCustomer?.email || '',
    phone: initialCustomer?.phone || '+212 ',
    address: initialCustomer?.address || '',
    city: initialCustomer?.city || 'Casablanca',
    country: 'Maroc',
    category: initialCustomer?.category || 'B2B',
    paymentTerms: initialCustomer?.paymentTerms || '30 jours',
    creditLimitMAD: initialCustomer?.creditLimitMAD || 50000,
    notes: initialCustomer?.notes || '',
  });

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError(language === 'ar' ? 'يرجى إدخال اسم الزبون' : 'Le nom du client est requis.');
      return;
    }

    if (initialCustomer) {
      updateCustomer(initialCustomer.id, formData);
    } else {
      addCustomer({
        organizationId: currentOrg.id,
        name: formData.name,
        legalForm: formData.legalForm,
        ice: formData.ice,
        identifiantFiscal: formData.identifiantFiscal,
        registreCommerce: formData.registreCommerce,
        taxeProfessionnelle: formData.taxeProfessionnelle,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        category: formData.category,
        paymentTerms: formData.paymentTerms,
        creditLimitMAD: Number(formData.creditLimitMAD),
        notes: formData.notes,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0C0C0C] border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-white/5 border border-white/10 text-white">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                Account Onboarding
              </span>
              <h3 className="font-serif italic text-white text-lg leading-tight">
                {initialCustomer
                  ? language === 'ar'
                    ? 'تعديل بيانات الزبون'
                    : 'Modifier le Client'
                  : language === 'ar'
                  ? 'إضافة زبون مغربي جديد'
                  : 'Nouveau Client Professionnel (Maroc)'}
              </h3>
              <p className="text-[10px] font-mono text-zinc-500">
                {language === 'ar'
                  ? 'المعلومات القانونية، الضريبية وجهات الاتصال'
                  : 'Informations légales, fiscales et coordonnées commerciales'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Identification */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
              {language === 'ar' ? 'بيانات التعريف القانوني' : 'Identité de l’Entreprise'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  {language === 'ar' ? 'اسم الشركة / الزبون *' : 'Raison Sociale / Nom du Client *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Atlas Logistique SARL"
                  className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-white/30 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  {language === 'ar' ? 'الشكل القانوني' : 'Forme Juridique'}
                </label>
                <select
                  value={formData.legalForm}
                  onChange={(e) => setFormData({ ...formData, legalForm: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-200 focus:outline-hidden font-mono"
                >
                  <option value="SARL">SARL</option>
                  <option value="SARL AU">SARL AU</option>
                  <option value="SA">SA</option>
                  <option value="SAS">SAS</option>
                  <option value="Auto-Entrepreneur">Auto-Entrepreneur</option>
                  <option value="Personne Physique">Particulier</option>
                </select>
              </div>
            </div>

            {/* Moroccan Tax Identifiers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  ICE (15 chiffres)
                </label>
                <input
                  type="text"
                  value={formData.ice}
                  onChange={(e) => setFormData({ ...formData, ice: e.target.value })}
                  placeholder="002345678000045"
                  className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  IF (Identifiant Fiscal)
                </label>
                <input
                  type="text"
                  value={formData.identifiantFiscal}
                  onChange={(e) => setFormData({ ...formData, identifiantFiscal: e.target.value })}
                  placeholder="45123987"
                  className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  RC (Registre Commerce)
                </label>
                <input
                  type="text"
                  value={formData.registreCommerce}
                  onChange={(e) => setFormData({ ...formData, registreCommerce: e.target.value })}
                  placeholder="123456 Casablanca"
                  className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Address */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
              {language === 'ar' ? 'العناوين وجهات الاتصال' : 'Coordonnées & Localisation'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Email professionnel
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@atlaslogistique.ma"
                  className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Téléphone (+212)
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+212 5 22 10 20 30"
                  className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Adresse complète
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Zone Industrielle Sidi Maârouf, Lot 14"
                  className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Ville (Maroc)
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-200 focus:outline-hidden font-mono"
                >
                  <option value="Casablanca">Casablanca</option>
                  <option value="Rabat">Rabat</option>
                  <option value="Tanger">Tanger</option>
                  <option value="Marrakech">Marrakech</option>
                  <option value="Agadir">Agadir</option>
                  <option value="Fès">Fès</option>
                  <option value="Meknès">Meknès</option>
                  <option value="Oujda">Oujda</option>
                  <option value="Kénitra">Kénitra</option>
                  <option value="Autre">Autre ville</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Commercial & Payment Terms */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
              {language === 'ar' ? 'شروط الدفع والائتمان' : 'Conditions Financières & Règlement'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Délai de paiement convenu
                </label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-200 focus:outline-hidden font-mono"
                >
                  <option value="Comptant">Comptant à la livraison</option>
                  <option value="30 jours">30 jours fin de mois</option>
                  <option value="60 jours">60 jours (Délai légal max)</option>
                  <option value="90 jours">90 jours</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Plafond d'encours autorisé (MAD)
                </label>
                <input
                  type="number"
                  value={formData.creditLimitMAD}
                  onChange={(e) => setFormData({ ...formData, creditLimitMAD: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs font-mono text-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-transparent border border-white/10 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Annuler'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-white text-black hover:bg-zinc-200 text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              {initialCustomer
                ? language === 'ar'
                  ? 'حفظ التعديلات'
                  : 'Enregistrer les modifications'
                : language === 'ar'
                ? 'إنشاء الزبون'
                : 'Créer le Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
