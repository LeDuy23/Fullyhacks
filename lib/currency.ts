
import currency from 'currency.js';

// Available currencies and their symbols
export const currencies = {
  USD: '$',
  EUR: '€',
  MXN: 'Mex$',
};

type CurrencyCode = keyof typeof currencies;

// Exchange rates (for simplicity, we'll use static rates)
const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  MXN: 17.23,
};


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
    precision: 2,
  }).format();
}
