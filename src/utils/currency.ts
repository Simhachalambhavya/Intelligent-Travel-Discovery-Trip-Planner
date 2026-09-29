export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  AED: 'AED ',
};

export const EXCHANGE_RATES_TO_INR: Record<string, number> = {
  INR: 1,
  USD: 87.5,
  EUR: 94.2,
  GBP: 111.0,
  JPY: 0.58,
  AUD: 57.0,
  CAD: 62.0,
  AED: 23.8,
};

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency + ' ';
  if (currency === 'INR') {
    return `${symbol}${amount.toLocaleString('en-IN')}`;
  }
  return `${symbol}${amount.toLocaleString('en-US')}`;
}

export function convertFromINR(amountInINR: number, targetCurrency: string): number {
  if (targetCurrency === 'INR') return amountInINR;
  const rate = EXCHANGE_RATES_TO_INR[targetCurrency] || 1;
  return Math.round(amountInINR / rate);
}

export function convertToINR(amount: number, sourceCurrency: string): number {
  if (sourceCurrency === 'INR') return amount;
  const rate = EXCHANGE_RATES_TO_INR[sourceCurrency] || 1;
  return Math.round(amount * rate);
}
