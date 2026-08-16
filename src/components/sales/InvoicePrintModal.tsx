import React from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice, Quote } from '../../types';
import { X, Printer, Download, Share2, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatMAD, formatDate } from '../../utils/formatters';

interface InvoicePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Invoice | Quote | null;
  type?: 'invoice' | 'quote';
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  isOpen,
  onClose,
  document,
  type = 'invoice',
}) => {
  const { currentOrg, language, t } = useApp();

  if (!isOpen || !document) return null;

  const isInvoice = 'invoiceNumber' in document;
  const docNumber = isInvoice ? (document as Invoice).invoiceNumber : (document as Quote).quoteNumber;
  const docTitle = isInvoice ? 'FACTURE' : 'DEVIS';
  const dueDate = isInvoice ? (document as Invoice).dueDate : (document as Quote).validUntil;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white text-zinc-900 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[96vh] border border-white/10">
        {/* Top Floating Control Bar (Hidden on Print) */}
        <div className="px-6 py-3 bg-[#080808] border-b border-white/10 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-white/10 text-zinc-300">
              {docTitle}
            </span>
            <span className="font-mono text-xs text-white font-bold">
              {docNumber}
            </span>
            <span className="text-[10px] font-mono text-zinc-500">({currentOrg.name})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-white text-black hover:bg-zinc-200 text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / Télécharger PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet (A4 formatted styling) */}
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 bg-white text-slate-900 font-sans print:p-0">
          {/* Header & Logo */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-black text-xl flex items-center justify-center">
                  S
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-900">
                    {currentOrg.name}
                  </h1>
                  <p className="text-xs font-semibold text-slate-600">
                    {currentOrg.legalForm} au capital de {formatMAD(currentOrg.capitalSocialMAD || 100000, 'fr')}
                  </p>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-600 space-y-0.5">
                <p>{currentOrg.address}, {currentOrg.city} - Maroc</p>
                <p>Tél: {currentOrg.phone} • Email: {currentOrg.email}</p>
                <p className="font-semibold text-slate-800">
                  ICE: {currentOrg.ice} • IF: {currentOrg.identifiantFiscal} • RC: {currentOrg.registreCommerce}
                </p>
                <p className="text-[11px] text-slate-500">
                  TP: {currentOrg.taxeProfessionnelle} • CNSS: {currentOrg.cnss}
                </p>
              </div>
            </div>

            {/* Document Box */}
            <div className="text-right">
              <span className="inline-block px-4 py-1.5 bg-slate-900 text-white font-black text-lg tracking-widest rounded-lg">
                {docTitle}
              </span>
              <p className="text-sm font-bold text-slate-900 mt-2">N° {docNumber}</p>
              <p className="text-xs text-slate-600">Date d'émission : {formatDate(document.date, 'fr')}</p>
              <p className="text-xs text-slate-600">
                {isInvoice ? "Date d'échéance :" : "Date de validité :"} {formatDate(dueDate, 'fr')}
              </p>
            </div>
          </div>

          {/* Customer & Billing Box */}
          <div className="my-6 grid grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs">
              <span className="font-bold text-[10px] uppercase text-slate-400 tracking-wider">
                Émetteur
              </span>
              <p className="font-bold text-slate-900 mt-1">{currentOrg.name}</p>
              <p className="text-slate-600">{currentOrg.city}, Maroc</p>
              <p className="text-slate-600 font-mono mt-1">ICE: {currentOrg.ice}</p>
            </div>

            <div className="p-4 rounded-xl border-2 border-slate-300 bg-slate-50/50 text-xs">
              <span className="font-bold text-[10px] uppercase text-slate-400 tracking-wider">
                Destinataire (Client)
              </span>
              <p className="font-extrabold text-sm text-slate-900 mt-1">{document.customerName}</p>
              <p className="text-slate-600">{document.customerAddress || 'Casablanca'}, {document.customerCity || 'Maroc'}</p>
              <p className="text-slate-800 font-mono font-bold mt-1">
                ICE Client : {document.customerICE || 'Non renseigné'}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-900 text-white uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3 w-1/2">Désignation des Prestations / Marchandises</th>
                  <th className="p-3 text-center w-16">Qté</th>
                  <th className="p-3 text-right w-24">P.U HT (MAD)</th>
                  <th className="p-3 text-center w-16">TVA %</th>
                  <th className="p-3 text-right w-28">Total HT (MAD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {document.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-900">{item.description}</td>
                    <td className="p-3 text-center font-semibold">{item.quantity}</td>
                    <td className="p-3 text-right font-mono">{formatMAD(item.unitPriceHT, 'fr')}</td>
                    <td className="p-3 text-center font-bold text-slate-700">{item.tvaRate}%</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      {formatMAD(item.totalHT, 'fr')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & TVA Breakdown Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* TVA Breakdown */}
            <div className="border border-slate-200 rounded-xl overflow-hidden self-start">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-slate-100 font-bold text-slate-600 text-[10px] uppercase">
                  <tr>
                    <th className="p-2">Taux TVA</th>
                    <th className="p-2 text-right">Base HT (MAD)</th>
                    <th className="p-2 text-right">Montant Taxe (MAD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {document.tvaDetails.map((tva, i) => (
                    <tr key={i}>
                      <td className="p-2 font-bold">{tva.rate}%</td>
                      <td className="p-2 text-right font-mono">{formatMAD(tva.baseHT, 'fr')}</td>
                      <td className="p-2 text-right font-mono font-semibold">{formatMAD(tva.taxAmount, 'fr')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Final Totals Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700">
                <span>Total Général HT :</span>
                <span className="font-mono font-bold">{formatMAD(document.subtotalHT, 'fr')}</span>
              </div>

              {document.discountAmount > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>Remise accordée :</span>
                  <span className="font-mono font-bold">-{formatMAD(document.discountAmount, 'fr')}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-700">
                <span>Total TVA :</span>
                <span className="font-mono font-bold">{formatMAD(document.totalTVA, 'fr')}</span>
              </div>

              <div className="flex justify-between text-slate-900 pt-2 border-t-2 border-slate-900 text-sm font-black">
                <span>TOTAL NET À PAYER TTC :</span>
                <span className="text-emerald-700 font-mono">{formatMAD(document.totalTTC, 'fr')}</span>
              </div>
            </div>
          </div>

          {/* Official Moroccan Legal Mentions in French */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-6">
            <p className="font-bold text-slate-800">
              Arrêté la présente facture à la somme TTC de :
            </p>
            <p className="text-slate-700 font-medium italic mt-0.5">
              {document.legalMentions || `${formatMAD(document.totalTTC, 'fr')} Toutes Taxes Comprises.`}
            </p>
          </div>

          {/* Bank Coordinates & Official Stamp / Signature */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-300 text-xs">
            <div className="space-y-1">
              <p className="font-bold uppercase tracking-wider text-[10px] text-slate-400">
                Coordonnées de Règlement Bancaire
              </p>
              <p className="font-semibold text-slate-800">Banque : {currentOrg.bankName || 'Attijariwafa Bank'}</p>
              <p className="text-slate-600">Titulaire : {currentOrg.name}</p>
              <p className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded inline-block">
                RIB : {currentOrg.rib || '007 780 0001234567890123 45'}
              </p>
            </div>

            <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center flex flex-col justify-between h-28">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Cachet & Signature de l'Entreprise
              </span>
              <div className="text-[11px] text-slate-400 italic">
                Document certifié conforme par SahlBiz OS
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
