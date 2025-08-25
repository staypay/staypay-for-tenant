import React, { forwardRef } from 'react';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  suffix?: string;
  containerClassName?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(({
  label,
  error,
  helperText,
  required = false,
  suffix,
  containerClassName = '',
  className = '',
  ...inputProps
}, ref) => {
  return (
    <div className={`space-y-2 ${containerClassName}`}>
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
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 text-sm text-text-primary
            border border-background-border rounded-md
            placeholder:text-text-muted
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            disabled:bg-background-secondary disabled:cursor-not-allowed
            ${error ? 'border-danger' : ''}
            ${suffix ? 'pr-12' : ''}
            ${className}
          `}
          {...inputProps}
        />
        
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base text-text-primary">
            {suffix}
          </span>
        )}
      </div>
      
      {error && (
        <p className="text-xs text-danger">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-xs text-text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
});

TextField.displayName = 'TextField';

interface MoneyInputProps extends Omit<TextFieldProps, 'type' | 'suffix'> {
  currency?: 'KRW' | 'KRWS';
}

export const MoneyInput: React.FC<MoneyInputProps> = ({
  currency = 'KRW',
  ...props
}) => {
  const suffix = currency === 'KRW' ? '원' : 'KRWS';
  
  return (
    <TextField
      {...props}
      type="text"
      suffix={suffix}
      inputMode="numeric"
      pattern="[0-9,]*"
      placeholder="송금액"
    />
  );
};

interface DatePickerProps extends Omit<TextFieldProps, 'type'> {
  format?: 'YYYY-MM-DD' | 'DD';
}

export const DatePicker: React.FC<DatePickerProps> = ({
  format = 'YYYY-MM-DD',
  placeholder = '0000-00-00',
  ...props
}) => {
  return (
    <TextField
      {...props}
      type="date"
      placeholder={placeholder}
      className="text-right"
    />
  );
};