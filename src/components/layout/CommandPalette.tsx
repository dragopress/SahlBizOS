import React, { useState, useEffect } from 'react';
import { useApp, NavView } from '../../context/AppContext';
import {
  Search,
  Users,
  FileText,
  CreditCard,
  Package,
  FolderKanban,
  CheckSquare,
  Sparkles,
  ArrowRight,
  X,
  Building,
} from 'lucide-react';
import { formatMAD } from '../../utils/formatters';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    customers,
    invoices,
    quotes,
    products,
    projects,
    tasks,
    setCurrentView,
    setActiveModal,
    language,
    t,
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  // Search across modules
  const filteredCustomers = q
    ? customers.filter((c) => c.name.toLowerCase().includes(q) || (c.ice && c.ice.includes(q)) || c.city.toLowerCase().includes(q))
    : [];

  const filteredInvoices = q
    ? invoices.filter((i) => i.invoiceNumber.toLowerCase().includes(q) || i.customerName.toLowerCase().includes(q))
    : [];

  const filteredQuotes = q
    ? quotes.filter((qItem) => qItem.quoteNumber.toLowerCase().includes(q) || qItem.customerName.toLowerCase().includes(q))
    : [];

  const filteredProducts = q
    ? products.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
    : [];

  const filteredProjects = q
    ? projects.filter((prj) => prj.name.toLowerCase().includes(q) || prj.code.toLowerCase().includes(q))
    : [];

  const filteredTasks = q
    ? tasks.filter((tsk) => tsk.title.toLowerCase().includes(q))
    : [];

  const quickNavActions = [
    { label: t.dashboard, view: 'dashboard' as NavView, icon: Building },
    { label: t.customers, view: 'customers' as NavView, icon: Users },
    { label: t.invoices, view: 'invoices' as NavView, icon: FileText },
    { label: t.quotes, view: 'quotes' as NavView, icon: FileText },
    { label: t.payments, view: 'payments' as NavView, icon: CreditCard },
    { label: t.productsServices, view: 'products' as NavView, icon: Package },
    { label: t.projects, view: 'projects' as NavView, icon: FolderKanban },
    { label: t.tasks, view: 'tasks' as NavView, icon: CheckSquare },
    { label: t.aiAssistant, view: 'ai_assistant' as NavView, icon: Sparkles },
  ];

  const handleNavigate = (view: NavView) => {
    setCurrentView(view);
    setIsCommandPaletteOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-[#0C0C0C] border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3 bg-[#080808]">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            className="w-full bg-transparent text-white placeholder:text-zinc-500 focus:outline-hidden font-mono text-xs"
            placeholder={
              language === 'ar'
                ? 'ابحث عن زبون، فاتورة، عرض سعر، مشروع، مهمة...'
                : 'Rechercher un client, facture, devis, article, projet...'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-3 space-y-4 text-xs font-mono divide-y divide-white/5">
          {!q ? (
            <div>
              <p className="px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                {language === 'ar' ? 'التنقل السريع' : 'Navigation Rapide'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mt-1">
                {quickNavActions.map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleNavigate(action.view)}
                      className="flex items-center gap-2 px-3 py-2 rounded text-zinc-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                    >
                      <Icon className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="truncate">{action.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-white/10">
                <p className="px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                  {language === 'ar' ? 'إجراءات فورية' : 'Créations Rapides'}
                </p>
                <div className="flex flex-wrap gap-2 mt-1 px-2">
                  <button
                    onClick={() => {
                      setIsCommandPaletteOpen(false);
                      setActiveModal('new_invoice');
                    }}
                    className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-zinc-300 hover:bg-white hover:text-black transition-colors text-xs uppercase tracking-wider"
                  >
                    + {t.newInvoice}
                  </button>
                  <button
                    onClick={() => {
                      setIsCommandPaletteOpen(false);
                      setActiveModal('new_quote');
                    }}
                    className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-zinc-300 hover:bg-white hover:text-black transition-colors text-xs uppercase tracking-wider"
                  >
                    + {t.newQuote}
                  </button>
                  <button
                    onClick={() => {
                      setIsCommandPaletteOpen(false);
                      setActiveModal('new_customer');
                    }}
                    className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-zinc-300 hover:bg-white hover:text-black transition-colors text-xs uppercase tracking-wider"
                  >
                    + {t.newCustomer}
                  </button>
                  <button
                    onClick={() => {
                      setIsCommandPaletteOpen(false);
                      setActiveModal('new_expense');
                    }}
                    className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-zinc-300 hover:bg-white hover:text-black transition-colors text-xs uppercase tracking-wider"
                  >
                    + {t.newExpense}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Customers matches */}
              {filteredCustomers.length > 0 && (
                <div>
                  <p className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                    {t.customers} ({filteredCustomers.length})
                  </p>
                  <div className="space-y-1 mt-1">
                    {filteredCustomers.map((cust) => (
                      <div
                        key={cust.id}
                        onClick={() => {
                          setCurrentView('customers');
                          setActiveModal('customer_detail', cust);
                          setIsCommandPaletteOpen(false);
                        }}
                        className="flex items-center justify-between px-3 py-2 rounded hover:bg-white/5 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Users className="w-3.5 h-3.5 text-zinc-400" />
                          <div>
                            <p className="font-sans font-medium text-white">{cust.name}</p>
                            <p className="text-[10px] text-zinc-500">
                              {cust.city} • ICE: {cust.ice || 'Non renseigné'}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-zinc-400">{formatMAD(cust.totalBilledMAD, language)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoices matches */}
              {filteredInvoices.length > 0 && (
                <div>
                  <p className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                    {t.invoices} ({filteredInvoices.length})
                  </p>
                  <div className="space-y-1 mt-1">
                    {filteredInvoices.map((inv) => (
                      <div
                        key={inv.id}
                        onClick={() => {
                          setCurrentView('invoices');
                          setActiveModal('invoice_print', inv);
                          setIsCommandPaletteOpen(false);
                        }}
                        className="flex items-center justify-between px-3 py-2 rounded hover:bg-white/5 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-3.5 h-3.5 text-zinc-400" />
                          <div>
                            <p className="font-sans font-medium text-white">
                              {inv.invoiceNumber} - {inv.customerName}
                            </p>
                            <p className="text-[10px] text-zinc-500">Échéance: {inv.dueDate}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-white">
                          {formatMAD(inv.totalTTC, language)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quotes matches */}
              {filteredQuotes.length > 0 && (
                <div>
                  <p className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                    {t.quotes} ({filteredQuotes.length})
                  </p>
                  <div className="space-y-1 mt-1">
                    {filteredQuotes.map((qItem) => (
                      <div
                        key={qItem.id}
                        onClick={() => {
                          setCurrentView('quotes');
                          setActiveModal('quote_print', qItem);
                          setIsCommandPaletteOpen(false);
                        }}
                        className="flex items-center justify-between px-3 py-2 rounded hover:bg-white/5 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-3.5 h-3.5 text-zinc-400" />
                          <div>
                            <p className="font-sans font-medium text-white">
                              {qItem.quoteNumber} - {qItem.customerName}
                            </p>
                            <p className="text-[10px] text-zinc-500">Statut: {t[qItem.status as keyof typeof t] || qItem.status}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-white">
                          {formatMAD(qItem.totalTTC, language)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products matches */}
              {filteredProducts.length > 0 && (
                <div>
                  <p className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                    {t.catalog} ({filteredProducts.length})
                  </p>
                  <div className="space-y-1 mt-1">
                    {filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleNavigate('products')}
                        className="flex items-center justify-between px-3 py-2 rounded hover:bg-white/5 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Package className="w-3.5 h-3.5 text-zinc-400" />
                          <div>
                            <p className="font-sans font-medium text-white">{p.name}</p>
                            <p className="text-[10px] text-zinc-500">SKU: {p.sku}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-white">
                          {formatMAD(p.sellingPriceHT, language)} HT
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredCustomers.length === 0 &&
                filteredInvoices.length === 0 &&
                filteredQuotes.length === 0 &&
                filteredProducts.length === 0 &&
                filteredProjects.length === 0 &&
                filteredTasks.length === 0 && (
                  <div className="py-8 text-center text-zinc-500">
                    <p>{language === 'ar' ? 'لا توجد نتائج مطابقة' : 'Aucun résultat trouvé pour cette recherche.'}</p>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#080808] border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-mono">
                ESC
              </kbd>{' '}
              {language === 'ar' ? 'إغلاق' : 'Fermer'}
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-mono">
                Ctrl+K
              </kbd>{' '}
              {language === 'ar' ? 'بحث' : 'Recherche'}
            </span>
          </div>
          <span className="text-zinc-400 uppercase tracking-widest flex items-center gap-1">
            SahlBiz OS <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};
