import React from 'react';

interface InfoRowProps {
  label: string;
  value: string | number;
  valueColor?: 'primary' | 'secondary' | 'muted' | 'danger';
  suffix?: string;
  className?: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  valueColor = 'secondary',
  suffix,
  className = '',
}) => {
  const getValueColorClass = () => {
    switch (valueColor) {
      case 'primary':
        return 'text-primary';
      case 'secondary':
        return 'text-text-secondary';
      case 'muted':
        return 'text-text-muted';
      case 'danger':
        return 'text-danger';
      default:
        return 'text-text-secondary';
    }
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString('ko-KR');
    }
    return val;
  };

  return (
    <div className={`flex justify-between items-center ${className}`}>
      <span className="text-xs font-medium text-text-primary">
        {label}
      </span>
      <div className="flex items-center gap-1">
        <span className={`text-xs font-medium ${getValueColorClass()}`}>
          {formatValue(value)}
        </span>
        {suffix && (
          <span className="text-xs font-semibold text-text-secondary">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

interface AmountDisplayProps {
  amount: number;
  currency?: 'KRW' | 'KRWS';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const AmountDisplay: React.FC<AmountDisplayProps> = ({
  amount,
  currency = 'KRWS',
  size = 'md',
  align = 'right',
  className = '',
}) => {
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ko-KR');
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          amount: 'text-sm',
          currency: 'text-xs',
        };
      case 'md':
        return {
          amount: 'text-base',
          currency: 'text-xs',
        };
      case 'lg':
        return {
          amount: 'text-lg',
          currency: 'text-sm',
        };
      case 'xl':
        return {
          amount: 'text-xl',
          currency: 'text-base',
        };
      default:
        return {
          amount: 'text-base',
          currency: 'text-xs',
        };
    }
  };

  const getAlignClass = () => {
    switch (align) {
      case 'left':
        return 'text-left';
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-right';
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={`${getAlignClass()} ${className}`}>
      <p className={`font-semibold text-primary ${sizeClasses.amount}`}>
        {formatAmount(amount)}
      </p>
      <p className={`font-semibold text-text-secondary ${sizeClasses.currency}`}>
        {currency}
      </p>
    </div>
  );
};

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: {
    text: string;
    onClick: () => void;
  };
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  action,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div>
        <h2 className="text-xl font-bold text-text-primary">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-text-muted mt-1">
            {subtitle}
          </p>
        )}
      </div>
      
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm font-normal text-text-muted hover:text-primary transition-colors"
        >
          {action.text}
        </button>
      )}
    </div>
  );
};

interface LoanSummaryProps {
  loanLimit: number;
  currentLoan: number;
  dueDate?: string;
  className?: string;
}

export const LoanSummary: React.FC<LoanSummaryProps> = ({
  loanLimit,
  currentLoan,
  dueDate,
  className = '',
}) => {
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ko-KR');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-[21px] font-bold text-text-secondary">
          대출한도
        </span>
        <span className="text-[21px] font-bold text-text-secondary">
          {formatAmount(loanLimit)} KRWS
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-[21px] font-bold text-text-secondary">
          현재 대출액
        </span>
        <span className="text-[21px] font-bold text-text-secondary">
          {formatAmount(currentLoan)} KRWS
        </span>
      </div>
      
      {dueDate && (
        <div className="flex justify-between items-center">
          <span className="text-[21px] font-bold text-text-secondary">
            상환 예정일
          </span>
          <span className="text-[21px] font-normal text-text-secondary">
            {dueDate}
          </span>
        </div>
      )}
    </div>
  );
};