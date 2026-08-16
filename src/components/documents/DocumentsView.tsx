import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FolderArchive,
  Upload,
  Search,
  FileText,
  FileSpreadsheet,
  Download,
  Trash2,
  Tag,
  Building2,
  FolderKanban,
  FileCode,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { BusinessDocument, DocumentCategory } from '../../types';
import { formatDate } from '../../utils/formatters';

export const DocumentsView: React.FC = () => {
  const { documents, deleteDocument, setActiveModal, language, t } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(search.toLowerCase()) ||
      (doc.tags && doc.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));

    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories: { id: DocumentCategory | 'all'; label: string; count: number }[] = [
    { id: 'all', label: language === 'ar' ? 'جميع المستندات' : 'Tous les documents', count: documents.length },
    {
      id: 'contracts',
      label: language === 'ar' ? 'العقود والاتفاقيات' : 'Contrats & Accords',
      count: documents.filter((d) => d.category === 'contracts').length,
    },
    {
      id: 'invoices_in',
      label: language === 'ar' ? 'فواتير الموردين والوصولات' : 'Factures Fournisseurs & Reçus',
      count: documents.filter((d) => d.category === 'invoices_in').length,
    },
    {
      id: 'tax_legal',
      label: language === 'ar' ? 'الوثائق الجبائية والقانونية' : 'Fiscalité, DGI & Statuts',
      count: documents.filter((d) => d.category === 'tax_legal').length,
    },
    {
      id: 'company_status',
      label: language === 'ar' ? 'السجل التجاري والـ ICE' : 'RC, ICE & Modèle J',
      count: documents.filter((d) => d.category === 'company_status').length,
    },
    {
      id: 'payroll',
      label: language === 'ar' ? 'الرواتب والضمان الاجتماعي' : 'Paie & Déclarations CNSS',
      count: documents.filter((d) => d.category === 'payroll').length,
    },
  ];

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5 text-rose-400" />;
    if (fileType.includes('sheet') || fileType.includes('excel'))
      return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
    return <FileCode className="w-5 h-5 text-blue-400" />;
  };

  const handleDownload = (doc: BusinessDocument) => {
    // Generate dummy text blob for realistic browser download
    const blob = new Blob(
      [
        `SahlBiz Business OS - Document Archive\n\nTitle: ${doc.title}\nCategory: ${doc.category}\nFile: ${doc.fileName}\nUploaded: ${doc.uploadedAt}\nBy: ${doc.uploadedBy}\n`,
      ],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.fileName || `${doc.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            {language === 'ar' ? 'الأرشيف والمستندات الرقمية' : 'Digital Document Storage & Compliance'}
          </span>
          <h1 className="font-serif italic text-2xl sm:text-3xl text-white font-normal mt-0.5">
            {language === 'ar' ? 'مركز الوثائق والملفات القانونية' : 'Gestion Électronique des Documents'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-mono">
            {language === 'ar'
              ? 'تخزين آمن للعقود، الإقرارات الضريبية، شهادات التسجيل التجاري وملفات العملاء'
              : 'Classez et sécurisez vos statuts d’entreprise, contrats clients, quittances DGI et déclarations sociales CNSS.'}
          </p>
        </div>

        <button
          onClick={() => setActiveModal('upload_document')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm shrink-0 self-start md:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>{language === 'ar' ? '+ رفع مستند جديد' : '+ Importer un Document'}</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-2 rounded text-xs font-mono whitespace-nowrap transition-colors flex items-center gap-2 border ${
              selectedCategory === cat.id
                ? 'bg-white text-black font-bold border-white'
                : 'bg-[#0C0C0C] text-zinc-400 hover:text-white border-white/10'
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] ${
                selectedCategory === cat.id ? 'bg-black/20 text-black' : 'bg-white/10 text-zinc-400'
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'ar' ? 'بحث في المستندات أو الوسوم...' : 'Rechercher par titre, tag, fichier...'}
            className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-white/30 font-mono"
          />
        </div>

        <span className="text-xs font-mono text-zinc-500">
          {filteredDocs.length} {language === 'ar' ? 'مستندات متاحة' : 'fichiers indexés'}
        </span>
      </div>

      {/* Documents Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full py-16 text-center text-zinc-500 bg-[#0C0C0C] border border-white/10 rounded-lg font-mono text-xs">
            <FolderArchive className="w-10 h-10 mx-auto mb-3 opacity-30 text-white" />
            <p>{language === 'ar' ? 'لا توجد مستندات مطابقة' : 'Aucun document trouvé.'}</p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-lg bg-[#0C0C0C] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-2 rounded bg-[#080808] border border-white/10">
                    {getFileIcon(doc.fileType)}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">{doc.fileSize}</span>
                </div>

                <h3 className="font-sans font-medium text-white text-sm mb-1 line-clamp-1">
                  {doc.title}
                </h3>
                <p className="text-[11px] font-mono text-zinc-500 truncate mb-3">
                  {doc.fileName}
                </p>

                {/* Related Entity */}
                {doc.relatedEntityName && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 bg-[#080808] px-2 py-1 rounded border border-white/5 mb-3">
                    <Building2 className="w-3 h-3 text-zinc-500" />
                    <span className="truncate">{doc.relatedEntityName}</span>
                  </div>
                )}

                {/* Tags */}
                {doc.tags && doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {doc.tags.map((tg, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/5 text-zinc-400 border border-white/5"
                      >
                        #{tg}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>{formatDate(doc.uploadedAt, language)}</span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    title="Télécharger"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="p-1.5 rounded hover:bg-white/10 text-zinc-600 hover:text-rose-400 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
