import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'full';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-white hover:bg-primary/90';
      case 'secondary':
        return 'bg-background-secondary text-text-primary hover:bg-background-tertiary';
      case 'outline':
        return 'bg-white border border-primary text-primary hover:bg-primary/10';
      case 'text':
        return 'bg-transparent text-primary hover:bg-primary/10';
      case 'success':
        return 'bg-success text-white hover:bg-success/90';
      default:
        return 'bg-primary text-white hover:bg-primary/90';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs';
      case 'md':
        return 'px-6 py-3 text-sm';
      case 'lg':
        return 'px-8 py-4 text-base';
      case 'full':
        return 'w-full px-6 py-4 text-lg';
      default:
        return 'px-6 py-3 text-sm';
    }
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        font-medium rounded-md transition-all
        flex items-center justify-center gap-2
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <span className="animate-spin">⟳</span>
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  );
};

interface PrimaryButtonProps extends Omit<ButtonProps, 'variant'> {
  fullWidth?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  fullWidth = false,
  className = '',
  ...props
}) => {
  return (
    <Button
      variant="primary"
      size={fullWidth ? 'full' : 'md'}
      className={`
        ${fullWidth ? '' : 'min-w-[342px]'}
        h-14 rounded-2xl text-lg font-medium
        ${className}
      `}
      {...props}
    />
  );
};

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  size = 'sm',
  className = '',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-white';
      case 'secondary':
        return 'bg-primary/50 text-white';
      case 'success':
        return 'bg-success text-white';
      case 'danger':
        return 'bg-status-pending text-white';
      default:
        return 'bg-primary text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-[10px]';
      case 'md':
        return 'px-4 py-2 text-xs';
      default:
        return 'px-3 py-1.5 text-[10px]';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        font-bold rounded
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
    >
      {label}
    </button>
  );
};

interface LinkButtonProps {
  label: string;
  onClick?: () => void;
  showIcon?: boolean;
  className?: string;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  label,
  onClick,
  showIcon = true,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2
        text-sm font-normal text-text-muted
        hover:text-primary transition-colors
        ${className}
      `}
    >
      <span>{label}</span>
      {showIcon && <ChevronRight className="w-4 h-4" />}
    </button>
  );
};

interface QuickActionCardProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  label,
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full py-4 px-6
        bg-primary text-white
        rounded-lg
        shadow-[0px_0px_1px_0px_rgba(23,26,31,0.15),0px_0px_2px_0px_rgba(23,26,31,0.2)]
        text-xl font-bold text-center
        hover:bg-primary/90 transition-colors
        ${className}
      `}
    >
      {label}
    </button>
  );
};

interface TabButtonProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const TabButton: React.FC<TabButtonProps> = ({
  label,
  isActive = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 text-sm font-bold
        rounded transition-colors
        ${isActive 
          ? 'bg-primary text-white' 
          : 'bg-white text-text-primary border border-background-border'
        }
        ${className}
      `}
    >
      {label}
    </button>
  );
};

interface ToggleButtonGroupProps {
  options: Array<{
    value: string;
    label: string;
  }>;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({
  options,
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`inline-flex bg-primary/10 rounded p-0.5 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange?.(option.value)}
          className={`
            px-6 py-1.5 text-sm font-bold rounded transition-all
            ${value === option.value
              ? 'bg-primary text-white'
              : 'bg-white text-primary'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};