
import currency from 'currency.js';

// Available currencies and their symbols
export const currencies = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
};

type CurrencyCode = keyof typeof currencies;

// Static exchange rates (as of last update)
// In a production app, you might want to update these periodically
const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.68,
  CAD: 1.36,
  AUD: 1.51,
};

// Convert amount from one currency to another
export async function convertCurrency(
  amount: number,
  from: CurrencyCode = 'USD',
  to: CurrencyCode = 'USD'
): Promise<number> {
  if (from === to) return amount;

  try {
    // Convert to USD first (as base currency)
    const amountInUSD = amount / exchangeRates[from];
    // Then convert from USD to target currency
    return amountInUSD * exchangeRates[to];
  } catch (error) {
    console.error('Currency conversion error:', error);
    // Return original amount if conversion fails
    return amount;
  }
}

// Format a number as currency
export function formatCurrency(
  amount: number,
  currencyCode: CurrencyCode = 'USD'
): string {
  const symbol = currencies[currencyCode];
  
  return currency(amount, {
    symbol: symbol,
    precision: currencyCode === 'JPY' ? 0 : 2,
  }).format();
}
