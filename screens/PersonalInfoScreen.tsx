import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PatientData, AccessibilityState } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface Props {
  data: PatientData;
  onUpdate: (data: Partial<PatientData>) => void;
  onNext: () => void;
  onBack: () => void;
  accessibility: AccessibilityState;
}

export const PersonalInfoScreen: React.FC<Props> = ({ data, onUpdate, onNext, onBack, accessibility }) => {
  const { t } = useTranslation(accessibility);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.firstName) newErrors.firstName = t('required_field');
    if (!data.lastName) newErrors.lastName = t('required_field');
    
    // Simple date validation (assumes MM/DD/YYYY format in a single string for simplicity here, 
    // though prompt asked for split fields. Implementing split fields logic below)
    const [mm, dd, yyyy] = data.dob.split('/');
    if (!mm || !dd || !yyyy || mm.length !== 2 || dd.length !== 2 || yyyy.length !== 4) {
        if (data.dob.length > 0) newErrors.dob = t('required_field');
    }

    if (!data.gender) newErrors.gender = t('required_field');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (Object.keys(touched).length > 0) validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleNext = () => {
    setTouched({ firstName: true, lastName: true, dob: true, gender: true });
    if (validate()) {
      onNext();
    }
  };

  const handleDateChange = (part: 'mm' | 'dd' | 'yyyy', value: string) => {
    const parts = data.dob.split('/');
    const currentMM = parts[0] || '';
    const currentDD = parts[1] || '';
    const currentYYYY = parts[2] || '';

    let newDob = '';
    if (part === 'mm') newDob = `${value}/${currentDD}/${currentYYYY}`;
    if (part === 'dd') newDob = `${currentMM}/${value}/${currentYYYY}`;
    if (part === 'yyyy') newDob = `${currentMM}/${currentDD}/${value}`;
    
    onUpdate({ dob: newDob });
  };

  // Generate arrays for dropdowns
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 120 }, (_, i) => String(currentYear - i));

  const [mm, dd, yyyy] = data.dob.split('/');

  return (
    <div className="animate-slide-in-right">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('personal_info_title')}</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label={t('first_name')}
              required
              value={data.firstName}
              onChange={(e) => onUpdate({ firstName: e.target.value })}
              onBlur={() => setTouched(prev => ({ ...prev, firstName: true }))}
              error={touched.firstName ? errors.firstName : undefined}
              isValid={!!data.firstName && !errors.firstName}
              placeholder="e.g. John"
            />
            <Input
              label={t('last_name')}
              required
              value={data.lastName}
              onChange={(e) => onUpdate({ lastName: e.target.value })}
              onBlur={() => setTouched(prev => ({ ...prev, lastName: true }))}
              error={touched.lastName ? errors.lastName : undefined}
              isValid={!!data.lastName && !errors.lastName}
              placeholder="e.g. Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('date_of_birth')} <span className="text-error">*</span></label>
            <div className="flex gap-4 items-start">
                <div className="flex-1 relative">
                    <select 
                        className={`w-full h-12 px-3 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-medical-blue focus:outline-none ${errors.dob ? 'border-error' : 'border-gray-300'}`}
                        value={mm || ''}
                        onChange={(e) => handleDateChange('mm', e.target.value)}
                    >
                        <option value="">Month</option>
                        {months.map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                        <i className="fas fa-chevron-down text-xs"></i>
                    </div>
                    <span className="text-xs text-gray-400 mt-1 block text-center">Month</span>
                </div>
                <div className="flex-1 relative">
                    <select 
                        className={`w-full h-12 px-3 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-medical-blue focus:outline-none ${errors.dob ? 'border-error' : 'border-gray-300'}`}
                        value={dd || ''}
                        onChange={(e) => handleDateChange('dd', e.target.value)}
                    >
                        <option value="">Day</option>
                        {days.map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                        <i className="fas fa-chevron-down text-xs"></i>
                    </div>
                    <span className="text-xs text-gray-400 mt-1 block text-center">Day</span>
                </div>
                <div className="flex-1 relative">
                    <select 
                        className={`w-full h-12 px-3 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-medical-blue focus:outline-none ${errors.dob ? 'border-error' : 'border-gray-300'}`}
                        value={yyyy || ''}
                        onChange={(e) => handleDateChange('yyyy', e.target.value)}
                    >
                        <option value="">Year</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                        <i className="fas fa-chevron-down text-xs"></i>
                    </div>
                    <span className="text-xs text-gray-400 mt-1 block text-center">Year</span>
                </div>
            </div>
            {touched.dob && errors.dob && <p className="mt-1 text-sm text-error">{errors.dob}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('gender')} <span className="text-error">*</span></label>
                <select 
                    className={`w-full h-12 px-4 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-medical-blue focus:outline-none ${touched.gender && errors.gender ? 'border-error' : 'border-gray-300'}`}
                    value={data.gender}
                    onChange={(e) => onUpdate({ gender: e.target.value as any })}
                    onBlur={() => setTouched(prev => ({ ...prev, gender: true }))}
                >
                    <option value="">{t('select_gender')}</option>
                    <option value="Male">{t('male')}</option>
                    <option value="Female">{t('female')}</option>
                    <option value="Other">{t('other')}</option>
                    <option value="Prefer not to say">{t('prefer_not_say')}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-6 text-gray-700">
                    <i className="fas fa-chevron-down text-xs"></i>
                </div>
                {touched.gender && errors.gender && <p className="mt-1 text-sm text-error">{errors.gender}</p>}
            </div>
            
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('civil_status')}</label>
                <select 
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-medical-blue focus:outline-none"
                    value={data.civilStatus}
                    onChange={(e) => onUpdate({ civilStatus: e.target.value as any })}
                >
                    <option value="">{t('civil_status')}</option>
                    <option value="Single">{t('single')}</option>
                    <option value="Married">{t('married')}</option>
                    <option value="Divorced">{t('separated')}</option>
                    <option value="Widowed">{t('widowed')}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-6 text-gray-700">
                    <i className="fas fa-chevron-down text-xs"></i>
                </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
            <Button variant="outline" onClick={onBack} leftIcon={<i className="fas fa-arrow-left"></i>}>
                {t('back_button')}
            </Button>
            <Button onClick={handleNext} rightIcon={<i className="fas fa-arrow-right"></i>}>
                {t('next_button')}
            </Button>
        </div>
      </div>
    </div>
  );
};
