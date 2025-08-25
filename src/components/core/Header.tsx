import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'StayPay',
  showBackButton = false,
  onBack,
  rightContent,
  className = '',
}) => {
  return (
    <header className={`bg-white border-b border-background-border ${className}`}>
      <div className="h-10 bg-white" />
      <div className="relative flex items-center justify-center h-14 px-4">
        {showBackButton && (
          <button
            onClick={onBack}
            className="absolute left-4 p-2 -ml-2 rounded-lg hover:bg-background-secondary"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 text-text-primary" />
          </button>
        )}
        
        <h1 className="text-lg font-medium text-primary">
          {title}
        </h1>
        
        {rightContent && (
          <div className="absolute right-4">
            {rightContent}
          </div>
        )}
      </div>
    </header>
  );
};

interface NavigationTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    isActive?: boolean;
    isCompleted?: boolean;
  }>;
  onTabClick?: (id: string) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  tabs,
  onTabClick,
}) => {
  return (
    <div className="flex bg-white border-b border-background-border">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          onClick={() => onTabClick?.(tab.id)}
          className={`
            flex-1 py-3.5 px-3 text-sm font-bold transition-colors
            ${tab.isActive 
              ? 'text-primary border-b-2 border-primary' 
              : tab.isCompleted 
                ? 'text-text-tertiary' 
                : 'text-text-muted'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

interface HeaderWithNavigationProps extends HeaderProps {
  navigationTabs?: Array<{
    id: string;
    label: string;
    isActive?: boolean;
    isCompleted?: boolean;
  }>;
  onTabClick?: (id: string) => void;
}

export const HeaderWithNavigation: React.FC<HeaderWithNavigationProps> = ({
  navigationTabs,
  onTabClick,
  ...headerProps
}) => {
  return (
    <div className="sticky top-0 z-50 bg-white">
      <Header {...headerProps} />
      {navigationTabs && (
        <NavigationTabs tabs={navigationTabs} onTabClick={onTabClick} />
      )}
    </div>
  );
};