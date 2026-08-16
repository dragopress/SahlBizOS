import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Upload, FileText, Tag, Building2, Check } from 'lucide-react';
import { DocumentCategory } from '../../types';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ isOpen, onClose }) => {
  const { currentOrg, customers, projects, currentUser, addDocument, language } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('contracts');
  const [fileName, setFileName] = useState('Contrat_Prestation_2026.pdf');
  const [fileSize, setFileSize] = useState('1.8 MB');
  const [fileType, setFileType] = useState('application/pdf');
  const [relatedEntity, setRelatedEntity] = useState<'customer' | 'project' | 'supplier' | 'invoice'>('customer');
  const [relatedEntityId, setRelatedEntityId] = useState<string>(customers[0]?.id || '');
  const [tagsInput, setTagsInput] = useState('Maroc, SARL, DGI, 2026');

  if (!isOpen) return null;

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      setFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
      setFileType(file.type || 'application/pdf');
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
      setFileType(file.type || 'application/pdf');
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let relatedName = '';
    if (relatedEntity === 'customer') {
      const c = customers.find((cust) => cust.id === relatedEntityId);
      relatedName = c ? c.companyName : '';
    } else if (relatedEntity === 'project') {
      const p = projects.find((prj) => prj.id === relatedEntityId);
      relatedName = p ? p.name : '';
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addDocument({
      organizationId: currentOrg.id,
      title,
      category,
      fileName,
      fileSize,
      fileType,
      relatedEntity,
      relatedEntityId,
      relatedEntityName: relatedName,
      tags,
      uploadedBy: currentUser.name,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#0C0C0C] border border-white/10 rounded-lg max-w-lg w-full shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#080808]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-white/5 border border-white/10 text-white">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold">
                {language === 'ar' ? 'أرشفة المستندات' : 'Stockage Sécurisé'}
              </span>
              <h3 className="font-serif italic text-lg text-white font-normal leading-tight">
                {language === 'ar' ? 'إضافة وتصنيف ملف رقمي' : 'Importer & Archiver un Document'}
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
          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-white/10 hover:border-white/30 rounded-lg p-5 text-center bg-[#080808] transition-colors cursor-pointer relative"
          >
            <input
              type="file"
              onChange={handleFileSelect}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Upload className="w-6 h-6 mx-auto mb-2 text-zinc-400" />
            <p className="text-white font-medium text-xs">
              {fileName || (language === 'ar' ? 'اسحب الملف هنا أو اضغط للاختيار' : 'Glissez le fichier ou cliquez pour parcourir')}
            </p>
            <p className="text-[10px] text-zinc-500 mt-1">
              PDF, Excel, Word, Images jusqu'à 25 MB
            </p>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
              {language === 'ar' ? 'عنوان المستند *' : 'Titre du document *'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Contrat cadre annuel Atlas Corp 2026"
              className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-white text-xs focus:outline-hidden focus:border-white/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                {language === 'ar' ? 'التصنيف' : 'Catégorie'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-white focus:outline-hidden"
              >
                <option value="contracts">{language === 'ar' ? 'عقود واتفاقيات' : 'Contrats & Accords'}</option>
                <option value="invoices_in">{language === 'ar' ? 'فواتير مشتريات' : 'Factures Fournisseurs'}</option>
                <option value="tax_legal">{language === 'ar' ? 'ضرائب وقانوني' : 'Fiscalité & DGI'}</option>
                <option value="company_status">{language === 'ar' ? 'سجل تجاري Modèle J' : 'RC / Statuts SARL'}</option>
                <option value="payroll">{language === 'ar' ? 'رواتب و CNSS' : 'Paie & CNSS'}</option>
                <option value="other">{language === 'ar' ? 'أخرى' : 'Autre'}</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                {language === 'ar' ? 'الارتباط' : 'Associer à'}
              </label>
              <select
                value={relatedEntityId}
                onChange={(e) => setRelatedEntityId(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-white focus:outline-hidden"
              >
                <option value="">{language === 'ar' ? 'عام (بدون ارتباط)' : 'Général'}</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    Client : {c.companyName}
                  </option>
                ))}
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    Projet : {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
              {language === 'ar' ? 'الوسوم للبحث السريع' : 'Tags de recherche (séparés par des virgules)'}
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Contrat, 2026, Signé, Casablanca"
              className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-white text-xs focus:outline-hidden"
            />
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
              {language === 'ar' ? 'تأكيد الرفع' : 'Archiver le Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
