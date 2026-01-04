import React from 'react';

interface Props {
  currentStep: number;
  totalSteps: number;
  label?: string;
}

export const ProgressBar: React.FC<Props> = ({ currentStep, totalSteps, label }) => {
  const percentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-end mb-2">
        <span className="text-medical-blue font-semibold text-lg">{label || `Step ${currentStep} of ${totalSteps}`}</span>
        <span className="text-gray-500 font-medium text-sm">{Math.round(percentage)}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-medical-blue h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute top-0 left-0 bottom-0 right-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
        </div>
      </div>
    </div>
  );
};
