import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  ShieldCheck,
  Globe,
  Landmark,
  UserCheck,
  Save,
  RotateCcw,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { MOROCCAN_CITIES } from '../../data/initialData';
import { UserRole } from '../../types';

export const SettingsView: React.FC = () => {
  const { currentOrg, updateOrganization, language, setLanguage, userRole, setUserRole, t } = useApp();

  const [orgData, setOrgData] = useState({ ...currentOrg });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrganization(orgData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Voulez-vous réinitialiser toutes les données de démonstration de SahlBiz aux valeurs initiales ?'
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            System & Enterprise Configuration
          </span>
          <h2 className="text-2xl lg:text-3xl font-serif italic text-white leading-tight mt-0.5">
            {t.settings}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {language === 'ar'
              ? 'إعدادات المقاولة، الهوية القانونية والضريبية (ICE / IF / RC)، الحسابات البنكية واللغة'
              : 'Profil de l’entreprise marocaine, mentions légales DGI, RIB et préférences.'}
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-mono text-xs uppercase tracking-wider transition-colors border border-rose-500/20"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Réinitialiser Démo</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Informations de l’entreprise et préférences enregistrées avec succès !</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6 text-xs font-mono">
        {/* Role & Interface Preferences */}
        <div className="p-6 rounded-lg bg-[#0C0C0C] border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-white" />
            <h3 className="font-sans font-medium text-white text-sm">
              Rôle Utilisateur & Langue d'interface
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Langue du système (Bilingue / Trilingue)
              </label>
              <div className="flex rounded bg-[#080808] border border-white/10 p-1">
                {(['fr', 'ar', 'en'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`flex-1 py-1 rounded text-xs font-mono uppercase tracking-wider transition-all ${
                      language === lang
                        ? 'bg-white text-black font-bold shadow-xs'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {lang === 'fr' ? 'Français' : lang === 'ar' ? 'العربية' : 'English'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Simulation Rôle & Permissions
              </label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-200 focus:outline-hidden"
              >
                <option value="owner">Gérant / Fondateur (Accès Total)</option>
                <option value="accountant">Comptable / DAF (Finances & Facturation)</option>
                <option value="sales">Commercial (Devis & CRM)</option>
                <option value="warehouse">Magasinier (Stocks & Dépôts)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Moroccan Legal & Fiscal Identity */}
        <div className="p-6 rounded-lg bg-[#0C0C0C] border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-white" />
            <h3 className="font-sans font-medium text-white text-sm">
              Identité Juridique & Fiscale Marocaine (DGI)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Raison Sociale de l'Entreprise *
              </label>
              <input
                type="text"
                required
                value={orgData.name}
                onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs font-sans text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Forme Juridique
              </label>
              <select
                value={orgData.legalForm}
                onChange={(e) => setOrgData({ ...orgData, legalForm: e.target.value as any })}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-200 focus:outline-hidden"
              >
                <option value="SARL">SARL (Société à Responsabilité Limitée)</option>
                <option value="SARL-AU">SARL-AU (Associé Unique)</option>
                <option value="SA">SA (Société Anonyme)</option>
                <option value="SAS">SAS (Société par Actions Simplifiée)</option>
                <option value="Auto-Entrepreneur">Auto-Entrepreneur</option>
                <option value="Personne Physique">Personne Physique / Patente</option>
              </select>
            </div>
          </div>

          {/* 4 Essential Moroccan Identifiers */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded bg-[#080808] border border-white/10">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                ICE (15 chiffres) *
              </label>
              <input
                type="text"
                required
                maxLength={15}
                value={orgData.ice}
                onChange={(e) => setOrgData({ ...orgData, ice: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#0C0C0C] border border-white/10 font-mono text-xs text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Identifiant Fiscal (IF)
              </label>
              <input
                type="text"
                value={orgData.identifiantFiscal}
                onChange={(e) => setOrgData({ ...orgData, identifiantFiscal: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#0C0C0C] border border-white/10 font-mono text-xs text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Registre Commerce (RC)
              </label>
              <input
                type="text"
                value={orgData.registreCommerce}
                onChange={(e) => setOrgData({ ...orgData, registreCommerce: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#0C0C0C] border border-white/10 font-mono text-xs text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Taxe Pro. (TP)
              </label>
              <input
                type="text"
                value={orgData.taxeProfessionnelle}
                onChange={(e) => setOrgData({ ...orgData, taxeProfessionnelle: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#0C0C0C] border border-white/10 font-mono text-xs text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                N° CNSS
              </label>
              <input
                type="text"
                value={orgData.cnss}
                onChange={(e) => setOrgData({ ...orgData, cnss: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 font-mono text-xs text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Capital Social (MAD)
              </label>
              <input
                type="number"
                value={orgData.capitalSocialMAD}
                onChange={(e) => setOrgData({ ...orgData, capitalSocialMAD: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 font-mono text-xs text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Ville du Siège
              </label>
              <select
                value={orgData.city}
                onChange={(e) => setOrgData({ ...orgData, city: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-200 focus:outline-hidden"
              >
                {MOROCCAN_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bank & Coordinates */}
        <div className="p-6 rounded-lg bg-[#0C0C0C] border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-white" />
            <h3 className="font-sans font-medium text-white text-sm">
              Coordonnées de Règlement Bancaire (Sur Factures & Devis)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Nom de la Banque
              </label>
              <input
                type="text"
                value={orgData.bankName}
                onChange={(e) => setOrgData({ ...orgData, bankName: e.target.value })}
                placeholder="Ex: Attijariwafa Bank"
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white focus:outline-hidden font-sans"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Relevé d'Identité Bancaire (RIB 24 chiffres)
              </label>
              <input
                type="text"
                value={orgData.rib}
                onChange={(e) => setOrgData({ ...orgData, rib: e.target.value })}
                placeholder="007 780 0001234567890123 45"
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 font-mono text-xs text-white focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Save Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les Modifications</span>
          </button>
        </div>
      </form>
    </div>
  );
};
