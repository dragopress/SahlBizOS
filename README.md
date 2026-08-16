# SahlBiz Business OS 🇲🇦

> **« Piloter. Gérer. Suivre. Analyser. Décider. »**  
> Modern, all-in-one Business Operating System tailored for Moroccan SMEs, TPEs, freelancers, digital agencies, contractors, and growing enterprises.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Business Modules](#key-business-modules)
- [Moroccan Fiscal & Legal Compliance](#moroccan-fiscal--legal-compliance)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Design System & UI/UX](#design-system--uiux)
- [Data Flow & Integration](#data-flow--integration)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API & Backend Architecture](#api--backend-architecture)
- [AI Capabilities](#ai-capabilities)
- [Security & Multi-Tenancy](#security--multi-tenancy)
- [Roadmap & Contributing](#roadmap--contributing)

---

## 🌟 Overview

**SahlBiz Business OS** is a unified multi-tenant SaaS platform built to replace fragmented tools (Excel, separate CRM, disconnected invoicing software, standalone accounting files). It connects every stage of the business lifecycle:

$$\text{Client} \longrightarrow \text{Prospect / Lead} \longrightarrow \text{Devis (Quote)} \longrightarrow \text{Facture (Invoice)} \longrightarrow \text{Encaissement (Payment)} \longrightarrow \text{Trésorerie \& TVA DGI} \longrightarrow \text{Décision AI}$$

---

## 📦 Key Business Modules

### 1. 📊 Executive Dashboard & KPIs
- Real-time **Chiffre d'Affaires HT/TTC**, cash position (Trésorerie disponible), unpaid receivables, and overdue invoices.
- Breakdown of monthly revenue vs. operating expenses with gross margin metrics.
- Active project counters, urgent team tasks, and instant low-stock alerts.
- Quick navigation shortcuts and dynamic date filters.

### 2. 👥 CRM & Customer 360°
- Comprehensive client profiles with Moroccan legal fields: **ICE (15 digits), IF, RC, CNSS, TP**.
- Customer 360° modal with complete timeline: associated quotes, invoices, payments, documents, and active projects.
- Sales pipeline with interactive **Kanban stages** (`Nouveau`, `Qualifié`, `Proposition`, `Négociation`, `Gagné`, `Perdu`).

### 3. 💼 Sales & Commercial Suite
- **Quotation Builder (Devis)**: Multi-line calculation with itemized TVA rates (20%, 14%, 10%, 7%, 0%), discounts, and custom payment terms.
- **One-Click Conversion**: Instant transfer of accepted quotes into validated invoices without re-typing.
- **Invoicing (Facturation)**: Status lifecycle (`Brouillon`, `Envoyée`, `Partiellement payée`, `Payée`, `En retard`, `Annulée`).
- **Payment Recorder**: Partial/full payment tracking, payment methods (Virement, Chèque, Espèces, Effet), and automatic invoice balance adjustment.
- **Print & PDF Engine**: Moroccan-compliant invoice/quote templates with company letterhead, ICE/IF/RC, and legal disclaimers.

### 4. 📦 Products, Services & Multi-Warehouse Inventory
- Product catalog supporting both physical goods (with stock thresholds) and digital services.
- Multi-warehouse support (**Casablanca Principal**, **Tanger Logistique**).
- Traceable stock movements (`Achat`, `Vente`, `Ajustement`, `Retour`, `Transfert`) with automatic stock validation.

### 5. 🛒 Procurement & Supplier Management
- Supplier directory with tax identifiers and contact details.
- **Purchase Orders (Bons de Commande Fournisseur)**: Create, send, and receive purchase orders with automatic stock incrementing.
- **Expense Logging**: Categorized operational charges (Loyer, Salaires, Télécoms, Fournitures, Déplacements) with DGI TVA recuperation tags.

### 6. 🏦 Treasury & Cash Management
- Moroccan bank account cards with 24-digit **RIB verification & one-click copy** (Attijariwafa bank, Banque Populaire, BMCE Bank of Africa, CIH Bank).
- **Cash Flow Forecast**: 30, 60, and 90-day liquidity projections correlating receivables and scheduled expenses.
- Complete chronological cash-flow ledger.

### 7. 📁 Operations, Tasks & Projects
- Project budget tracking, progress bars, and profit margins.
- **Task Management**: Interactive Kanban board (`À Faire`, `En Cours`, `En Révision`, `Terminée`) and list view with priority badges and assignee filters.
- **Unified Calendar**: Aggregates invoice due dates, task deadlines, project deliveries, and quote validity windows.

### 8. 📂 Digital Document Storage & Compliance (GED)
- Secure document repository categorized by type (`Contrats & Accords`, `Factures Fournisseurs`, `Fiscalité & DGI`, `RC & ICE Modèle J`, `Paie & CNSS`).
- Tag indexing and direct linkage to specific customers or projects.

### 9. 📈 Financial Reports & Business Intelligence
- **Sales Analytics**: Revenue trends, quote conversion rates, and Top 5 Customers by volume.
- **P&L / Compte de Résultat**: Revenue HT vs. Expenses HT with operational profit margins.
- **Balance Âgée des Créances**: Unpaid receivables categorized into 0–30 days, 31–60 days, 61–90 days, and >90 days overdue.
- **Custom Report Builder**: Dynamic query generator with instant CSV export and print preview.

### 10. ⚡ Smart Workflow Automation
- Rule-based engine structured as:  
  $$\text{WHEN (Trigger)} \longrightarrow \text{IF (Condition)} \longrightarrow \text{THEN (Action)}$$
- Supported triggers: Overdue invoices, accepted quotes, low stock levels, received payments, and overdue tasks.
- Supported actions: Automatic email reminders, WhatsApp notifications, follow-up task assignments, and manager alerts.

### 11. 🤖 AI Business Assistant & Smart OCR
- Natural language analysis of sales, cash flow, overdue accounts, and customer profitability.
- **AI OCR Document Scanner**: Extracts supplier names, ICE, invoice numbers, dates, TVA breakdowns, and line items directly from supplier receipts and invoices.

---

## 🇲🇦 Moroccan Fiscal & Legal Compliance

| Requirement | Implementation in SahlBiz |
|---|---|
| **Currency** | Moroccan Dirham (`MAD` / `د.م.`) with locale-aware formatters |
| **Bilingualism & RTL** | Native French (`FR`) and Arabic (`AR`) with full Right-to-Left (RTL) layout mirroring |
| **Legal Identifiers** | Mandatory tracking of **ICE** (Identifiant Commun de l’Entreprise - 15 chiffres), **IF** (Identifiant Fiscal), **RC** (Registre du Commerce), **CNSS**, and **TP** (Taxe Professionnelle) |
| **VAT Framework (TVA DGI)** | Real-time calculation sheets for standard Moroccan rates: **20%** (Normal), **14%** (BTP & Énergie), **10%** (Hôtellerie/Banques), **7%** (Produits de base), and **0%** (Exonéré Art. 91 CGI) |
| **Banking Standards** | Standardized 24-digit Moroccan **RIB** verification (Code Banque 3 + Code Ville 3 + N° Compte 16 + Clé 2) |

---

## 🛠️ Architecture & Tech Stack

```
sahlbiz/
├── src/
│   ├── components/
│   │   ├── ai/            # Gemini Assistant, AI Insights & OCR Scanner
│   │   ├── automation/    # Workflow Automation Rules & Builder
│   │   ├── banking/       # Moroccan Bank Cards & Cash Flow Forecasting
│   │   ├── calendar/      # Unified Commercial & Operational Calendar
│   │   ├── crm/           # Customers, Leads, Opportunities & Customer 360
│   │   ├── dashboard/     # Executive Dashboard & KPI Metrics
│   │   ├── documents/     # Digital Document Storage (GED) & File Uploads
│   │   ├── layout/        # AppShell, Navigation, Activity Drawer & Palette
│   │   ├── products/      # Inventory, Warehouses & Stock Movements
│   │   ├── projects/      # Project Tracking & Profitability
│   │   ├── purchases/     # Suppliers, Purchase Orders & Expenses
│   │   ├── reports/       # Sales BI, P&L, Aging Balance & Custom Builder
│   │   ├── sales/         # Quotes, Invoices, Payments & Print Engine
│   │   ├── settings/      # Organization, Users, Roles & Localization
│   │   └── tax/           # Moroccan DGI VAT Report & Calculation Sheets
│   ├── context/
│   │   └── AppContext.tsx # Centralized State Management & Multi-Tenant Store
│   ├── data/
│   │   └── initialData.ts # Moroccan Business Seed Dataset (Atlas Digital SARL)
│   ├── utils/
│   │   ├── formatters.ts  # MAD Currency, Number & Date Helpers
│   │   ├── taxCalculator.ts# Moroccan DGI Tax Engines (HT / TVA / TTC)
│   │   └── translations.ts# French & Arabic Localization Strings
│   ├── types.ts           # Enterprise TypeScript Definitions & Enums
│   ├── App.tsx            # Main Application View Routing & Modal Mounts
│   └── main.tsx           # React DOM Entry
├── server.ts              # Express API Server & Gemini Proxy
├── package.json           # Node.js Dependencies & Build Scripts
└── vite.config.ts         # Vite Configuration & Plugins
```

### Core Technologies
- **Frontend**: React 18+, TypeScript, Tailwind CSS, Lucide Icons, Motion.
- **Backend / API**: Express, Node.js, RESTful Endpoints.
- **AI Engine**: `@google/genai` (Gemini API server-side integration for conversational business insights & OCR extraction).
- **Design Archetype**: Dark Luxury Minimalism with `#080808` canvas, `#0C0C0C` panels, high-contrast typography, and monospace financial alignment.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/sahlbiz.git
   cd sahlbiz
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file based on `.env.example`:
   ```env
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here
   NODE_ENV=development
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 🔒 Security & Multi-Tenancy

- **Strict Tenant Isolation**: Every business entity (`Customer`, `Invoice`, `Quote`, `Expense`, `Project`, `Document`) is scoped to an `organizationId`.
- **Role-Based Access Control (RBAC)**: Granular permissions for roles:
  - `Owner`: Full organizational control and financial configuration.
  - `Administrator`: User management and operational setup.
  - `Manager`: CRM, project planning, and commercial validation.
  - `Accountant`: Invoicing, payments, tax declarations, and banking reconciliation.
  - `Sales`: Leads, opportunities, customer contacts, and quotes.
  - `Employee`: Assigned tasks, timesheets, and document uploads.
- **Secure Financial Calculations**: All VAT and discount calculations are executed using deterministic decimal rounding to avoid floating-point errors.
- **API Secret Security**: Server-side proxy for AI calls prevents exposure of API keys in browser network inspectors.

---

## 🌐 Localization & RTL Support

SahlBiz is built from the ground up for the Moroccan market:
- **French (`FR`)**: Standard business French used in Moroccan commercial law.
- **Arabic (`AR`)**: Comprehensive Arabic interface with genuine Right-to-Left (RTL) layout adaptation, directional icon adjustments, and mirrored table columns.

Toggle languages dynamically from the top navigation bar or settings view.

---

## 📄 License

Proprietary — Developed for Moroccan Enterprise Operations. All rights reserved.
