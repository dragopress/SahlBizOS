import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StockMovement } from '../../types';
import { X, ArrowUpDown, Boxes } from 'lucide-react';

interface StockMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StockMovementModal: React.FC<StockMovementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { products, warehouses, addStockMovement, currentOrg, language, t } = useApp();

  const physicalProducts = products.filter((p) => p.type === 'product');

  const [productId, setProductId] = useState<string>(physicalProducts[0]?.id || '');
  const [warehouseId, setWarehouseId] = useState<string>(warehouses[0]?.id || 'wh_casa');
  const [type, setType] = useState<StockMovement['type']>('in_adjustment');
  const [quantity, setQuantity] = useState<number>(1);
  const [reference, setReference] = useState<string>('INVENTAIRE-2026');
  const [notes, setNotes] = useState<string>('Régularisation suite au comptage physique');

  if (!isOpen) return null;

  const selectedProduct = physicalProducts.find((p) => p.id === productId);
  const selectedWh = warehouses.find((w) => w.id === warehouseId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      alert('Veuillez sélectionner un article physique.');
      return;
    }

    if (quantity <= 0) {
      alert('La quantité doit être supérieure à zéro.');
      return;
    }

    // Determine sign: positive for in, negative for out
    const qtySign = type.startsWith('in_') ? Math.abs(quantity) : -Math.abs(quantity);

    addStockMovement({
      organizationId: currentOrg.id,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      warehouseId,
      warehouseName: selectedWh?.name || 'Dépôt',
      type,
      quantity: qtySign,
      reference,
      notes,
      date: new Date().toISOString().split('T')[0],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0C0C0C] border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-white/5 border border-white/10 text-white">
              <ArrowUpDown className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                Stock Movement
              </span>
              <h3 className="font-serif italic text-white text-lg leading-tight">
                {language === 'ar' ? 'تسجيل حركة أو تسوية مخزون' : 'Mouvement ou Ajustement de Stock'}
              </h3>
              <p className="text-[10px] font-mono text-zinc-500">Mise à jour en temps réel de l'inventaire</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
              Article sélectionné *
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white focus:outline-hidden font-mono"
            >
              {physicalProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stock: {p.currentStock} {p.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Type de mouvement
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as StockMovement['type'])}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-200 focus:outline-hidden font-mono"
              >
                <option value="in_adjustment">Entrée / Ajustement Positif (+)</option>
                <option value="out_adjustment">Sortie / Casse / Perte (-)</option>
                <option value="in_purchase">Entrée Achat Fournisseur (+)</option>
                <option value="out_sale">Sortie Vente Client (-)</option>
                <option value="transfer">Transfert Inter-dépôt</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Quantité *
              </label>
              <input
                type="number"
                required
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 font-bold text-xs text-white focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Entrepôt / Dépôt
              </label>
              <select
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-zinc-200 focus:outline-hidden font-mono"
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                N° de Pièce / Réf.
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
              Motif & Remarques
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#080808] border border-white/10 text-xs text-white focus:outline-hidden font-sans"
            />
          </div>

          {/* Footer Actions */}
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
              Valider le Mouvement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
