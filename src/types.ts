export type Language = 'fr' | 'ar' | 'en';

export type MoroccanTvaRate = 20 | 14 | 10 | 7 | 0;

export type MoroccanPaymentMethod =
  | 'Virement bancaire'
  | 'Carte bancaire CMI'
  | 'Chèque'
  | 'Espèces'
  | 'Prélèvement'
  | 'LCN (Effet de commerce)';

export type InvoiceItem = LineItem;

export type UserRole = 
  | 'owner' 
  | 'admin' 
  | 'manager' 
  | 'accountant' 
  | 'sales' 
  | 'employee' 
  | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  department?: string;
  organizationId: string;
  active: boolean;
}

export type MoroccanLegalForm = 
  | 'SARL' 
  | 'SARL-AU' 
  | 'SA' 
  | 'SAS' 
  | 'Auto-entrepreneur' 
  | 'Profession libérale' 
  | 'Succursale'
  | 'SNC';

export interface Organization {
  id: string;
  name: string;
  legalForm: MoroccanLegalForm;
  ice: string;          // 15 digits Identifiant Commun de l'Entreprise
  if_: string;         // Identifiant Fiscal
  rc: string;          // Registre de Commerce
  rcCity: string;      // Tribunal de commerce (Casablanca, Rabat, etc.)
  cnss: string;        // Numéro d'affiliation CNSS
  tp: string;          // Taxe Professionnelle (Patente)
  capital: number;     // Capital social en MAD
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  rib: string;         // Relevé d'Identité Bancaire (24 digits)
  bankName: string;
  logo?: string;
  stampSignature?: string;
  currency: 'MAD' | 'EUR' | 'USD';
  invoicePrefix: string; // e.g. "FA-2026-"
  quotePrefix: string;   // e.g. "DEV-2026-"
  purchasePrefix: string;// e.g. "BC-2026-"
  vatRegistered: boolean;
  defaultVatRate: number; // 20
}

export type CustomerType = 'company' | 'individual';

export interface CustomerContact {
  id: string;
  customerId: string;
  name: string;
  position?: string;
  email?: string;
  phone?: string;
  isPrimary: boolean;
}

export interface Customer {
  id: string;
  organizationId: string;
  type: CustomerType;
  name: string;
  companyName?: string;
  ice?: string;
  if_?: string;
  rc?: string;
  cnss?: string;
  tp?: string;
  address: string;
  city: string;
  postalCode?: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  paymentTerms: string; // "30 jours", "Comptant", "60 jours fin de mois"
  creditLimitMAD: number;
  assignedTo?: string; // User ID
  assignedToName?: string;
  tags: string[];
  notes?: string;
  balanceDueMAD: number;
  totalBilledMAD: number;
  status: 'active' | 'inactive' | 'prospect';
  contacts: CustomerContact[];
  createdAt: string;
}

export type OpportunityStage = 
  | 'lead' 
  | 'qualified' 
  | 'proposal' 
  | 'negotiation' 
  | 'won' 
  | 'lost';

export interface Opportunity {
  id: string;
  organizationId: string;
  title: string;
  customerId?: string;
  customerName: string;
  stage: OpportunityStage;
  expectedRevenueMAD: number;
  probabilityPercent: number;
  expectedCloseDate: string;
  ownerId: string;
  ownerName: string;
  notes?: string;
  tags: string[];
  quoteId?: string;
  createdAt: string;
}

export type ItemType = 'product' | 'service';

export interface Product {
  id: string;
  organizationId: string;
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  category: string;
  type: ItemType;
  purchasePriceHT: number;
  sellingPriceHT: number;
  tvaRate: number; // 20, 14, 10, 7, 0
  unit: string;    // 'Unité', 'Heure', 'Jour', 'Forfait', 'Kg', 'Mètre'
  currentStock: number;
  minStockAlert: number;
  warehouseId?: string;
  warehouseName?: string;
  supplierId?: string;
  supplierName?: string;
  active: boolean;
  imageUrl?: string;
}

export interface Warehouse {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  city: string;
  address: string;
  managerName?: string;
}

export type StockMovementType = 'purchase' | 'sale' | 'adjustment' | 'transfer' | 'return';

export interface StockMovement {
  id: string;
  organizationId: string;
  productId: string;
  productName: string;
  type: StockMovementType;
  quantity: number; // positive or negative
  previousStock: number;
  newStock: number;
  referenceDocument?: string; // "FA-2026-0012", "BC-2026-0004"
  warehouseId: string;
  warehouseName: string;
  reason: string;
  userName: string;
  date: string;
}

export interface LineItem {
  id: string;
  productId?: string;
  sku?: string;
  description: string;
  quantity: number;
  unit: string;
  unitPriceHT: number;
  discountPercent: number;
  tvaRate: number; // 20, 14, 10, 7, 0
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
}

export type QuoteStatus = 
  | 'draft' 
  | 'sent' 
  | 'viewed' 
  | 'accepted' 
  | 'rejected' 
  | 'expired' 
  | 'converted';

export interface Quote {
  id: string;
  organizationId: string;
  quoteNumber: string; // "DEV-2026-0042"
  customerId: string;
  customerName: string;
  customerICE?: string;
  customerAddress?: string;
  customerCity?: string;
  date: string;
  validUntil: string;
  items: LineItem[];
  subtotalHT: number;
  discountAmount: number;
  discountPercent: number;
  tvaDetails: { rate: number; baseHT: number; amount: number }[];
  totalTVA: number;
  totalTTC: number;
  status: QuoteStatus;
  notes?: string;
  terms?: string;
  convertedToInvoiceId?: string;
  convertedToInvoiceNumber?: string;
  createdBy: string;
  createdAt: string;
}

export type InvoiceStatus = 
  | 'draft' 
  | 'sent' 
  | 'partially_paid' 
  | 'paid' 
  | 'overdue' 
  | 'cancelled';

export interface Invoice {
  id: string;
  organizationId: string;
  invoiceNumber: string; // "FA-2026-0089"
  quoteId?: string;
  quoteNumber?: string;
  customerId: string;
  customerName: string;
  customerICE?: string;
  customerIF?: string;
  customerRC?: string;
  customerAddress?: string;
  customerCity?: string;
  date: string;
  dueDate: string;
  items: LineItem[];
  subtotalHT: number;
  discountAmount: number;
  discountPercent: number;
  tvaDetails: { rate: number; baseHT: number; amount: number }[];
  totalTVA: number;
  totalTTC: number;
  amountPaid: number;
  balanceDue: number;
  status: InvoiceStatus;
  paymentTerms: string;
  notes?: string;
  legalMentions?: string;
  payments: string[]; // Payment IDs
  createdAt: string;
}

export type PaymentMethod = 
  | 'bank_transfer' // Virement
  | 'check'         // Chèque
  | 'cash'          // Espèces
  | 'commercial_bill' // Effet de commerce / LCN
  | 'card';         // Carte bancaire

export interface Payment {
  id: string;
  organizationId: string;
  paymentNumber: string; // "PAI-2026-0120"
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  reference?: string; // Virement ref / receipt ref
  checkNumber?: string;
  checkDueDate?: string;
  checkBank?: string;
  bankAccountId: string;
  bankAccountName: string;
  notes?: string;
  recordedBy: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  organizationId: string;
  name: string;
  ice?: string;
  if_?: string;
  rc?: string;
  tp?: string;
  contactPerson?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  paymentTerms: string;
  category: string;
  currentBalanceMAD: number;
  notes?: string;
  createdAt: string;
}

export type PurchaseOrderStatus = 
  | 'draft' 
  | 'sent' 
  | 'received' 
  | 'billed' 
  | 'cancelled';

export interface PurchaseOrder {
  id: string;
  organizationId: string;
  orderNumber: string; // "BC-2026-0034"
  supplierId: string;
  supplierName: string;
  date: string;
  expectedDeliveryDate: string;
  items: LineItem[];
  subtotalHT: number;
  totalTVA: number;
  totalTTC: number;
  status: PurchaseOrderStatus;
  notes?: string;
  createdAt: string;
}

export type ExpenseCategory = 
  | 'Loyer & Charges'
  | 'Salaires & CNSS'
  | 'Transport & Carburant'
  | 'Télécommunications & Fibre'
  | 'Énergie ONEE & Eau'
  | 'Fournitures & Bureautique'
  | 'Marketing & Publicité'
  | 'Honoraires & Comptabilité'
  | 'Matériel & Équipement'
  | 'Impôts & Taxes'
  | 'Autre';

export type ExpenseStatus = 'submitted' | 'approved' | 'paid' | 'rejected';

export interface Expense {
  id: string;
  organizationId: string;
  expenseNumber: string; // "DEP-2026-0105"
  title: string;
  category: ExpenseCategory;
  supplierId?: string;
  supplierName: string;
  supplierICE?: string;
  invoiceNumber?: string;
  amountHT: number;
  tvaRate: number;
  tvaAmount: number;
  totalTTC: number;
  date: string;
  paymentMethod: PaymentMethod;
  bankAccountId?: string;
  status: ExpenseStatus;
  receiptUrl?: string;
  projectId?: string;
  projectName?: string;
  approvedBy?: string;
  submittedBy: string;
  createdAt: string;
}

export interface BankAccount {
  id: string;
  organizationId: string;
  bankName: string; // Attijariwafa bank, Banque Populaire, BMCE BOA, CIH, etc.
  accountName: string;
  accountNumber: string;
  rib: string; // 24 digits
  iban?: string;
  swift?: string;
  currency: 'MAD' | 'EUR' | 'USD';
  currentBalance: number;
  accountType: 'bank' | 'cash' | 'currency';
}

export type ProjectStatus = 'planned' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';

export interface Project {
  id: string;
  organizationId: string;
  code: string; // "PRJ-2026-01"
  name: string;
  description?: string;
  customerId: string;
  customerName: string;
  managerId: string;
  managerName: string;
  budgetMAD: number;
  spentMAD: number;
  billedMAD: number;
  progressPercent: number;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  teamMembers: { id: string; name: string; role: string }[];
  tasksCount: number;
  completedTasksCount: number;
  createdAt: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';

export interface Task {
  id: string;
  organizationId: string;
  title: string;
  description?: string;
  projectId?: string;
  projectName?: string;
  customerId?: string;
  customerName?: string;
  assigneeId: string;
  assigneeName: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  estimatedHours?: number;
  actualHours?: number;
  labels: string[];
  createdAt: string;
}

export type DocumentCategory = 
  | 'contracts' 
  | 'invoices_in' 
  | 'quotes_signed' 
  | 'tax_legal' 
  | 'company_status' 
  | 'payroll' 
  | 'other';

export interface BusinessDocument {
  id: string;
  organizationId: string;
  title: string;
  category: DocumentCategory;
  fileName: string;
  fileSize: string;
  fileType: string;
  relatedEntity?: 'customer' | 'project' | 'supplier' | 'invoice';
  relatedEntityId?: string;
  relatedEntityName?: string;
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
  downloadUrl?: string;
}

export type AutomationTrigger = 
  | 'invoice_overdue' 
  | 'quote_accepted' 
  | 'stock_low' 
  | 'payment_received' 
  | 'lead_won'
  | 'task_overdue';

export type AutomationAction = 
  | 'send_email_reminder' 
  | 'send_whatsapp_template' 
  | 'create_followup_task' 
  | 'notify_manager' 
  | 'auto_create_invoice';

export interface AutomationRule {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  conditionField: string;
  conditionOperator: 'equals' | 'greater_than' | 'less_than' | 'contains';
  conditionValue: string | number;
  action: AutomationAction;
  actionPayload: Record<string, any>;
  active: boolean;
  executionCount: number;
  lastExecutedAt?: string;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  entityName: string;
  timestamp: string;
  details: string;
}

export interface BusinessNotification {
  id: string;
  organizationId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  date: string;
  read: boolean;
  link?: string;
  category?: 'invoice' | 'payment' | 'quote' | 'task' | 'stock';
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionSuggestions?: { label: string; action: string; payload?: any }[];
}

export interface AiExtractedInvoice {
  supplierName: string;
  supplierICE?: string;
  supplierIF?: string;
  invoiceNumber: string;
  date: string;
  amountHT: number;
  tvaRate: number;
  tvaAmount: number;
  totalTTC: number;
  category: ExpenseCategory;
  confidenceScore: number;
  items?: { description: string; quantity: number; unitPrice: number; total: number }[];
}
