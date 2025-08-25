import React from "react";

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  fullHeight?: boolean;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  className = "",
  noPadding = false,
  fullHeight = true,
}) => {
  return (
    <div
      className={`w-full ${fullHeight ? "min-h-screen" : ""} flex justify-center bg-white`}
    >
      <div
        className={`
          w-full 
          max-w-mobile 
          bg-white 
          relative
          border-l border-r border-background-border
          ${!noPadding ? "px-2" : ""}
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  );
};
