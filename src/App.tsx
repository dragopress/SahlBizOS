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
import { ExpensesView } from './components/purchases/ExpensesView';
import { ProjectsView } from './components/projects/ProjectsView';
import { BankingView } from './components/banking/BankingView';
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
import { ExpenseBuilderModal } from './components/purchases/ExpenseBuilderModal';
import { OcrScannerModal } from './components/ai/OcrScannerModal';
import { ProjectBuilderModal } from './components/projects/ProjectBuilderModal';

const AppContent: React.FC = () => {
  const { currentView, activeModal, modalData, setActiveModal } = useApp();

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
      case 'expenses':
        return <ExpensesView />;
      case 'projects':
        return <ProjectsView />;
      case 'banking':
        return <BankingView />;
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
        initialCustomer={activeModal === 'edit_customer' ? modalData : null}
      />
      <CustomerDetailModal
        isOpen={activeModal === 'customer_detail'}
        onClose={() => setActiveModal(null)}
        customer={modalData}
      />
      <OpportunityBuilderModal
        isOpen={activeModal === 'new_opportunity'}
        onClose={() => setActiveModal(null)}
      />

      {/* Sales & Invoicing Modals */}
      <QuoteBuilderModal
        isOpen={activeModal === 'new_quote' || activeModal === 'edit_quote'}
        onClose={() => setActiveModal(null)}
        initialQuote={activeModal === 'edit_quote' ? modalData : null}
      />
      <InvoiceBuilderModal
        isOpen={activeModal === 'new_invoice' || activeModal === 'edit_invoice'}
        onClose={() => setActiveModal(null)}
        initialInvoice={activeModal === 'edit_invoice' ? modalData : null}
      />
      <InvoicePrintModal
        isOpen={activeModal === 'invoice_print' || activeModal === 'quote_print'}
        onClose={() => setActiveModal(null)}
        document={modalData}
        type={activeModal === 'quote_print' ? 'quote' : 'invoice'}
      />
      <PaymentRecorderModal
        isOpen={activeModal === 'record_payment'}
        onClose={() => setActiveModal(null)}
        invoice={modalData}
      />

      {/* Products & Inventory Modals */}
      <ProductBuilderModal
        isOpen={activeModal === 'new_product' || activeModal === 'edit_product'}
        onClose={() => setActiveModal(null)}
        initialProduct={activeModal === 'edit_product' ? modalData : null}
      />
      <StockMovementModal
        isOpen={activeModal === 'stock_movement'}
        onClose={() => setActiveModal(null)}
      />

      {/* Purchases & Expenses Modals */}
      <SupplierBuilderModal
        isOpen={activeModal === 'new_supplier' || activeModal === 'edit_supplier'}
        onClose={() => setActiveModal(null)}
        initialSupplier={activeModal === 'edit_supplier' ? modalData : null}
      />
      <ExpenseBuilderModal
        isOpen={activeModal === 'new_expense'}
        onClose={() => setActiveModal(null)}
      />

      {/* AI OCR Scanner */}
      <OcrScannerModal
        isOpen={activeModal === 'ai_ocr'}
        onClose={() => setActiveModal(null)}
      />

      {/* Projects Modal */}
      <ProjectBuilderModal
        isOpen={activeModal === 'new_project'}
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
