import React from "react";
import { Home, Clock, User, DollarSign } from "lucide-react";

export interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

interface BottomTabBarProps {
  activeTab?: string;
  onTabClick?: (tabId: string) => void;
  className?: string;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabClick,
  className = "",
}) => {
  const tabs: TabItem[] = [
    {
      id: "home",
      label: "홈",
      icon: <Home className="w-6 h-6" />,
    },
    {
      id: "history",
      label: "히스토리",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      id: "profile",
      label: "내 정보",
      icon: <User className="w-6 h-6" />,
    },
  ];

  return (
    <nav
      className={`
      fixed w-full max-w-screen-mobile mx-auto bottom-0 left-0 right-0 bg-white border-t border-background-border
      ${className}
    `}
    >
      <div className="flex h-[52px]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabClick?.(tab.id)}
              className="relative flex-1 flex flex-col items-center justify-center"
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
              )}
              <div
                className={`
                ${isActive ? "text-primary" : "text-text-tertiary"}
                transition-colors
              `}
              >
                {React.cloneElement(tab.icon as React.ReactElement, {
                  strokeWidth: isActive ? 2.4 : 2,
                })}
              </div>
              <span
                className={`
                text-[10px] font-bold mt-1
                ${isActive ? "text-primary" : "text-text-tertiary"}
              `}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

interface TabBarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  showIndicator?: boolean;
}

export const TabBarItem: React.FC<TabBarItemProps> = ({
  icon,
  label,
  isActive = false,
  onClick,
  showIndicator = false,
}) => {
  return (
    <button
      onClick={onClick}
      className="relative flex-1 flex flex-col items-center justify-center py-2"
    >
      {showIndicator && isActive && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
      )}
      <div
        className={`
        ${isActive ? "text-primary" : "text-text-tertiary"}
        transition-colors
      `}
      >
        {icon}
      </div>
      <span
        className={`
        text-[10px] font-bold mt-1
        ${isActive ? "text-primary" : "text-text-tertiary"}
      `}
      >
        {label}
      </span>
    </button>
  );
};
