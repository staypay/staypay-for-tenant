import React from "react";

interface StepButtonContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable container component for step buttons that provides consistent
 * positioning and styling across all step components.
 *
 * @param children - The button content to render
 * @param className - Additional CSS classes to apply
 */
export const StepButtonContainer: React.FC<StepButtonContainerProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 max-w-mobile mx-auto p-4 bg-white border-t border-l border-r border-background-border ${className}`}
    >
      {children}
    </div>
  );
};
