import React from 'react';
import { Button } from '../components/Button';
import { AccessibilityState } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface Props {
  onNext: () => void;
  onAdminLogin: () => void;
  accessibility: AccessibilityState;
}

export const WelcomeScreen: React.FC<Props> = ({ onNext, onAdminLogin, accessibility }) => {
  const { t } = useTranslation(accessibility);
  
  return (
    <div className="flex flex-col h-full justify-between animate-fade-in relative">
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto w-full">
        
        {/* Hero Section */}
        <div className="mb-12">
            <div className="w-24 h-24 bg-medical-blue rounded-2xl flex items-center justify-center text-white text-4xl mb-6 mx-auto shadow-lg shadow-blue-200">
                <i className="fas fa-hospital-user"></i>
            </div>
            <h1 className="text-4xl font-bold text-medical-blue mb-4">{t('welcome_title')}</h1>
            <p className="text-xl text-gray-600 font-light">
                {t('welcome_description')}
            </p>
        </div>

        {/* Checklist */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full mb-8 text-left">
            <p className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">{t('welcome_time_estimate')}</p>
            <ul className="space-y-4">
                <li className="flex items-center text-gray-700 text-lg">
                    <span className="w-8 h-8 rounded-full bg-green-100 text-success flex items-center justify-center mr-4">
                        <i className="fas fa-check text-sm"></i>
                    </span>
                    {t('welcome_step1')}
                </li>
                <li className="flex items-center text-gray-700 text-lg">
                    <span className="w-8 h-8 rounded-full bg-green-100 text-success flex items-center justify-center mr-4">
                        <i className="fas fa-check text-sm"></i>
                    </span>
                    {t('welcome_step2')}
                </li>
                <li className="flex items-center text-gray-700 text-lg">
                    <span className="w-8 h-8 rounded-full bg-green-100 text-success flex items-center justify-center mr-4">
                        <i className="fas fa-check text-sm"></i>
                    </span>
                    {t('welcome_step3')}
                </li>
            </ul>
        </div>
        
        <p className="text-gray-500 italic mb-8">
            <i className="fas fa-info-circle mr-2"></i>
            Our staff is available nearby if you need assistance.
        </p>

        <div className="w-full flex justify-end">
             <Button 
                onClick={onNext} 
                size="lg" 
                rightIcon={<i className="fas fa-arrow-right"></i>}
                className="w-full sm:w-auto min-w-[200px]"
            >
                {t('start_button')}
            </Button>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="mt-8 flex justify-between items-center px-4">
         {/* Hidden/Discreet Admin Button */}
        <button onClick={onAdminLogin} className="text-gray-300 hover:text-medical-blue text-xs font-semibold p-2">
            <i className="fas fa-lock mr-1"></i> {t('admin_button')}
        </button>
        <p className="text-gray-400 text-sm">Vitalis Kiosk System v2.4 | Secure Mode</p>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>
    </div>
  );
};