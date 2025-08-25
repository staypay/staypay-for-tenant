import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  containerClassName?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  required = false,
  error,
  containerClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`space-y-2 ${containerClassName}`} ref={dropdownRef}>
      {label && (
        <div className="flex items-center gap-2">
          <label className="text-base font-medium text-text-primary">
            {label}
          </label>
          {required && (
            <span className="text-sm text-primary">
              [필수]
            </span>
          )}
        </div>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-4 py-2.5 text-sm text-left
            border border-background-border rounded-md
            bg-white
            flex items-center justify-between
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            ${error ? 'border-danger' : ''}
            ${!selectedOption ? 'text-text-primary' : 'text-text-primary'}
          `}
        >
          <span>{selectedOption?.label || placeholder}</span>
          <ChevronDown 
            className={`w-4 h-4 text-text-primary transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-background-border rounded-md shadow-lg">
            <div className="py-1 max-h-60 overflow-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange?.(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full px-4 py-2 text-sm text-left
                    hover:bg-background-secondary
                    ${value === option.value ? 'bg-primary/10 text-primary' : 'text-text-primary'}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
};

interface BankSelectorProps extends Omit<DropdownProps, 'options'> {
  includeAccountField?: boolean;
  accountValue?: string;
  onAccountChange?: (value: string) => void;
  onVerify?: () => void;
}

export const BankSelector: React.FC<BankSelectorProps> = ({
  includeAccountField = false,
  accountValue,
  onAccountChange,
  onVerify,
  ...dropdownProps
}) => {
  const bankOptions: DropdownOption[] = [
    { value: 'kb', label: '국민은행' },
    { value: 'shinhan', label: '신한은행' },
    { value: 'hana', label: '하나은행' },
    { value: 'woori', label: '우리은행' },
    { value: 'nh', label: '농협은행' },
    { value: 'kakao', label: '카카오뱅크' },
    { value: 'toss', label: '토스뱅크' },
  ];

  return (
    <div className="space-y-3">
      {includeAccountField && (
        <div className="flex gap-3">
          <input
            type="text"
            value={accountValue || ''}
            onChange={(e) => onAccountChange?.(e.target.value)}
            placeholder="임대인 계좌번호"
            className="
              flex-1 px-4 py-2.5 text-sm
              border border-background-border rounded-md
              placeholder:text-text-muted
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            "
          />
        </div>
      )}
      
      <div className="flex gap-3">
        <div className="flex-1">
          <Dropdown
            {...dropdownProps}
            options={bankOptions}
            placeholder="은행 선택"
          />
        </div>
        
        {includeAccountField && onVerify && (
          <button
            type="button"
            onClick={onVerify}
            className="px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
          >
            계좌확인
          </button>
        )}
      </div>
    </div>
  );
};