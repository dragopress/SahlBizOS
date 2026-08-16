export interface TvaRateOption {
  rate: number;
  label: string;
  description: string;
}

export const MOROCCAN_TVA_RATES: TvaRateOption[] = [
  {
    rate: 20,
    label: '20% - Taux Normal (Prestations, biens courants, services)',
    description: 'Taux par défaut pour les services, conseil, informatique, négoce général.',
  },
  {
    rate: 14,
    label: '14% - Taux Intermédiaire (Transport, électricité, carburant)',
    description: 'Transport de voyageurs et marchandises, énergie solaire, opérations de courtage.',
  },
  {
    rate: 10,
    label: '10% - Taux Réduit (Hôtellerie, restauration, banques, leasing)',
    description: 'Opérations bancaires et de crédit, hébergement touristique, restauration.',
  },
  {
    rate: 7,
    label: '7% - Taux Spécifique (Eau, électricité domestique, produits de base)',
    description: 'Distribution d’eau potable, produits pharmaceutiques, fournitures scolaires.',
  },
  {
    rate: 0,
    label: '0% - Exonéré / Exportation (Article 91/92 du CGI Maroc)',
    description: 'Ventes à l’export, zones franches, matériels agricoles exonérés.',
  },
];

export function calculateTvaFromHT(baseHT: number, rate: number) {
  const taxAmount = (baseHT * rate) / 100;
  const totalTTC = baseHT + taxAmount;
  return {
    baseHT: Number(baseHT.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    totalTTC: Number(totalTTC.toFixed(2)),
  };
}

export function calculateTvaFromTTC(amountTTC: number, rate: number) {
  const baseHT = amountTTC / (1 + rate / 100);
  const taxAmount = amountTTC - baseHT;
  return {
    baseHT: Number(baseHT.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    totalTTC: Number(amountTTC.toFixed(2)),
  };
}

export function calculateLineTotals(
  quantity: number,
  unitPriceHT: number,
  discountPercent: number = 0,
  tvaRate: number = 20
) {
  const rawHT = quantity * unitPriceHT;
  const discountAmount = (rawHT * discountPercent) / 100;
  const netHT = rawHT - discountAmount;
  const totalTVA = (netHT * tvaRate) / 100;
  const totalTTC = netHT + totalTVA;

  return {
    totalHT: Number(netHT.toFixed(2)),
    totalTVA: Number(totalTVA.toFixed(2)),
    totalTTC: Number(totalTTC.toFixed(2)),
  };
}

export function calculateInvoiceTotals(
  items: Array<{
    quantity: number;
    unitPriceHT: number;
    discountPercent?: number;
    tvaRate: number;
    totalHT?: number;
    totalTVA?: number;
    totalTTC?: number;
  }>,
  globalDiscountPercent: number = 0
) {
  let subtotalHT = 0;
  let totalTVA = 0;
  const tvaMap: Record<number, { baseHT: number; taxAmount: number }> = {};

  items.forEach((item) => {
    const rawHT = item.quantity * item.unitPriceHT;
    const itemDiscount = (rawHT * (item.discountPercent || 0)) / 100;
    const netLineHT = rawHT - itemDiscount;
    const lineTva = (netLineHT * item.tvaRate) / 100;

    subtotalHT += netLineHT;
    totalTVA += lineTva;

    if (!tvaMap[item.tvaRate]) {
      tvaMap[item.tvaRate] = { baseHT: 0, taxAmount: 0 };
    }
    tvaMap[item.tvaRate].baseHT += netLineHT;
    tvaMap[item.tvaRate].taxAmount += lineTva;
  });

  const tvaDetails = Object.entries(tvaMap).map(([rateStr, val]) => ({
    rate: Number(rateStr),
    baseHT: Number(val.baseHT.toFixed(2)),
    taxAmount: Number(val.taxAmount.toFixed(2)),
  }));

  const discountAmount = (subtotalHT * globalDiscountPercent) / 100;
  const finalSubtotalHT = subtotalHT - discountAmount;
  const finalTotalTTC = finalSubtotalHT + totalTVA;

  return {
    subtotalHT: Number(subtotalHT.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    finalSubtotalHT: Number(finalSubtotalHT.toFixed(2)),
    totalTVA: Number(totalTVA.toFixed(2)),
    totalTTC: Number(finalTotalTTC.toFixed(2)),
    tvaDetails,
  };
}

