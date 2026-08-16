import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, MoroccanTvaRate } from '../../types';
import { X, Package, Layers } from 'lucide-react';
import { MOROCCAN_TVA_RATES } from '../../utils/taxCalculator';

interface ProductBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: Product | null;
}

export const ProductBuilderModal: React.FC<ProductBuilderModalProps> = ({
  isOpen,
  onClose,
  initialProduct,
}) => {
  const { addProduct, updateProduct, currentOrg, warehouses, language } = useApp();

  const [formData, setFormData] = useState({
    name: initialProduct?.name || '',
    sku: initialProduct?.sku || `REF-${Date.now().toString().slice(-4)}`,
    type: (initialProduct?.type || 'product') as 'product' | 'service',
    category: initialProduct?.category || 'Matériel & Équipement',
    description: initialProduct?.description || '',
    sellingPriceHT: initialProduct?.sellingPriceHT || 0,
    purchasePriceHT: initialProduct?.purchasePriceHT || 0,
    tvaRate: (initialProduct?.tvaRate || 20) as MoroccanTvaRate,
    unit: initialProduct?.unit || 'U',
    currentStock: initialProduct?.currentStock || 0,
    minStockAlert: initialProduct?.minStockAlert || 5,
    warehouseId: initialProduct?.warehouseId || warehouses[0]?.id || 'wh_casa',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Veuillez renseigner le nom de l’article.');
      return;
    }

    const selectedWh = warehouses.find((w) => w.id === formData.warehouseId);

    if (initialProduct) {
      updateProduct(initialProduct.id, {
        ...formData,
        sellingPriceHT: Number(formData.sellingPriceHT),
        purchasePriceHT: Number(formData.purchasePriceHT),
        currentStock: Number(formData.currentStock),
        minStockAlert: Number(formData.minStockAlert),
        warehouseName: selectedWh?.name,
      });
    } else {
      addProduct({
        organizationId: currentOrg.id,
        ...formData,
        sellingPriceHT: Number(formData.sellingPriceHT),
        purchasePriceHT: Number(formData.purchasePriceHT),
        currentStock: Number(formData.currentStock),
        minStockAlert: Number(formData.minStockAlert),
        warehouseName: selectedWh?.name || 'Dépôt Principal Casablanca',
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#0C0C0C] border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-white/5 border border-white/10 text-white">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                Catalog Item
              </span>
              <h3 className="font-serif italic text-white text-lg leading-tight">
                {initialProduct ? 'Modifier l’Article' : 'Ajouter un Article / Service'}
              </h3>
              <p className="text-[10px] font-mono text-zinc-500">Tarification HT et TVA marocaine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs font-mono">
          {/* Type Switcher */}
          <div className="flex rounded bg-[#080808] p-1 border border-white/10">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'product' })}
              className={`flex-1 py-1.5 rounded text-[10px] uppercase tracking-wider font-bold transition-all ${
                formData.type === 'product'
                  ? 'bg-white text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Produit Physique (Stockable)
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'service' })}
              className={`flex-1 py-1.5 rounded text-[10px] uppercase tracking-wider font-bold transition-all ${
                formData.type === 'service'
                  ? 'bg-white text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Service / Prestation
            </button>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
              Désignation / Nom de l’article *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Serveur NAS Synology DS923+"
              className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Référence / Code SKU
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 font-mono text-xs text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Catégorie
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ex: Informatique, Conseil..."
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden font-sans"
              />
            </div>
          </div>

          {/* Pricing & Moroccan TVA */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded bg-[#080808] border border-white/10">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Prix Vente HT (MAD) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.sellingPriceHT}
                onChange={(e) => setFormData({ ...formData, sellingPriceHT: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded bg-[#0C0C0C] border border-white/10 font-bold text-xs text-emerald-400 focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Prix d'Achat HT (MAD)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.purchasePriceHT}
                onChange={(e) => setFormData({ ...formData, purchasePriceHT: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded bg-[#0C0C0C] border border-white/10 text-xs text-white focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Taux TVA Applicable
              </label>
              <select
                value={formData.tvaRate}
                onChange={(e) => setFormData({ ...formData, tvaRate: Number(e.target.value) as MoroccanTvaRate })}
                className="w-full px-3 py-2 rounded bg-[#0C0C0C] border border-white/10 text-xs text-zinc-200 focus:outline-hidden font-mono"
              >
                {MOROCCAN_TVA_RATES.map((r) => (
                  <option key={r.rate} value={r.rate}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock Section (Only for Products) */}
          {formData.type === 'product' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                  Stock Initial
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.currentStock}
                  onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                  Seuil Alerte Min
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.minStockAlert}
                  onChange={(e) => setFormData({ ...formData, minStockAlert: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                  Entrepôt
                </label>
                <select
                  value={formData.warehouseId}
                  onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-200 focus:outline-hidden font-mono"
                >
                  {warehouses.map((wh) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name} ({wh.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-transparent border border-white/10 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-white text-black hover:bg-zinc-200 text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              {initialProduct ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
