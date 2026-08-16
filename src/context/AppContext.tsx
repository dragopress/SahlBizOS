import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Organization,
  User,
  UserRole,
  Language,
  Customer,
  Opportunity,
  Product,
  Warehouse,
  StockMovement,
  Quote,
  Invoice,
  Payment,
  Supplier,
  PurchaseOrder,
  Expense,
  BankAccount,
  Project,
  Task,
  BusinessDocument,
  AutomationRule,
  AuditLog,
  BusinessNotification,
  AiChatMessage,
  AiExtractedInvoice,
} from '../types';
import {
  INITIAL_ORGANIZATIONS,
  INITIAL_USERS,
  INITIAL_CUSTOMERS,
  INITIAL_OPPORTUNITIES,
  INITIAL_PRODUCTS,
  INITIAL_WAREHOUSES,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_QUOTES,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_EXPENSES,
  INITIAL_BANK_ACCOUNTS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_DOCUMENTS,
  INITIAL_AUTOMATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';
import { translations, Translations } from '../utils/translations';
import confetti from 'canvas-confetti';

export type NavView =
  | 'dashboard'
  | 'customers'
  | 'leads'
  | 'quotes'
  | 'invoices'
  | 'payments'
  | 'products'
  | 'inventory'
  | 'suppliers'
  | 'purchases'
  | 'expenses'
  | 'bank_accounts'
  | 'cashflow'
  | 'projects'
  | 'tasks'
  | 'calendar'
  | 'documents'
  | 'reports'
  | 'automation'
  | 'ai_assistant'
  | 'settings';

interface AppContextType {
  // Navigation & Localization
  currentView: NavView;
  setCurrentView: (view: NavView) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Active Organization & User Context (Tenant & RBAC)
  currentOrg: Organization;
  setCurrentOrg: (org: Organization) => void;
  organizations: Organization[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  setUserRole: (role: UserRole) => void;

  // Search & Global Command Palette
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // Quick Action Modal Triggers
  activeModal: string | null;
  setActiveModal: (modalName: string | null, payload?: any) => void;
  modalPayload: any;

  // Domain Collections & CRUD
  customers: Customer[];
  addCustomer: (c: Omit<Customer, 'id' | 'createdAt' | 'balanceDueMAD' | 'totalBilledMAD'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  opportunities: Opportunity[];
  addOpportunity: (opp: Omit<Opportunity, 'id' | 'createdAt'>) => void;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;

  products: Product[];
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  warehouses: Warehouse[];
  stockMovements: StockMovement[];
  recordStockMovement: (sm: Omit<StockMovement, 'id' | 'date'>) => void;

  quotes: Quote[];
  addQuote: (q: Omit<Quote, 'id' | 'createdAt' | 'quoteNumber'>) => Quote;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  convertQuoteToInvoice: (quoteId: string) => Invoice;

  invoices: Invoice[];
  addInvoice: (inv: Omit<Invoice, 'id' | 'createdAt' | 'invoiceNumber' | 'amountPaid' | 'balanceDue'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  cancelInvoice: (id: string) => void;

  payments: Payment[];
  recordPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'paymentNumber'>) => Payment;

  suppliers: Supplier[];
  addSupplier: (s: Omit<Supplier, 'id' | 'createdAt'>) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;

  purchaseOrders: PurchaseOrder[];
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'createdAt' | 'orderNumber'>) => void;
  receivePurchaseOrder: (id: string) => void;

  expenses: Expense[];
  addExpense: (e: Omit<Expense, 'id' | 'createdAt' | 'expenseNumber'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  approveExpense: (id: string) => void;

  bankAccounts: BankAccount[];
  updateBankAccountBalance: (id: string, newBalance: number) => void;

  projects: Project[];
  addProject: (p: Omit<Project, 'id' | 'createdAt' | 'code' | 'spentMAD' | 'billedMAD' | 'progressPercent' | 'tasksCount' | 'completedTasksCount'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;

  tasks: Task[];
  addTask: (t: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  documents: BusinessDocument[];
  addDocument: (doc: Omit<BusinessDocument, 'id' | 'uploadedAt'>) => void;
  deleteDocument: (id: string) => void;

  automations: AutomationRule[];
  toggleAutomation: (id: string) => void;

  notifications: BusinessNotification[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  auditLogs: AuditLog[];
  addAuditLog: (action: string, entity: string, entityId: string, entityName: string, details: string) => void;

  // AI Assistant Chat & OCR
  aiMessages: AiChatMessage[];
  sendAiMessage: (messageText: string) => Promise<void>;
  isAiLoading: boolean;
  processOcrExtraction: (base64: string, mimeType?: string) => Promise<AiExtractedInvoice | null>;

  // System actions
  resetToDemoData: () => void;
  exportDatabaseJson: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'sahlbiz_business_os_db_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Settings
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [language, setLanguageState] = useState<Language>('fr');
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Tenant & User
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [currentOrg, setCurrentOrg] = useState<Organization>(INITIAL_ORGANIZATIONS[0]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);

  // Search & Modals
  const [searchQuery, setSearchQuery] = useState('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activeModal, setActiveModalState] = useState<string | null>(null);
  const [modalPayload, setModalPayload] = useState<any>(null);

  // Domain Collections
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(INITIAL_WAREHOUSES);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(INITIAL_STOCK_MOVEMENTS);
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(INITIAL_BANK_ACCOUNTS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [documents, setDocuments] = useState<BusinessDocument[]>(INITIAL_DOCUMENTS);
  const [automations, setAutomations] = useState<AutomationRule[]>(INITIAL_AUTOMATIONS);
  const [notifications, setNotifications] = useState<BusinessNotification[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // AI Chat Messages
  const [aiMessages, setAiMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: 'Bonjour ! Je suis SahlBiz AI, votre contrôleur de gestion intelligent. Comment puis-je vous aider à piloter votre entreprise marocaine aujourd’hui ?',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      actionSuggestions: [
        { label: '📊 Analyser mes ventes ce mois-ci', action: 'analyse_ventes' },
        { label: '⚠️ Quels clients doivent être relancés ?', action: 'relances_clients' },
        { label: '💡 Pourquoi ma trésorerie baisse ?', action: 'tresorerie_analyse' },
        { label: '📦 Alertes réapprovisionnement stock', action: 'stock_alert' },
      ],
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.customers) setCustomers(data.customers);
        if (data.invoices) setInvoices(data.invoices);
        if (data.quotes) setQuotes(data.quotes);
        if (data.payments) setPayments(data.payments);
        if (data.expenses) setExpenses(data.expenses);
        if (data.products) setProducts(data.products);
        if (data.projects) setProjects(data.projects);
        if (data.tasks) setTasks(data.tasks);
        if (data.language) setLanguageState(data.language);
        if (data.theme) setThemeState(data.theme);
      }
    } catch (e) {
      console.warn('Could not load saved data from localStorage', e);
    }
  }, []);

  // Save to local storage on key updates
  useEffect(() => {
    try {
      const stateToSave = {
        customers,
        invoices,
        quotes,
        payments,
        expenses,
        products,
        projects,
        tasks,
        language,
        theme,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [customers, invoices, quotes, payments, expenses, products, projects, tasks, language, theme]);

  // Handle HTML document RTL / LTR direction and Dark mode class
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [language, theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
  };

  const t = translations[language];

  const setUserRole = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }));
  };

  const setActiveModal = (modalName: string | null, payload?: any) => {
    setActiveModalState(modalName);
    setModalPayload(payload || null);
  };

  const addAuditLog = (action: string, entity: string, entityId: string, entityName: string, details: string) => {
    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      organizationId: currentOrg.id,
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      entity,
      entityId,
      entityName,
      timestamp: new Date().toISOString(),
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Customer Management
  const addCustomer = (cData: Omit<Customer, 'id' | 'createdAt' | 'balanceDueMAD' | 'totalBilledMAD'>): Customer => {
    const newCust: Customer = {
      ...cData,
      id: 'cust_' + Date.now(),
      balanceDueMAD: 0,
      totalBilledMAD: 0,
      createdAt: new Date().toISOString(),
    };
    setCustomers((prev) => [newCust, ...prev]);
    addAuditLog('Création Client', 'Customer', newCust.id, newCust.name, `Nouveau client ${newCust.name} créé.`);
    return newCust;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    addAuditLog('Mise à jour Client', 'Customer', id, updates.name || id, `Mise à jour des informations client.`);
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    addAuditLog('Suppression Client', 'Customer', id, id, `Client supprimé.`);
  };

  // Opportunities Management
  const addOpportunity = (oppData: Omit<Opportunity, 'id' | 'createdAt'>) => {
    const newOpp: Opportunity = {
      ...oppData,
      id: 'opp_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setOpportunities((prev) => [newOpp, ...prev]);
    addAuditLog('Création Opportunité', 'Opportunity', newOpp.id, newOpp.title, `Opportunité de ${newOpp.expectedRevenueMAD} MAD créée.`);
  };

  const updateOpportunity = (id: string, updates: Partial<Opportunity>) => {
    setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
    if (updates.stage === 'won') {
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch {}
    }
  };

  // Products Management
  const addProduct = (pData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...pData,
      id: 'prod_' + Date.now(),
    };
    setProducts((prev) => [newProd, ...prev]);
    addAuditLog('Création Article', 'Product', newProd.id, newProd.name, `Article ${newProd.name} ajouté au catalogue.`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Stock Movement
  const recordStockMovement = (smData: Omit<StockMovement, 'id' | 'date'>) => {
    const newSm: StockMovement = {
      ...smData,
      id: 'sm_' + Date.now(),
      date: new Date().toISOString(),
    };
    setStockMovements((prev) => [newSm, ...prev]);

    // Update product stock
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === smData.productId) {
          const updatedStock = Math.max(0, p.currentStock + smData.quantity);
          return { ...p, currentStock: updatedStock };
        }
        return p;
      })
    );

    addAuditLog('Mouvement de Stock', 'StockMovement', newSm.id, smData.productName, `Mouvement ${smData.type} (${smData.quantity > 0 ? '+' : ''}${smData.quantity})`);
  };

  // Quotes Management
  const addQuote = (qData: Omit<Quote, 'id' | 'createdAt' | 'quoteNumber'>): Quote => {
    const count = quotes.length + 1;
    const numStr = String(count).padStart(4, '0');
    const quoteNumber = `${currentOrg.quotePrefix || 'DEV-2026-'}${numStr}`;

    const newQuote: Quote = {
      ...qData,
      id: 'quote_' + Date.now(),
      quoteNumber,
      createdAt: new Date().toISOString(),
    };

    setQuotes((prev) => [newQuote, ...prev]);
    addAuditLog('Création Devis', 'Quote', newQuote.id, newQuote.quoteNumber, `Devis créé pour ${newQuote.customerName} d'un montant de ${newQuote.totalTTC} MAD.`);
    return newQuote;
  };

  const updateQuote = (id: string, updates: Partial<Quote>) => {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
    if (updates.status === 'accepted') {
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch {}
    }
  };

  // ONE-CLICK QUOTE TO INVOICE CONVERTER
  const convertQuoteToInvoice = (quoteId: string): Invoice => {
    const quote = quotes.find((q) => q.id === quoteId);
    if (!quote) throw new Error('Devis introuvable');

    const invCount = invoices.length + 1;
    const numStr = String(invCount).padStart(4, '0');
    const invoiceNumber = `${currentOrg.invoicePrefix || 'FA-2026-'}${numStr}`;

    const now = new Date();
    const dueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newInvoice: Invoice = {
      id: 'inv_' + Date.now(),
      organizationId: currentOrg.id,
      invoiceNumber,
      quoteId: quote.id,
      quoteNumber: quote.quoteNumber,
      customerId: quote.customerId,
      customerName: quote.customerName,
      customerICE: quote.customerICE,
      customerAddress: quote.customerAddress,
      customerCity: quote.customerCity,
      date: now.toISOString().split('T')[0],
      dueDate,
      items: quote.items,
      subtotalHT: quote.subtotalHT,
      discountAmount: quote.discountAmount,
      discountPercent: quote.discountPercent,
      tvaDetails: quote.tvaDetails,
      totalTVA: quote.totalTVA,
      totalTTC: quote.totalTTC,
      amountPaid: 0,
      balanceDue: quote.totalTTC,
      status: 'sent',
      paymentTerms: '30 jours',
      notes: `Facture issue de la conversion automatique du devis ${quote.quoteNumber}.`,
      legalMentions: `Arrêté la présente facture à la somme de ${quote.totalTTC} MAD TTC.`,
      payments: [],
      createdAt: now.toISOString(),
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    // Update quote status
    updateQuote(quote.id, {
      status: 'converted',
      convertedToInvoiceId: newInvoice.id,
      convertedToInvoiceNumber: newInvoice.invoiceNumber,
    });

    // Update customer total billed and balance due
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === quote.customerId) {
          return {
            ...c,
            totalBilledMAD: c.totalBilledMAD + newInvoice.totalTTC,
            balanceDueMAD: c.balanceDueMAD + newInvoice.totalTTC,
          };
        }
        return c;
      })
    );

    // Auto deduct inventory stock for product line items
    quote.items.forEach((item) => {
      if (item.productId) {
        recordStockMovement({
          organizationId: currentOrg.id,
          productId: item.productId,
          productName: item.description,
          type: 'sale',
          quantity: -item.quantity,
          previousStock: 0,
          newStock: 0,
          referenceDocument: newInvoice.invoiceNumber,
          warehouseId: 'wh_casa',
          warehouseName: 'Dépôt Principal Casablanca',
          reason: `Vente facturée sur ${newInvoice.invoiceNumber}`,
          userName: currentUser.name,
        });
      }
    });

    try {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    } catch {}

    addAuditLog(
      'Conversion Devis en Facture',
      'Invoice',
      newInvoice.id,
      newInvoice.invoiceNumber,
      `Conversion réussie du devis ${quote.quoteNumber} en facture ${newInvoice.invoiceNumber} (${newInvoice.totalTTC} MAD TTC).`
    );

    return newInvoice;
  };

  // Invoices Management
  const addInvoice = (invData: Omit<Invoice, 'id' | 'createdAt' | 'invoiceNumber' | 'amountPaid' | 'balanceDue'>): Invoice => {
    const invCount = invoices.length + 1;
    const numStr = String(invCount).padStart(4, '0');
    const invoiceNumber = `${currentOrg.invoicePrefix || 'FA-2026-'}${numStr}`;

    const newInv: Invoice = {
      ...invData,
      id: 'inv_' + Date.now(),
      invoiceNumber,
      amountPaid: 0,
      balanceDue: invData.totalTTC,
      payments: [],
      createdAt: new Date().toISOString(),
    };

    setInvoices((prev) => [newInv, ...prev]);

    // Update customer balances
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === newInv.customerId) {
          return {
            ...c,
            totalBilledMAD: c.totalBilledMAD + newInv.totalTTC,
            balanceDueMAD: c.balanceDueMAD + newInv.totalTTC,
          };
        }
        return c;
      })
    );

    addAuditLog('Création Facture', 'Invoice', newInv.id, newInv.invoiceNumber, `Nouvelle facture ${newInv.invoiceNumber} de ${newInv.totalTTC} MAD TTC créée.`);
    return newInv;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv)));
  };

  const cancelInvoice = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          return { ...inv, status: 'cancelled', balanceDue: 0 };
        }
        return inv;
      })
    );
    addAuditLog('Annulation Facture', 'Invoice', id, id, `Facture ${id} annulée.`);
  };

  // Payment Recording & Live Invoice Status Transition
  const recordPayment = (pData: Omit<Payment, 'id' | 'createdAt' | 'paymentNumber'>): Payment => {
    const payCount = payments.length + 1;
    const numStr = String(payCount).padStart(4, '0');
    const paymentNumber = `PAI-2026-${numStr}`;

    const newPayment: Payment = {
      ...pData,
      id: 'pay_' + Date.now(),
      paymentNumber,
      createdAt: new Date().toISOString(),
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Update Invoice status & remaining balance
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === pData.invoiceId) {
          const newPaid = inv.amountPaid + pData.amount;
          const newBalance = Math.max(0, inv.totalTTC - newPaid);
          const newStatus = newBalance <= 0 ? 'paid' : 'partially_paid';

          return {
            ...inv,
            amountPaid: newPaid,
            balanceDue: newBalance,
            status: newStatus,
            payments: [...inv.payments, newPayment.id],
          };
        }
        return inv;
      })
    );

    // Update Customer due balance
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === pData.customerId) {
          return {
            ...c,
            balanceDueMAD: Math.max(0, c.balanceDueMAD - pData.amount),
          };
        }
        return c;
      })
    );

    // Update Bank Account balance
    setBankAccounts((prev) =>
      prev.map((ba) => {
        if (ba.id === pData.bankAccountId) {
          return {
            ...ba,
            currentBalance: ba.currentBalance + pData.amount,
          };
        }
        return ba;
      })
    );

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {}

    addAuditLog(
      'Enregistrement Paiement',
      'Payment',
      newPayment.id,
      newPayment.paymentNumber,
      `Encaissement de ${pData.amount} MAD pour la facture ${pData.invoiceNumber} via ${pData.paymentMethod}.`
    );

    return newPayment;
  };

  // Suppliers & Purchases
  const addSupplier = (sData: Omit<Supplier, 'id' | 'createdAt'>) => {
    const newSupp: Supplier = {
      ...sData,
      id: 'supp_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setSuppliers((prev) => [newSupp, ...prev]);
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const addPurchaseOrder = (poData: Omit<PurchaseOrder, 'id' | 'createdAt' | 'orderNumber'>) => {
    const count = purchaseOrders.length + 1;
    const orderNumber = `BC-2026-${String(count).padStart(4, '0')}`;
    const newPo: PurchaseOrder = {
      ...poData,
      id: 'po_' + Date.now(),
      orderNumber,
      createdAt: new Date().toISOString(),
    };
    setPurchaseOrders((prev) => [newPo, ...prev]);
  };

  const receivePurchaseOrder = (id: string) => {
    const po = purchaseOrders.find((p) => p.id === id);
    if (!po) return;

    setPurchaseOrders((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'received' } : p)));

    // Auto-increment stock for purchased items
    po.items.forEach((item) => {
      if (item.productId) {
        recordStockMovement({
          organizationId: currentOrg.id,
          productId: item.productId,
          productName: item.description,
          type: 'purchase',
          quantity: item.quantity,
          previousStock: 0,
          newStock: 0,
          referenceDocument: po.orderNumber,
          warehouseId: 'wh_casa',
          warehouseName: 'Dépôt Principal Casablanca',
          reason: `Réception bon de commande fournisseur ${po.orderNumber}`,
          userName: currentUser.name,
        });
      }
    });

    addAuditLog('Réception Bon de Commande', 'PurchaseOrder', po.id, po.orderNumber, `Réceptionné et entré en stock.`);
  };

  // Expenses
  const addExpense = (eData: Omit<Expense, 'id' | 'createdAt' | 'expenseNumber'>) => {
    const count = expenses.length + 1;
    const expenseNumber = `DEP-2026-${String(count).padStart(4, '0')}`;

    const newExp: Expense = {
      ...eData,
      id: 'exp_' + Date.now(),
      expenseNumber,
      createdAt: new Date().toISOString(),
    };

    setExpenses((prev) => [newExp, ...prev]);

    // If paid directly, deduct from bank account
    if (newExp.status === 'paid' && newExp.bankAccountId) {
      setBankAccounts((prev) =>
        prev.map((ba) => (ba.id === newExp.bankAccountId ? { ...ba, currentBalance: ba.currentBalance - newExp.totalTTC } : ba))
      );
    }

    addAuditLog('Création Dépense', 'Expense', newExp.id, newExp.expenseNumber, `Dépense de ${newExp.totalTTC} MAD (${newExp.category}) enregistrée.`);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const approveExpense = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          return { ...e, status: 'approved', approvedBy: currentUser.name };
        }
        return e;
      })
    );
    addAuditLog('Approbation Dépense', 'Expense', id, id, `Dépense approuvée par ${currentUser.name}.`);
  };

  // Bank Accounts
  const updateBankAccountBalance = (id: string, newBalance: number) => {
    setBankAccounts((prev) => prev.map((ba) => (ba.id === id ? { ...ba, currentBalance: newBalance } : ba)));
  };

  // Projects
  const addProject = (pData: Omit<Project, 'id' | 'createdAt' | 'code' | 'spentMAD' | 'billedMAD' | 'progressPercent' | 'tasksCount' | 'completedTasksCount'>) => {
    const count = projects.length + 1;
    const code = `PRJ-2026-${String(count).padStart(2, '0')}`;
    const newPrj: Project = {
      ...pData,
      id: 'prj_' + Date.now(),
      code,
      spentMAD: 0,
      billedMAD: 0,
      progressPercent: 0,
      tasksCount: 0,
      completedTasksCount: 0,
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [newPrj, ...prev]);
    addAuditLog('Création Projet', 'Project', newPrj.id, newPrj.name, `Nouveau projet ${newPrj.name} (${newPrj.budgetMAD} MAD).`);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  // Tasks
  const addTask = (tData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...tData,
      id: 'task_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);

    // Update project task counts if linked
    if (newTask.projectId) {
      setProjects((prev) =>
        prev.map((p) => (p.id === newTask.projectId ? { ...p, tasksCount: p.tasksCount + 1 } : p))
      );
    }
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Documents
  const addDocument = (docData: Omit<BusinessDocument, 'id' | 'uploadedAt'>) => {
    const newDoc: BusinessDocument = {
      ...docData,
      id: 'doc_' + Date.now(),
      uploadedAt: new Date().toISOString(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    addAuditLog('Ajout Document', 'Document', newDoc.id, newDoc.title, `Fichier ${newDoc.fileName} ajouté.`);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Automations
  const toggleAutomation = (id: string) => {
    setAutomations((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // AI Assistant Chat Method
  const sendAiMessage = async (messageText: string) => {
    const userMsg: AiChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      // Assemble dynamic contextual summary for Moroccan business grounding
      const contextData = {
        organization: {
          name: currentOrg.name,
          legalForm: currentOrg.legalForm,
          ice: currentOrg.ice,
          city: currentOrg.city,
          currency: 'MAD',
        },
        financialSummary: {
          totalRevenueMAD: invoices.reduce((acc, i) => acc + (i.status !== 'cancelled' ? i.totalTTC : 0), 0),
          unpaidInvoicesCount: invoices.filter((i) => i.balanceDue > 0).length,
          unpaidInvoicesTotalMAD: invoices.reduce((acc, i) => acc + i.balanceDue, 0),
          totalExpensesMAD: expenses.reduce((acc, e) => acc + e.totalTTC, 0),
          availableBankCashMAD: bankAccounts.reduce((acc, b) => acc + b.currentBalance, 0),
        },
        urgentAlerts: {
          overdueInvoices: invoices
            .filter((i) => i.status === 'overdue')
            .map((i) => ({ number: i.invoiceNumber, customer: i.customerName, due: i.balanceDue, dueDate: i.dueDate })),
          lowStockProducts: products.filter((p) => p.type === 'product' && p.currentStock <= p.minStockAlert),
          activeProjects: projects.filter((p) => p.status === 'in_progress').map((p) => ({ name: p.name, budget: p.budgetMAD, progress: p.progressPercent })),
        },
      };

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, contextData, language }),
      });

      const data = await res.json();
      const responseText = data.response || 'Je suis à votre disposition pour analyser vos données d’entreprise.';

      const aiMsg: AiChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };

      setAiMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('AI chat failed:', err);
      const errorMsg: AiChatMessage = {
        id: 'ai_err_' + Date.now(),
        sender: 'ai',
        text: "Désolé, une erreur est survenue lors de l'appel au service d'analyse IA.",
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setAiMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI OCR Extraction Method
  const processOcrExtraction = async (base64: string, mimeType?: string): Promise<AiExtractedInvoice | null> => {
    try {
      const res = await fetch('/api/ai/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: mimeType || 'image/jpeg' }),
      });
      const data = await res.json();
      return data.extracted || null;
    } catch (e) {
      console.error('OCR Extraction error:', e);
      return null;
    }
  };

  const resetToDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCustomers(INITIAL_CUSTOMERS);
    setOpportunities(INITIAL_OPPORTUNITIES);
    setProducts(INITIAL_PRODUCTS);
    setWarehouses(INITIAL_WAREHOUSES);
    setStockMovements(INITIAL_STOCK_MOVEMENTS);
    setQuotes(INITIAL_QUOTES);
    setInvoices(INITIAL_INVOICES);
    setPayments(INITIAL_PAYMENTS);
    setSuppliers(INITIAL_SUPPLIERS);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setExpenses(INITIAL_EXPENSES);
    setBankAccounts(INITIAL_BANK_ACCOUNTS);
    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    setDocuments(INITIAL_DOCUMENTS);
    setAutomations(INITIAL_AUTOMATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    addAuditLog('Réinitialisation Base', 'System', 'all', 'Données Démo', 'Base réinitialisée avec les données marocaines.');
  };

  const exportDatabaseJson = () => {
    const fullBackup = {
      exportDate: new Date().toISOString(),
      organization: currentOrg,
      customers,
      opportunities,
      products,
      warehouses,
      stockMovements,
      quotes,
      invoices,
      payments,
      suppliers,
      purchaseOrders,
      expenses,
      bankAccounts,
      projects,
      tasks,
      documents,
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SahlBiz_Backup_${currentOrg.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        language,
        setLanguage,
        t,
        theme,
        setTheme,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        currentOrg,
        setCurrentOrg,
        organizations,
        currentUser,
        setCurrentUser,
        users,
        setUserRole,
        searchQuery,
        setSearchQuery,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        activeModal,
        setActiveModal,
        modalPayload,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        opportunities,
        addOpportunity,
        updateOpportunity,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        warehouses,
        stockMovements,
        recordStockMovement,
        quotes,
        addQuote,
        updateQuote,
        convertQuoteToInvoice,
        invoices,
        addInvoice,
        updateInvoice,
        cancelInvoice,
        payments,
        recordPayment,
        suppliers,
        addSupplier,
        updateSupplier,
        purchaseOrders,
        addPurchaseOrder,
        receivePurchaseOrder,
        expenses,
        addExpense,
        updateExpense,
        approveExpense,
        bankAccounts,
        updateBankAccountBalance,
        projects,
        addProject,
        updateProject,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        documents,
        addDocument,
        deleteDocument,
        automations,
        toggleAutomation,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        auditLogs,
        addAuditLog,
        aiMessages,
        sendAiMessage,
        isAiLoading,
        processOcrExtraction,
        resetToDemoData,
        exportDatabaseJson,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
