
import { Select, FormControl, FormLabel } from '@chakra-ui/react';

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const currencies = [
  { code: 'USD', name: 'US Dollar ($)' },
  { code: 'EUR', name: 'Euro (€)' },
  { code: 'MXN', name: 'Mexican Peso (Mex$)' },
];

export default function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  return (
    <FormControl>
      <FormLabel>Preferred Currency</FormLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
