import React from "react";
import { useClaimContext } from "@/context/ClaimContext";

export const currencies = [
  { code: "USD", name: "USD - US Dollar" },
  { code: "EUR", name: "EUR - Euro" },
  { code: "GBP", name: "GBP - British Pound" },
  { code: "CAD", name: "CAD - Canadian Dollar" },
  { code: "AUD", name: "AUD - Australian Dollar" },
  { code: "JPY", name: "JPY - Japanese Yen" }
];

// We export this so it can be shared with the AppShell component
export const languages = [
  { code: "EN", name: "English" },
  { code: "ES", name: "Español" },
  { code: "FR", name: "Français" },
  { code: "DE", name: "Deutsch" },
  { code: "ZH", name: "中文" },
  { code: "JA", name: "日本語" }
];

// Renamed to CurrencySelector since it now only handles currency selection
const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useClaimContext();

  return (
    <div className="mb-8">
      <label htmlFor="currency" className="block text-sm font-medium text-slate-700 mb-1">
        Select Currency
      </label>
      <div className="relative">
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
        >
          {currencies.map((curr) => (
            <option key={curr.code} value={curr.code}>
              {curr.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
          <i className="ri-arrow-down-s-line"></i>
        </div>
      </div>
    </div>
  );
};

export default CurrencySelector;
