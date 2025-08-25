import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  error,
  required = false,
  options,
  placeholder = '선택하세요',
  className = '',
}) => {
  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={`
            w-full px-4 py-3 pr-10
            bg-white rounded-lg
            border ${error ? 'border-danger' : 'border-background-border'}
            text-text-primary
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            appearance-none
            ${!value ? 'text-text-muted' : ''}
          `}
        >
          {!value && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
      </div>
      {error && (
        <p className="text-sm text-danger mt-1">{error}</p>
      )}
    </div>
  );
};