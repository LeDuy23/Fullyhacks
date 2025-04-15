export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const currencies: Record<string, Currency> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar" },
  EUR: { code: "EUR", symbol: "€", name: "Euro" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound" },
  CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen" }
};

export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = currencies[currencyCode] || currencies.USD;
  
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.code
    }).format(amount);
  } catch (error) {
    // Fallback formatting
    return `${currency.symbol}${amount.toFixed(2)}`;
  }
}

export function getCurrencySymbol(currencyCode: string): string {
  return currencies[currencyCode]?.symbol || "$";
}
