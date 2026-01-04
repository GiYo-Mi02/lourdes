import React from 'react';
import { Button } from '../components/Button';
import { AccessibilityState } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface Props {
  onNext: () => void;
  onBack: () => void;
  accessibility: AccessibilityState;
}

export const VitalsBriefingScreen: React.FC<Props> = ({ onNext, onBack, accessibility }) => {
  const { t } = useTranslation(accessibility);
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center h-full">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-10 border-t-8 border-medical-blue text-center">
        
        <div className="mb-8 relative">
            <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mx-auto animate-pulse-slow">
                <i className="fas fa-heartbeat text-6xl text-medical-blue"></i>
            </div>
            <div className="absolute top-0 right-[25%] text-yellow-400 text-2xl animate-bounce">
                <i className="fas fa-star"></i>
            </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('vitals_briefing_title')}</h2>
        <p className="text-xl text-medical-blue font-medium mb-8">{t('vitals_briefing_subtitle')}</p>

        <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            {t('vitals_briefing_description')}
        </p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left max-w-lg mx-auto border border-gray-200 shadow-inner">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">{t('vitals_to_collect')}</h3>
            <ul className="space-y-4">
                <li className="flex justify-between items-center">
                    <span className="flex items-center text-gray-700">
                        <i className="fas fa-lungs w-8 text-medical-blue"></i> {t('respiratory_rate')}
                    </span>
                    <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-1 rounded">30-45s</span>
                </li>
                <li className="flex justify-between items-center">
                    <span className="flex items-center text-gray-700">
                        <i className="fas fa-heart w-8 text-red-500"></i> {t('pulse_rate')}
                    </span>
                    <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-1 rounded">15-30s</span>
                </li>
                <li className="flex justify-between items-center">
                    <span className="flex items-center text-gray-700">
                        <i className="fas fa-tint w-8 text-blue-400"></i> {t('blood_oxygen')}
                    </span>
                    <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-1 rounded">15-30s</span>
                </li>
                <li className="flex justify-between items-center">
                    <span className="flex items-center text-gray-700">
                        <i className="fas fa-compress-alt w-8 text-purple-500"></i> {t('blood_pressure')}
                    </span>
                    <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-1 rounded">60-90s</span>
                </li>
                <li className="flex justify-between items-center">
                    <span className="flex items-center text-gray-700">
                        <i className="fas fa-thermometer-half w-8 text-orange-500"></i> {t('body_temperature')}
                    </span>
                    <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-1 rounded">15-30s</span>
                </li>
            </ul>
        </div>

        <div className="flex items-center justify-center text-medical-blue font-medium mb-8 bg-blue-50 py-2 px-4 rounded-full inline-flex mx-auto">
            <i className="far fa-clock mr-2"></i>
            Total time: approximately 3-4 minutes
        </div>

        <div className="flex justify-between w-full">
            <Button variant="outline" onClick={onBack}>{t('back_button')}</Button>
            <Button size="lg" onClick={onNext} className="w-64" rightIcon={<i className="fas fa-play"></i>}>{t('continue_button')}</Button>
        </div>

      </div>
    </div>
  );
};
