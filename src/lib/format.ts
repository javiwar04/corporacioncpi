// Utilidades de formato.

export function formatCurrency(amount?: number, currency = "USD"): string | null {
  if (amount == null) return null;
  try {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("es-GT")}`;
  }
}

export function formatArea(m2?: number): string | null {
  if (m2 == null) return null;
  return `${m2.toLocaleString("es-GT", { maximumFractionDigits: 2 })} m²`;
}

/** Precio a mostrar respetando `priceConfirmed`. Nunca inventa precios. */
export function displayPrice(unit: {
  price?: number;
  currency?: string;
  priceConfirmed?: boolean;
}): string | null {
  if (unit.price == null) return null;
  if (unit.priceConfirmed === false) return null;
  return formatCurrency(unit.price, unit.currency ?? "USD");
}
