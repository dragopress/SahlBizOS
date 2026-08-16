import { Language } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  // Navigation
  dashboard: string;
  crm: string;
  customers: string;
  leadsPipeline: string;
  contacts: string;
  sales: string;
  quotes: string;
  invoices: string;
  payments: string;
  catalog: string;
  productsServices: string;
  inventory: string;
  purchases: string;
  suppliers: string;
  purchaseOrders: string;
  finance: string;
  expenses: string;
  bankAccounts: string;
  cashflow: string;
  operations: string;
  projects: string;
  tasks: string;
  calendar: string;
  documents: string;
  reports: string;
  automation: string;
  aiAssistant: string;
  settings: string;

  // Actions
  create: string;
  newCustomer: string;
  newQuote: string;
  newInvoice: string;
  newPayment: string;
  newExpense: string;
  newTask: string;
  newProject: string;
  newProduct: string;
  newSupplier: string;
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  filter: string;
  search: string;
  export: string;
  import: string;
  print: string;
  downloadPdf: string;
  sendEmail: string;
  sendWhatsApp: string;
  convertInvoice: string;
  recordPayment: string;
  refresh: string;
  viewAll: string;
  back: string;
  close: string;

  // Statuses
  draft: string;
  sent: string;
  accepted: string;
  rejected: string;
  paid: string;
  partiallyPaid: string;
  overdue: string;
  cancelled: string;
  active: string;
  inactive: string;
  completed: string;
  inProgress: string;
  todo: string;
  inReview: string;

  // KPIs
  monthlyRevenue: string;
  unpaidInvoices: string;
  monthlyExpenses: string;
  availableCash: string;
  pipelineValue: string;
  activeProjectsCount: string;
  overdueTasksCount: string;
  conversionRate: string;

  // Moroccan specifics
  ice: string;
  if_: string;
  rc: string;
  cnss: string;
  tp: string;
  rib: string;
  legalForm: string;
  capitalSocial: string;
  tvaRates: string;
  moroccoTaxMentions: string;

  // AI
  aiTitle: string;
  aiSubtitle: string;
  askAiPlaceholder: string;
  ocrExtract: string;
  ocrSubtitle: string;
  insightsTitle: string;

  // Roles
  owner: string;
  admin: string;
  manager: string;
  accountant: string;
  salesRole: string;
  employee: string;
  viewer: string;
}

export const translations: Record<Language, Translations> = {
  fr: {
    appName: 'SahlBiz Business OS',
    tagline: 'Piloter • Gérer • Suivre • Analyser • Décider',
    dashboard: 'Tableau de bord',
    crm: 'CRM & Clients',
    customers: 'Clients',
    leadsPipeline: 'Opportunités & Pipeline',
    contacts: 'Contacts',
    sales: 'Ventes & Facturation',
    quotes: 'Devis',
    invoices: 'Factures',
    payments: 'Paiements & Encaissements',
    catalog: 'Produits & Stocks',
    productsServices: 'Articles & Services',
    inventory: 'Mouvements de Stock',
    purchases: 'Achats & Fournisseurs',
    suppliers: 'Fournisseurs',
    purchaseOrders: 'Bons de Commande',
    finance: 'Finance & Trésorerie',
    expenses: 'Dépenses & Frais',
    bankAccounts: 'Comptes Bancaires & Caisse',
    cashflow: 'Prévisionnel de Trésorerie',
    operations: 'Opérations',
    projects: 'Projets',
    tasks: 'Tâches',
    calendar: 'Calendrier Global',
    documents: 'Documents & GED',
    reports: 'Rapports & Statistiques',
    automation: 'Automatisations',
    aiAssistant: 'Assistant IA Gemini',
    settings: 'Paramètres & Société',

    create: 'Nouveau',
    newCustomer: 'Nouveau Client',
    newQuote: 'Créer un Devis',
    newInvoice: 'Créer une Facture',
    newPayment: 'Encaisser un Paiement',
    newExpense: 'Nouvelle Dépense',
    newTask: 'Nouvelle Tâche',
    newProject: 'Nouveau Projet',
    newProduct: 'Nouvel Article',
    newSupplier: 'Nouveau Fournisseur',
    save: 'Enregistrer',
    cancel: 'Annuler',
    edit: 'Modifier',
    delete: 'Supprimer',
    filter: 'Filtrer',
    search: 'Rechercher (Ctrl+K)...',
    export: 'Exporter',
    import: 'Importer',
    print: 'Imprimer',
    downloadPdf: 'Télécharger PDF',
    sendEmail: 'Envoyer par Email',
    sendWhatsApp: 'Envoyer WhatsApp',
    convertInvoice: 'Convertir en Facture',
    recordPayment: 'Enregistrer Paiement',
    refresh: 'Actualiser',
    viewAll: 'Voir tout',
    back: 'Retour',
    close: 'Fermer',

    draft: 'Brouillon',
    sent: 'Envoyée',
    accepted: 'Accepté',
    rejected: 'Refusé',
    paid: 'Payée',
    partiallyPaid: 'Partiellement payée',
    overdue: 'En retard',
    cancelled: 'Annulée',
    active: 'Actif',
    inactive: 'Inactif',
    completed: 'Terminé',
    inProgress: 'En cours',
    todo: 'À faire',
    inReview: 'En révision',

    monthlyRevenue: "Chiffre d'Affaires (Mois)",
    unpaidInvoices: 'Créances / Factures Impayées',
    monthlyExpenses: 'Dépenses Totales',
    availableCash: 'Trésorerie Disponible',
    pipelineValue: 'Valeur du Pipeline Commercial',
    activeProjectsCount: 'Projets Actifs',
    overdueTasksCount: 'Tâches en Retard',
    conversionRate: 'Taux de Conversion Devis',

    ice: 'ICE',
    if_: 'Identifiant Fiscal (IF)',
    rc: 'Registre de Commerce (RC)',
    cnss: 'Affiliation CNSS',
    tp: 'Taxe Professionnelle (TP)',
    rib: 'RIB Bancaire (24 chiffres)',
    legalForm: 'Forme Juridique',
    capitalSocial: 'Capital Social',
    tvaRates: 'Taux de TVA',
    moroccoTaxMentions: 'Mentions Légales Marocaines',

    aiTitle: 'Assistant Affaires SahlBiz IA',
    aiSubtitle: 'Conseiller de gestion alimenté par Gemini 3.7 Flash avec vos données réelles',
    askAiPlaceholder: 'Ex: Analyse ma rentabilité, quels clients relancer cette semaine ?',
    ocrExtract: 'Extraction OCR Facture / Reçu',
    ocrSubtitle: 'Scannez une facture pour pré-remplir automatiquement les dépenses',
    insightsTitle: 'Analyses & Alertes Intelligentes',

    owner: 'Propriétaire (Owner)',
    admin: 'Administrateur',
    manager: 'Directeur / Manager',
    accountant: 'Comptable',
    salesRole: 'Commercial',
    employee: 'Collaborateur',
    viewer: 'Lecteur seul',
  },
  ar: {
    appName: 'SahlBiz Business OS',
    tagline: 'وجّه • أدر • تابع • حلل • قرر',
    dashboard: 'لوحة القيادة',
    crm: 'إدارة الزبائن CRM',
    customers: 'الزبائن والعملاء',
    leadsPipeline: 'الفرص ومراحل البيع',
    contacts: 'جهات الاتصال',
    sales: 'المبيعات والفوترة',
    quotes: 'عروض الأسعار (Devis)',
    invoices: 'الفواتير',
    payments: 'المدفوعات والمقبوضات',
    catalog: 'المنتجات والمخزون',
    productsServices: 'السلع والخدمات',
    inventory: 'حركات المخزون',
    purchases: 'المشتريات والموردون',
    suppliers: 'الموردون',
    purchaseOrders: 'أوامر الشراء (BC)',
    finance: 'المالية والخزينة',
    expenses: 'المصاريف والنفقات',
    bankAccounts: 'الحسابات البنكية والصندوق',
    cashflow: 'توقعات السيولة النقدية',
    operations: 'العمليات والإنتاج',
    projects: 'المشاريع',
    tasks: 'المهام',
    calendar: 'التقويم الموحد',
    documents: 'الأرشيف والمستندات',
    reports: 'التقارير والإحصائيات',
    automation: 'الأتمتة وقواعد العمل',
    aiAssistant: 'المساعد الذكي Gemini',
    settings: 'الإعدادات والشركة',

    create: 'إنشاء جديد',
    newCustomer: 'زبون جديد',
    newQuote: 'عرض سعر جديد',
    newInvoice: 'فاتورة جديدة',
    newPayment: 'تسجيل دفعة',
    newExpense: 'مصروف جديد',
    newTask: 'مهمة جديدة',
    newProject: 'مشروع جديد',
    newProduct: 'منتج/خدمة جديدة',
    newSupplier: 'مورد جديد',
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    filter: 'تصفية',
    search: 'بحث سريع (Ctrl+K)...',
    export: 'تصدير',
    import: 'استيراد',
    print: 'طباعة',
    downloadPdf: 'تحميل PDF',
    sendEmail: 'إرسال عبر البريد',
    sendWhatsApp: 'إرسال عبر واتساب',
    convertInvoice: 'تحويل إلى فاتورة',
    recordPayment: 'تسجيل الدفعة',
    refresh: 'تحديث',
    viewAll: 'عرض الكل',
    back: 'رجوع',
    close: 'إغلاق',

    draft: 'مسودة',
    sent: 'تم الإرسال',
    accepted: 'مقبول',
    rejected: 'مرفوض',
    paid: 'مدفوعة بالكامل',
    partiallyPaid: 'مدفوعة جزئياً',
    overdue: 'متأخرة السداد',
    cancelled: 'ملغاة',
    active: 'نشط',
    inactive: 'غير نشط',
    completed: 'مكتمل',
    inProgress: 'قيد التنفيذ',
    todo: 'للإنجاز',
    inReview: 'قيد المراجعة',

    monthlyRevenue: 'رقم المعاملات (هذا الشهر)',
    unpaidInvoices: 'الفواتير المستحقة وغير المسددة',
    monthlyExpenses: 'إجمالي المصاريف والنفقات',
    availableCash: 'السيولة النقدية المتوفرة',
    pipelineValue: 'قيمة الصفقات المتوقعة',
    activeProjectsCount: 'المشاريع النشطة',
    overdueTasksCount: 'المهام المتأخرة',
    conversionRate: 'نسبة تحويل عروض الأسعار',

    ice: 'الرقم الموحد للمقاولة ICE',
    if_: 'التعريف الضريبي IF',
    rc: 'السجل التجاري RC',
    cnss: 'رقم الانخراط CNSS',
    tp: 'الضريبة المهنية TP',
    rib: 'رقم الحساب البنكي RIB',
    legalForm: 'الشكل القانوني للشركة',
    capitalSocial: 'رأس المال',
    tvaRates: 'نسب الضريبة على القيمة المضافة TVA',
    moroccoTaxMentions: 'البيانات القانونية المغربية',

    aiTitle: 'مساعد SahlBiz الذكي للأعمال',
    aiSubtitle: 'تحليل مالي وإداري مدعوم بـ Gemini 3.7 Flash ببيانات واقعية',
    askAiPlaceholder: 'مثال: حلل أرباح هذا الشهر، من هم الزبائن الواجب تذكيرهم؟',
    ocrExtract: 'الاستخراج الذكي من الفاتورة (OCR)',
    ocrSubtitle: 'امسح فاتورة الشراء لملء بيانات المصروف فورياً',
    insightsTitle: 'تنبيهات ورؤى استراتيجية',

    owner: 'المالك الرئيسي',
    admin: 'مدير عام',
    manager: 'مدير عمليات',
    accountant: 'محاسب مالي',
    salesRole: 'مسؤول مبيعات',
    employee: 'موظف',
    viewer: 'مطلع فقط',
  },
  en: {
    appName: 'SahlBiz Business OS',
    tagline: 'Steer • Manage • Track • Analyze • Decide',
    dashboard: 'Dashboard',
    crm: 'CRM & Customers',
    customers: 'Customers',
    leadsPipeline: 'Leads & Pipeline',
    contacts: 'Contacts',
    sales: 'Sales & Invoicing',
    quotes: 'Quotations',
    invoices: 'Invoices',
    payments: 'Payments & Receipts',
    catalog: 'Products & Stock',
    productsServices: 'Catalog Items',
    inventory: 'Stock Movements',
    purchases: 'Purchases & Suppliers',
    suppliers: 'Suppliers',
    purchaseOrders: 'Purchase Orders',
    finance: 'Finance & Treasury',
    expenses: 'Expenses',
    bankAccounts: 'Bank & Cash Accounts',
    cashflow: 'Cash Flow Forecast',
    operations: 'Operations',
    projects: 'Projects',
    tasks: 'Tasks',
    calendar: 'Master Calendar',
    documents: 'Documents & DMS',
    reports: 'Reports & Analytics',
    automation: 'Automations',
    aiAssistant: 'Gemini AI Assistant',
    settings: 'Settings & Company',

    create: 'New',
    newCustomer: 'New Customer',
    newQuote: 'Create Quote',
    newInvoice: 'Create Invoice',
    newPayment: 'Record Payment',
    newExpense: 'New Expense',
    newTask: 'New Task',
    newProject: 'New Project',
    newProduct: 'New Item',
    newSupplier: 'New Supplier',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    filter: 'Filter',
    search: 'Quick Search (Ctrl+K)...',
    export: 'Export',
    import: 'Import',
    print: 'Print',
    downloadPdf: 'Download PDF',
    sendEmail: 'Send by Email',
    sendWhatsApp: 'Send WhatsApp',
    convertInvoice: 'Convert to Invoice',
    recordPayment: 'Record Payment',
    refresh: 'Refresh',
    viewAll: 'View All',
    back: 'Back',
    close: 'Close',

    draft: 'Draft',
    sent: 'Sent',
    accepted: 'Accepted',
    rejected: 'Rejected',
    paid: 'Paid',
    partiallyPaid: 'Partially Paid',
    overdue: 'Overdue',
    cancelled: 'Cancelled',
    active: 'Active',
    inactive: 'Inactive',
    completed: 'Completed',
    inProgress: 'In Progress',
    todo: 'To Do',
    inReview: 'In Review',

    monthlyRevenue: 'Monthly Revenue',
    unpaidInvoices: 'Unpaid Receivables',
    monthlyExpenses: 'Total Expenses',
    availableCash: 'Available Cash',
    pipelineValue: 'Pipeline Value',
    activeProjectsCount: 'Active Projects',
    overdueTasksCount: 'Overdue Tasks',
    conversionRate: 'Quote Conversion Rate',

    ice: 'ICE Number',
    if_: 'Fiscal ID (IF)',
    rc: 'Trade Register (RC)',
    cnss: 'CNSS Affiliation',
    tp: 'Professional Tax (TP)',
    rib: 'Bank Account RIB (24 digits)',
    legalForm: 'Legal Form',
    capitalSocial: 'Share Capital',
    tvaRates: 'VAT Rates',
    moroccoTaxMentions: 'Moroccan Legal Statements',

    aiTitle: 'SahlBiz AI Business Advisor',
    aiSubtitle: 'Powered by Gemini 3.7 Flash with real company context',
    askAiPlaceholder: 'E.g. Analyze my cashflow, which clients are overdue?',
    ocrExtract: 'Invoice / Receipt OCR Extraction',
    ocrSubtitle: 'Scan receipt to auto-populate expenses',
    insightsTitle: 'Smart Insights & Alerts',

    owner: 'Owner',
    admin: 'Administrator',
    manager: 'Manager',
    accountant: 'Accountant',
    salesRole: 'Sales Rep',
    employee: 'Staff',
    viewer: 'Viewer',
  },
};
