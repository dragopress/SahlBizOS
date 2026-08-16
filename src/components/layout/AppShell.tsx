import React, { useState } from 'react';
import { useApp, NavView } from '../../context/AppContext';
import { UserRole, Language } from '../../types';
import {
  LayoutDashboard,
  Users,
  Target,
  FileSpreadsheet,
  FileCheck2,
  CreditCard,
  Package,
  Boxes,
  Truck,
  ShoppingCart,
  Receipt,
  Landmark,
  TrendingUp,
  FolderKanban,
  CheckSquare,
  CalendarDays,
  FolderArchive,
  BarChart3,
  Cpu,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  Bell,
  Search,
  Plus,
  Moon,
  Sun,
  Globe,
  ShieldCheck,
  Building2,
  ScanLine,
  ChevronDown,
  RefreshCw,
  Download,
  Check,
} from 'lucide-react';
import { CommandPalette } from './CommandPalette';
import { NotificationDrawer } from './NotificationDrawer';

interface NavItem {
  id: NavView;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
  roles?: UserRole[];
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
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
    setUserRole,
    setIsCommandPaletteOpen,
    setActiveModal,
    invoices,
    tasks,
    notifications,
    resetToDemoData,
    exportDatabaseJson,
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Dynamic counts for live badges
  const overdueInvoicesCount = invoices.filter((i) => i.status === 'overdue').length;
  const pendingTasksCount = tasks.filter((t) => t.status === 'todo' || t.status === 'in_progress').length;
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const navGroups: NavGroup[] = [
    {
      groupName: language === 'ar' ? 'الرئيسية والذكاء الاصطناعي' : 'Principal & IA',
      items: [
        { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
        {
          id: 'ai_assistant',
          label: t.aiAssistant,
          icon: Sparkles,
          badge: 'Gemini 3.7',
          badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
        },
      ],
    },
    {
      groupName: language === 'ar' ? 'العلاقات التجارية CRM' : 'CRM & Pipeline',
      items: [
        { id: 'customers', label: t.customers, icon: Users },
        { id: 'leads', label: t.leadsPipeline, icon: Target },
      ],
    },
    {
      groupName: language === 'ar' ? 'المبيعات والفوترة MAD' : 'Ventes & Facturation',
      items: [
        { id: 'quotes', label: t.quotes, icon: FileSpreadsheet },
        {
          id: 'invoices',
          label: t.invoices,
          icon: FileCheck2,
          badge: overdueInvoicesCount > 0 ? overdueInvoicesCount : undefined,
          badgeColor: 'bg-red-500 text-white font-bold',
        },
        { id: 'payments', label: t.payments, icon: CreditCard },
      ],
    },
    {
      groupName: language === 'ar' ? 'المنتجات والمخزون' : 'Catalogue & Stocks',
      items: [
        { id: 'products', label: t.productsServices, icon: Package },
        { id: 'inventory', label: t.inventory, icon: Boxes },
      ],
    },
    {
      groupName: language === 'ar' ? 'المشتريات والموردون' : 'Achats & Fournisseurs',
      items: [
        { id: 'suppliers', label: t.suppliers, icon: Truck },
        { id: 'purchases', label: t.purchaseOrders, icon: ShoppingCart },
      ],
    },
    {
      groupName: language === 'ar' ? 'المالية والخزينة' : 'Finance & Trésorerie',
      items: [
        { id: 'expenses', label: t.expenses, icon: Receipt },
        { id: 'bank_accounts', label: t.bankAccounts, icon: Landmark },
        { id: 'cashflow', label: t.cashflow, icon: TrendingUp },
      ],
    },
    {
      groupName: language === 'ar' ? 'العمليات والمشاريع' : 'Opérations & Projets',
      items: [
        { id: 'projects', label: t.projects, icon: FolderKanban },
        {
          id: 'tasks',
          label: t.tasks,
          icon: CheckSquare,
          badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
          badgeColor: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200',
        },
        { id: 'calendar', label: t.calendar, icon: CalendarDays },
      ],
    },
    {
      groupName: language === 'ar' ? 'التحليل والأتمتة' : 'Intelligence & Outils',
      items: [
        { id: 'documents', label: t.documents, icon: FolderArchive },
        { id: 'reports', label: t.reports, icon: BarChart3 },
        { id: 'automation', label: t.automation, icon: Cpu },
        { id: 'settings', label: t.settings, icon: Settings },
      ],
    },
  ];

  const roleOptions: { role: UserRole; label: string }[] = [
    { role: 'owner', label: t.owner },
    { role: 'admin', label: t.admin },
    { role: 'manager', label: t.manager },
    { role: 'accountant', label: t.accountant },
    { role: 'sales', label: t.salesRole },
    { role: 'employee', label: t.employee },
    { role: 'viewer', label: t.viewer },
  ];

  const quickActions = [
    { label: t.newInvoice, icon: FileCheck2, action: () => setActiveModal('new_invoice') },
    { label: t.newQuote, icon: FileSpreadsheet, action: () => setActiveModal('new_quote') },
    { label: t.newCustomer, icon: Users, action: () => setActiveModal('new_customer') },
    { label: t.newPayment, icon: CreditCard, action: () => setActiveModal('new_payment') },
    { label: t.newExpense, icon: Receipt, action: () => setActiveModal('new_expense') },
    { label: t.newTask, icon: CheckSquare, action: () => setActiveModal('new_task') },
    { label: t.newProject, icon: FolderKanban, action: () => setActiveModal('new_project') },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-[#D4D4D8] flex flex-col font-sans selection:bg-white/20 selection:text-white">
      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette />

      {/* Flyout Notification Drawer */}
      <NotificationDrawer isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />

      <div className="flex flex-1 overflow-hidden h-screen">
        {/* ================= SIDEBAR ================= */}
        <aside
          className={`relative z-30 flex flex-col bg-[#0A0A0A] border-r border-white/5 transition-all duration-300 ease-in-out shrink-0 rtl:border-r-0 rtl:border-l ${
            isSidebarCollapsed ? 'w-20' : 'w-72'
          }`}
        >
          {/* Brand Header & Org Switcher */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            {!isSidebarCollapsed ? (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded bg-white/10 border border-white/20 flex items-center justify-center text-white font-serif italic text-sm shrink-0 shadow-[0_0_12px_rgba(255,255,255,0.05)]">
                  Σ
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                      System Protocol
                    </span>
                  </div>
                  <h1 className="font-serif italic text-sm text-white truncate">
                    SahlBiz OS v4.0
                  </h1>
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 mx-auto rounded bg-white/10 border border-white/20 flex items-center justify-center text-white font-serif italic text-sm">
                Σ
              </div>
            )}

            <button
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              className="hidden lg:flex p-1.5 rounded text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
              title={isSidebarCollapsed ? 'Déplier le menu' : 'Replier le menu'}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              ) : (
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              )}
            </button>
          </div>

          {/* Active Tenant / Organization Switcher Card */}
          {!isSidebarCollapsed && (
            <div className="px-3 py-2.5 border-b border-white/5">
              <div className="relative">
                <button
                  onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#0C0C0C] border border-white/10 hover:border-white/25 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-xs text-white truncate">
                        {currentOrg.name}
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500 truncate tracking-tight">
                        ICE: {currentOrg.ice} • {currentOrg.city}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors shrink-0" />
                </button>

                {isOrgDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0C0C0C] border border-white/10 rounded-lg shadow-2xl z-50 p-1.5 space-y-1">
                    <p className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                      {language === 'ar' ? 'تبديل المقاولة (Tenant)' : 'Changer d’Entreprise (Tenant)'}
                    </p>
                    {organizations.map((org) => (
                      <button
                        key={org.id}
                        onClick={() => {
                          setCurrentOrg(org);
                          setIsOrgDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs transition-colors ${
                          org.id === currentOrg.id
                            ? 'bg-white/10 text-white font-medium border border-white/15'
                            : 'hover:bg-white/5 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="truncate text-left">
                          <p className="truncate text-white text-xs">{org.name}</p>
                          <span className="text-[10px] text-zinc-500 font-mono">{org.legalForm} • {org.city}</span>
                        </div>
                        {org.id === currentOrg.id && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Links Scroll Container */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin">
            {navGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-0.5">
                {!isSidebarCollapsed && (
                  <p className="px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                    {group.groupName}
                  </p>
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      title={isSidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs transition-all group relative ${
                        isActive
                          ? 'bg-white text-black font-bold shadow-sm'
                          : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive ? 'text-black' : 'text-zinc-400 group-hover:text-white'
                        }`}
                      />
                      {!isSidebarCollapsed && <span className="truncate text-left flex-1">{item.label}</span>}
                      {!isSidebarCollapsed && item.badge && (
                        <span
                          className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 font-bold ${
                            isActive
                              ? 'bg-black/10 text-black'
                              : item.badgeColor || 'bg-white/10 text-white/80 border border-white/10'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* RBAC Role & User Profile Footer */}
          <div className="p-3 border-t border-white/5 bg-[#080808]">
            {!isSidebarCollapsed ? (
              <div className="relative">
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-[#0C0C0C] border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded bg-white/10 border border-white/20 text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="font-medium text-xs text-white truncate">
                        {currentUser.name}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest text-zinc-500">
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                        {currentUser.role}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#0C0C0C] border border-white/10 rounded-lg shadow-2xl z-50 p-1.5 space-y-1">
                    <p className="px-2 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                      {language === 'ar' ? 'محاكاة الأدوار والصلاحيات (RBAC)' : 'Tester un Rôle (RBAC)'}
                    </p>
                    {roleOptions.map((opt) => (
                      <button
                        key={opt.role}
                        onClick={() => {
                          setUserRole(opt.role);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium ${
                          currentUser.role === opt.role
                            ? 'bg-white/10 text-white font-bold'
                            : 'hover:bg-white/5 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {currentUser.role === opt.role && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div
                title={`${currentUser.name} (${currentUser.role})`}
                className="w-8 h-8 mx-auto rounded bg-white/10 border border-white/20 text-white font-bold flex items-center justify-center text-xs cursor-pointer"
                onClick={() => setIsSidebarCollapsed(false)}
              >
                {currentUser.name.charAt(0)}
              </div>
            )}
          </div>
        </aside>

        {/* ================= MAIN CONTENT AREA ================= */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#050505]">
          {/* TOP APP HEADER */}
          <header className="h-16 px-6 bg-[#080808] border-b border-white/5 flex items-center justify-between gap-4 z-20 shrink-0">
            {/* Mobile menu toggle & Breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                className="lg:hidden p-2 rounded text-zinc-400 hover:text-white hover:bg-white/5"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold">
                    System View
                  </span>
                  <span className="font-serif italic text-base text-white capitalize truncate">
                    {t[currentView as keyof typeof t] || currentView}
                  </span>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono rounded bg-white/5 text-zinc-400 border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                  {currentOrg.name} ({currentOrg.currency})
                </span>
              </div>
            </div>

            {/* Global Search Bar (Ctrl+K trigger) */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded bg-[#0C0C0C] border border-white/10 text-zinc-500 hover:text-zinc-300 hover:border-white/20 transition-all text-xs"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="truncate text-xs font-mono">{t.search}</span>
                </span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-zinc-400">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 lg:gap-3 shrink-0">
              {/* Quick AI OCR Button */}
              <button
                onClick={() => setActiveModal('ocr_scanner')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-mono uppercase tracking-wider transition-colors"
                title="Scanner une facture ou reçu avec IA OCR"
              >
                <ScanLine className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'ar' ? 'مسح OCR' : 'OCR Scan'}</span>
              </button>

              {/* Quick Create Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white text-black font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.create}</span>
                  <ChevronDown className="w-3 h-3 opacity-80" />
                </button>

                {isQuickCreateOpen && (
                  <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-56 bg-[#0C0C0C] border border-white/10 rounded-lg shadow-2xl z-50 p-1.5 space-y-1 animate-in fade-in duration-100">
                    <p className="px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                      {language === 'ar' ? 'إضافة سريعة' : 'Créations Rapides'}
                    </p>
                    {quickActions.map((qa, idx) => {
                      const Icon = qa.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            qa.action();
                            setIsQuickCreateOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                        >
                          <Icon className="w-3.5 h-3.5 text-white/80" />
                          <span>{qa.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="p-2 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1 text-xs font-mono"
                  title="Changer de langue (FR / AR / EN)"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="uppercase">{language}</span>
                </button>

                {isLangDropdownOpen && (
                  <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-40 bg-[#0C0C0C] border border-white/10 rounded-lg shadow-2xl z-50 p-1 space-y-1">
                    {[
                      { code: 'fr' as Language, label: 'Français (FR)' },
                      { code: 'ar' as Language, label: 'العربية (RTL)' },
                      { code: 'en' as Language, label: 'English (EN)' },
                    ].map((item) => (
                      <button
                        key={item.code}
                        onClick={() => {
                          setLanguage(item.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-xs ${
                          language === item.code
                            ? 'bg-white/10 text-white font-bold'
                            : 'hover:bg-white/5 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span>{item.label}</span>
                        {language === item.code && <Check className="w-3 h-3 text-white" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                title={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
              >
                {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              </button>

              {/* Notifications Bell */}
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="relative p-2 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
                )}
              </button>

              {/* User Avatar Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded hover:bg-white/5 transition-colors"
                >
                  <div className="w-7 h-7 rounded bg-white/10 border border-white/20 text-white font-bold flex items-center justify-center text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-64 bg-[#0C0C0C] border border-white/10 rounded-lg shadow-2xl z-50 p-2 space-y-2 animate-in fade-in duration-100">
                    <div className="px-3 py-2 border-b border-white/5">
                      <p className="font-bold text-xs text-white">{currentUser.name}</p>
                      <p className="text-[10px] text-zinc-500 font-mono truncate">{currentUser.email}</p>
                      <p className="text-[9px] text-white/50 uppercase tracking-widest mt-1">
                        Rôle: {currentUser.role}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          exportDatabaseJson();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{language === 'ar' ? 'تصدير نسخة احتياطية' : 'Sauvegarde Base JSON'}</span>
                      </button>

                      <button
                        onClick={() => {
                          resetToDemoData();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
                        <span>{language === 'ar' ? 'إعادة ضبط البيانات النموذجية' : 'Réinitialiser Données Démo'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* MAIN PAGE BODY VIEW */}
          <main className="flex-1 overflow-y-auto p-6 bg-[#050505]">
            <div className="max-w-7xl mx-auto space-y-6">{children}</div>
          </main>

          {/* SOPHISTICATED FOOTER PROTOCOL STATUS */}
          <footer className="h-10 border-t border-white/5 flex items-center justify-between px-6 bg-[#050505] text-[9px] uppercase tracking-[0.25em] text-zinc-600 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span>Secure Node: SahlBiz-MAD-OS</span>
            </div>
            <div className="hidden sm:flex gap-8">
              <span>Tenant: {currentOrg.name}</span>
              <span>Protocol: Active (ICE: {currentOrg.ice})</span>
              <span>Version: 4.0.21-B</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
