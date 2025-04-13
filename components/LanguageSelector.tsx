
import { Select, FormControl, FormLabel } from '@chakra-ui/react';

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
];

export default function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <FormControl>
      <FormLabel>Preferred Language</FormLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
