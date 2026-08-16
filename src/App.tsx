import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { CustomersView } from './components/crm/CustomersView';
import { LeadsPipelineView } from './components/crm/LeadsPipelineView';
import { QuotesView } from './components/sales/QuotesView';
import { InvoicesView } from './components/sales/InvoicesView';
import { PaymentsView } from './components/sales/PaymentsView';
import { ProductsView } from './components/products/ProductsView';
import { InventoryMovementsView } from './components/products/InventoryMovementsView';
import { SuppliersView } from './components/purchases/SuppliersView';
import { PurchaseOrdersView } from './components/purchases/PurchaseOrdersView';
import { ExpensesView } from './components/purchases/ExpensesView';
import { BankingView } from './components/banking/BankingView';
import { ProjectsView } from './components/projects/ProjectsView';
import { TasksView } from './components/tasks/TasksView';
import { CalendarView } from './components/calendar/CalendarView';
import { DocumentsView } from './components/documents/DocumentsView';
import { ReportsView } from './components/reports/ReportsView';
import { AutomationView } from './components/automation/AutomationView';
import { TaxReportView } from './components/tax/TaxReportView';
import { AiAssistantView } from './components/ai/AiAssistantView';
import { SettingsView } from './components/settings/SettingsView';

// Modals
import { CustomerBuilderModal } from './components/crm/CustomerBuilderModal';
import { CustomerDetailModal } from './components/crm/CustomerDetailModal';
import { OpportunityBuilderModal } from './components/crm/OpportunityBuilderModal';
import { QuoteBuilderModal } from './components/sales/QuoteBuilderModal';
import { InvoiceBuilderModal } from './components/sales/InvoiceBuilderModal';
import { InvoicePrintModal } from './components/sales/InvoicePrintModal';
import { PaymentRecorderModal } from './components/sales/PaymentRecorderModal';
import { ProductBuilderModal } from './components/products/ProductBuilderModal';
import { StockMovementModal } from './components/products/StockMovementModal';
import { SupplierBuilderModal } from './components/purchases/SupplierBuilderModal';
import { PurchaseOrderBuilderModal } from './components/purchases/PurchaseOrderBuilderModal';
import { ExpenseBuilderModal } from './components/purchases/ExpenseBuilderModal';
import { ProjectBuilderModal } from './components/projects/ProjectBuilderModal';
import { TaskBuilderModal } from './components/tasks/TaskBuilderModal';
import { DocumentUploadModal } from './components/documents/DocumentUploadModal';
import { AutomationRuleBuilderModal } from './components/automation/AutomationRuleBuilderModal';
import { OcrScannerModal } from './components/ai/OcrScannerModal';

const AppContent: React.FC = () => {
  const { currentView, activeModal, modalPayload, setActiveModal } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'customers':
        return <CustomersView />;
      case 'leads':
        return <LeadsPipelineView />;
      case 'quotes':
        return <QuotesView />;
      case 'invoices':
        return <InvoicesView />;
      case 'payments':
        return <PaymentsView />;
      case 'products':
        return <ProductsView />;
      case 'inventory':
        return <InventoryMovementsView />;
      case 'suppliers':
        return <SuppliersView />;
      case 'purchases':
        return <PurchaseOrdersView />;
      case 'expenses':
        return <ExpensesView />;
      case 'bank_accounts':
        return <BankingView initialTab="accounts" />;
      case 'cashflow':
        return <BankingView initialTab="forecast" />;
      case 'projects':
        return <ProjectsView />;
      case 'tasks':
        return <TasksView />;
      case 'calendar':
        return <CalendarView />;
      case 'documents':
        return <DocumentsView />;
      case 'reports':
        return <ReportsView />;
      case 'automation':
        return <AutomationView />;
      case 'tax_report':
        return <TaxReportView />;
      case 'ai_assistant':
        return <AiAssistantView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <AppShell>
      {renderView()}

      {/* CRM Modals */}
      <CustomerBuilderModal
        isOpen={activeModal === 'new_customer' || activeModal === 'edit_customer'}
        onClose={() => setActiveModal(null)}
        initialCustomer={activeModal === 'edit_customer' ? modalPayload : null}
      />
      <CustomerDetailModal
        isOpen={activeModal === 'customer_detail'}
        onClose={() => setActiveModal(null)}
        customer={modalPayload}
      />
      <OpportunityBuilderModal
        isOpen={activeModal === 'new_opportunity'}
        onClose={() => setActiveModal(null)}
      />

      {/* Sales & Invoicing Modals */}
      <QuoteBuilderModal
        isOpen={activeModal === 'new_quote' || activeModal === 'edit_quote'}
        onClose={() => setActiveModal(null)}
        initialQuote={activeModal === 'edit_quote' ? modalPayload : null}
      />
      <InvoiceBuilderModal
        isOpen={activeModal === 'new_invoice' || activeModal === 'edit_invoice'}
        onClose={() => setActiveModal(null)}
        initialInvoice={activeModal === 'edit_invoice' ? modalPayload : null}
      />
      <InvoicePrintModal
        isOpen={activeModal === 'invoice_print' || activeModal === 'quote_print'}
        onClose={() => setActiveModal(null)}
        document={modalPayload}
        type={activeModal === 'quote_print' ? 'quote' : 'invoice'}
      />
      <PaymentRecorderModal
        isOpen={activeModal === 'record_payment' || activeModal === 'new_payment'}
        onClose={() => setActiveModal(null)}
        invoice={modalPayload}
      />

      {/* Products & Inventory Modals */}
      <ProductBuilderModal
        isOpen={activeModal === 'new_product' || activeModal === 'edit_product'}
        onClose={() => setActiveModal(null)}
        initialProduct={activeModal === 'edit_product' ? modalPayload : null}
      />
      <StockMovementModal
        isOpen={activeModal === 'stock_movement'}
        onClose={() => setActiveModal(null)}
      />

      {/* Purchases, Suppliers & Expenses Modals */}
      <SupplierBuilderModal
        isOpen={activeModal === 'new_supplier' || activeModal === 'edit_supplier'}
        onClose={() => setActiveModal(null)}
        initialSupplier={activeModal === 'edit_supplier' ? modalPayload : null}
      />
      <PurchaseOrderBuilderModal
        isOpen={activeModal === 'new_purchase_order'}
        onClose={() => setActiveModal(null)}
      />
      <ExpenseBuilderModal
        isOpen={activeModal === 'new_expense'}
        onClose={() => setActiveModal(null)}
      />

      {/* Operations, Tasks & Projects Modals */}
      <ProjectBuilderModal
        isOpen={activeModal === 'new_project'}
        onClose={() => setActiveModal(null)}
      />
      <TaskBuilderModal
        isOpen={activeModal === 'new_task'}
        onClose={() => setActiveModal(null)}
      />

      {/* Documents & Automation Modals */}
      <DocumentUploadModal
        isOpen={activeModal === 'upload_document'}
        onClose={() => setActiveModal(null)}
      />
      <AutomationRuleBuilderModal
        isOpen={activeModal === 'new_automation_rule'}
        onClose={() => setActiveModal(null)}
      />

      {/* AI OCR Scanner */}
      <OcrScannerModal
        isOpen={activeModal === 'ai_ocr'}
        onClose={() => setActiveModal(null)}
      />
    </AppShell>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
