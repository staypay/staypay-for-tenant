import React, { useEffect, useState } from 'react';

export const LoadingStep: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    '계약서 검증 중...',
    '정보 확인 중...',
    '블록체인 등록 중...',
    '완료 처리 중...'
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return steps.length - 1;
        }
        return prev + 1;
      });
    }, 750);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-background-border animate-pulse" />
            <div 
              className="absolute inset-0 w-24 h-24 rounded-full border-4 border-primary border-t-transparent animate-spin"
              style={{ animationDuration: '1.5s' }}
            />
          </div>
        </div>

        <h2 className="text-xl font-bold text-text-primary text-center mb-2">
          계약서 등록 중
        </h2>
        
        <p className="text-sm text-text-muted text-center mb-8">
          {steps[currentStep]}
        </p>

        <div className="mb-4">
          <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-text-muted text-center">
          {progress}% 완료
        </p>
      </div>
    </div>
  );
};