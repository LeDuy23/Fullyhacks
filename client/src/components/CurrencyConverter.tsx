import React, { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CurrencyConverterProps {
  onConvertedValue: (value: number) => void;
  defaultValue?: number;
}

type Currency = {
  code: string;
  name: string;
  symbol: string;
};

const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
];

// Exchange rates relative to USD (simple fixed rates for demo - in a real app you'd fetch current rates from an API)
const exchangeRates: Record<string, number> = {
  USD: 1.0,
  EUR: 0.93,
  GBP: 0.79,
  JPY: 151.68,
  CAD: 1.37,
  AUD: 1.52,
  CHF: 0.91,
  CNY: 7.24,
  INR: 83.51,
  MXN: 16.81,
  BRL: 5.09,
  KRW: 1374.92,
  SGD: 1.35,
  HKD: 7.81,
  SEK: 10.56,
};

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ onConvertedValue, defaultValue = 0 }) => {
  const [amount, setAmount] = useState<string>(defaultValue.toString());
  const [fromCurrency, setFromCurrency] = useState<string>("EUR");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [isConverterVisible, setIsConverterVisible] = useState(false);

  // Convert currency whenever inputs change
  useEffect(() => {
    if (amount && !isNaN(Number(amount))) {
      const numericAmount = parseFloat(amount);
      const convertedValue = convertCurrency(numericAmount, fromCurrency, toCurrency);
      setConvertedAmount(convertedValue);
      onConvertedValue(convertedValue);
    }
  }, [amount, fromCurrency, toCurrency]);

  const convertCurrency = (amount: number, from: string, to: string): number => {
    // Convert from source currency to USD
    const amountInUSD = amount / exchangeRates[from];
    // Convert from USD to target currency
    const result = amountInUSD * exchangeRates[to];
    return parseFloat(result.toFixed(2));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(Number(value)) && value.match(/^\d*\.?\d{0,2}$/))) {
      setAmount(value);
    }
  };

  const handleFromCurrencyChange = (value: string) => {
    setFromCurrency(value);
  };

  const handleToCurrencyChange = (value: string) => {
    setToCurrency(value);
  };

  const toggleConverter = () => {
    setIsConverterVisible(!isConverterVisible);
    if (!isConverterVisible) {
      // Reset converter to default values when opening
      setAmount(defaultValue.toString());
      setFromCurrency("EUR");
      setToCurrency("USD");
    }
  };

  const getCurrencySymbol = (code: string): string => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.symbol : code;
  };

  return (
    <div className="mt-2">
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={toggleConverter}
        className="flex items-center text-xs"
      >
        <i className="ri-exchange-dollar-line mr-1 text-primary-500"></i>
        {isConverterVisible ? "Hide Currency Converter" : "Convert from Foreign Currency"}
      </Button>
      
      {isConverterVisible && (
        <div className="p-3 mt-2 border rounded-md bg-slate-50">
          <h4 className="text-sm font-medium text-slate-700 mb-2">Currency Converter</h4>
          <div className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="amount" className="text-xs">Amount</Label>
                <div className="relative">
                  <span className="absolute left-2 top-2.5 text-slate-500">
                    {getCurrencySymbol(fromCurrency)}
                  </span>
                  <Input
                    id="amount"
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    className="pl-6"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="fromCurrency" className="text-xs">From Currency</Label>
                <Select value={fromCurrency} onValueChange={handleFromCurrencyChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name} ({currency.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="bg-slate-200 p-1 rounded-full">
                <i className="ri-arrow-down-line text-slate-600"></i>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="convertedAmount" className="text-xs">Converted Amount</Label>
                <div className="relative">
                  <span className="absolute left-2 top-2.5 text-slate-500">
                    {getCurrencySymbol(toCurrency)}
                  </span>
                  <Input
                    id="convertedAmount"
                    type="text"
                    value={convertedAmount}
                    readOnly
                    className="pl-6 bg-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="toCurrency" className="text-xs">To Currency</Label>
                <Select value={toCurrency} onValueChange={handleToCurrencyChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name} ({currency.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="text-xs text-slate-500 italic mt-1">
              Note: The converted amount will be used for the item's cost in USD.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;