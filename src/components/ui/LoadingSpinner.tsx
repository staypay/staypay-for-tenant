import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'md':
        return 'w-12 h-12';
      case 'lg':
        return 'w-16 h-16';
      default:
        return 'w-12 h-12';
    }
  };

  return (
    <div className={`${getSizeClass()} relative ${className}`}>
      <div className="absolute inset-0">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="absolute w-full h-full"
            style={{
              transform: `rotate(${index * 45}deg)`,
            }}
          >
            <div
              className="w-1 rounded-full bg-secondary"
              style={{
                height: '28%',
                margin: '0 auto',
                opacity: 1 - (index * 0.1),
                animation: `pulse 1s ${index * 0.125}s infinite ease-in-out`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = '계약 등록중입니다.',
  fullScreen = false,
  className = '',
}) => {
  const containerClass = fullScreen
    ? 'fixed inset-0 bg-white z-50'
    : 'relative bg-white';

  return (
    <div className={`${containerClass} flex flex-col items-center justify-center ${className}`}>
      <LoadingSpinner size="lg" />
      {message && (
        <p className="mt-8 text-xl font-bold text-text-primary text-center">
          {message}
        </p>
      )}
    </div>
  );
};

interface ProgressIndicatorProps {
  steps: Array<{
    id: string;
    label: string;
  }>;
  currentStep: string;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  className = '',
}) => {
  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                text-sm font-bold
                ${isActive 
                  ? 'bg-primary text-white' 
                  : isCompleted 
                    ? 'bg-success text-white' 
                    : 'bg-background-secondary text-text-muted'
                }
              `}>
                {isCompleted ? '✓' : index + 1}
              </div>
              <span className={`
                mt-2 text-xs font-medium
                ${isActive 
                  ? 'text-primary' 
                  : isCompleted 
                    ? 'text-text-secondary' 
                    : 'text-text-muted'
                }
              `}>
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`
                flex-1 h-0.5 mx-2
                ${isCompleted ? 'bg-success' : 'bg-background-border'}
              `} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};