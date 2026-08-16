import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Upload, FileText, CheckCircle2, AlertCircle, Loader2, X, ArrowRight, Receipt } from 'lucide-react';
import { formatMAD } from '../../utils/formatters';

interface OcrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OcrScannerModal: React.FC<OcrScannerModalProps> = ({ isOpen, onClose }) => {
  const { processOcrExtraction, addExpense, currentOrg, language, t } = useApp();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      // Strip data url prefix for API
      const base64Data = result.split(',')[1];
      setImageBase64(base64Data);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSampleReceipt = (type: 'telecom' | 'carburant' | 'hardware') => {
    // Generate a mock base64 pixel image to allow preview & trigger OCR
    setImagePreview('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60');
    // Pre-populate realistic extraction or trigger simulation if offline
    if (type === 'telecom') {
      setExtractedData({
        supplierName: 'Maroc Telecom (IAM)',
        supplierICE: '000024512000088',
        invoiceNumber: 'IAM-2026-05-9921',
        date: new Date().toISOString().split('T')[0],
        totalTTC: 690,
        totalHT: 575,
        tvaAmount: 115,
        tvaRate: 20,
        category: 'Télécoms & Internet',
        description: 'Abonnement Fibre Optique Professionnelle 100 Mbps',
        confidenceScore: 0.96,
      });
    } else if (type === 'carburant') {
      setExtractedData({
        supplierName: 'TotalEnergies Marketing Maroc',
        supplierICE: '001524312000045',
        invoiceNumber: 'TOTAL-CASA-44912',
        date: new Date().toISOString().split('T')[0],
        totalTTC: 450,
        totalHT: 394.74,
        tvaAmount: 55.26,
        tvaRate: 14,
        category: 'Carburant & Déplacements',
        description: 'Plein Gazole Sans Soufre - Véhicule Commercial',
        confidenceScore: 0.94,
      });
    } else {
      setExtractedData({
        supplierName: 'Disway Maroc S.A',
        supplierICE: '000089412000012',
        invoiceNumber: 'DIS-2026-8921',
        date: new Date().toISOString().split('T')[0],
        totalTTC: 4200,
        totalHT: 3500,
        tvaAmount: 700,
        tvaRate: 20,
        category: 'Fournitures & Bureautique',
        description: 'Écran 27 pouces 4K + Accessoires Informatiques',
        confidenceScore: 0.98,
      });
    }
  };

  const handleScanWithAI = async () => {
    if (!imageBase64) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const data = await processOcrExtraction(imageBase64, mimeType);
      setExtractedData(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erreur lors de l’analyse OCR avec Gemini.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsExpense = () => {
    if (!extractedData) return;

    addExpense({
      organizationId: currentOrg.id,
      supplierName: extractedData.supplierName || 'Fournisseur Reconnu par IA',
      category: extractedData.category || 'Frais généraux',
      description: extractedData.description || 'Dépense scannée par OCR IA',
      amountHT: extractedData.totalHT || extractedData.totalTTC * 0.833,
      tvaRate: extractedData.tvaRate || 20,
      tvaAmount: extractedData.tvaAmount || extractedData.totalTTC * 0.167,
      amountTTC: extractedData.totalTTC,
      isDeductible: true,
      paymentMethod: 'Carte bancaire CMI',
      date: extractedData.date || new Date().toISOString().split('T')[0],
      status: 'paid',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0C0C0C] border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-white/5 border border-white/10 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                Document Scanner
              </span>
              <h3 className="font-serif italic text-white text-lg leading-tight">
                {language === 'ar' ? 'المسح الضوئي الذكي للفواتير (OCR Gemini)' : 'Scanner Reçu & Facture (IA Gemini 2.5)'}
              </h3>
              <p className="text-[10px] font-mono text-zinc-500">Extraction automatique : ICE, TTC, TVA, Fournisseur</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs font-mono">
          {/* Upload Area */}
          {!imagePreview && (
            <div className="border border-dashed border-white/20 rounded-lg p-8 text-center space-y-3 hover:border-white/40 transition-colors bg-[#080808]">
              <div className="w-10 h-10 rounded bg-white/5 border border-white/10 text-white flex items-center justify-center mx-auto">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="font-sans font-medium text-white text-xs">
                  Glissez une photo de facture ou cliquez pour importer
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">Prend en charge PNG, JPG, PDF (Tickets de caisse, factures DGI)</p>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-ocr-input"
              />
              <label
                htmlFor="file-ocr-input"
                className="inline-block px-4 py-2 rounded bg-white text-black hover:bg-zinc-200 font-mono font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-sm"
              >
                Parcourir les fichiers
              </label>

              {/* Sample test templates */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">
                  Ou testez instantanément avec un exemple marocain :
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSampleReceipt('telecom')}
                    className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-zinc-300 text-[11px] hover:bg-white/10 hover:text-white transition-colors"
                  >
                    Facture Maroc Telecom (690 DH)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSampleReceipt('carburant')}
                    className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-zinc-300 text-[11px] hover:bg-white/10 hover:text-white transition-colors"
                  >
                    Ticket TotalEnergies (450 DH)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSampleReceipt('hardware')}
                    className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-zinc-300 text-[11px] hover:bg-white/10 hover:text-white transition-colors"
                  >
                    Facture Disway (4200 DH)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Image Preview & AI Action */}
          {imagePreview && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded bg-[#080808] border border-white/10">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-zinc-400" />
                  <span className="font-medium text-xs text-white">Reçu chargé</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageBase64(null);
                    setExtractedData(null);
                  }}
                  className="text-xs text-rose-400 font-bold hover:underline"
                >
                  Changer de fichier
                </button>
              </div>

              {!extractedData && (
                <div className="text-center py-4">
                  <button
                    onClick={handleScanWithAI}
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded bg-white text-black hover:bg-zinc-200 font-mono font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 mx-auto disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Analyse Gemini en cours...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Extraire les données fiscales avec l'IA</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Extracted Data Form Review */}
          {extractedData && (
            <div className="space-y-4 p-4 rounded bg-[#080808] border border-white/10 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Données extraites avec succès</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Confiance IA: {Math.round((extractedData.confidenceScore || 0.95) * 100)}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-zinc-400 text-[10px] uppercase tracking-wider mb-1">Fournisseur</label>
                  <input
                    type="text"
                    value={extractedData.supplierName || ''}
                    onChange={(e) => setExtractedData({ ...extractedData, supplierName: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded bg-[#0C0C0C] border border-white/10 font-bold text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 text-[10px] uppercase tracking-wider mb-1">ICE Fournisseur</label>
                  <input
                    type="text"
                    value={extractedData.supplierICE || ''}
                    onChange={(e) => setExtractedData({ ...extractedData, supplierICE: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded bg-[#0C0C0C] border border-white/10 font-mono text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 text-[10px] uppercase tracking-wider mb-1">Montant Total TTC</label>
                  <input
                    type="number"
                    value={extractedData.totalTTC || 0}
                    onChange={(e) => setExtractedData({ ...extractedData, totalTTC: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded bg-[#0C0C0C] border border-white/10 font-mono font-bold text-emerald-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 text-[10px] uppercase tracking-wider mb-1">Taux TVA (%)</label>
                  <input
                    type="number"
                    value={extractedData.tvaRate || 20}
                    onChange={(e) => setExtractedData({ ...extractedData, tvaRate: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded bg-[#0C0C0C] border border-white/10 font-mono text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 text-[10px] uppercase tracking-wider mb-1">Description de la dépense</label>
                <input
                  type="text"
                  value={extractedData.description || ''}
                  onChange={(e) => setExtractedData({ ...extractedData, description: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded bg-[#0C0C0C] border border-white/10 text-white font-sans focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveAsExpense}
                  className="flex items-center gap-2 px-4 py-2 rounded bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Enregistrer dans les Dépenses</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
