
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

// Convert amount from one currency to another
export async function convertCurrency(
  amount: number,
  from: CurrencyCode = 'USD',
  to: CurrencyCode = 'USD'
): Promise<number> {
  if (from === to) return amount;

  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${from}?api_key=${process.env.CURRENCY_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Currency conversion failed');
    }
    
    const data = await response.json();
    return amount * data.rates[to];
  } catch (error) {
    console.error('Currency conversion error:', error);
    // Return original amount if conversion fails
    return amount;
  }
}

// Format a number as currency
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
