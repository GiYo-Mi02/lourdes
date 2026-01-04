import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PatientData } from '../types';

interface Props {
  data: PatientData;
  onUpdate: (data: Partial<PatientData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PersonalInfoScreen: React.FC<Props> = ({ data, onUpdate, onNext, onBack }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.firstName) newErrors.firstName = "First name is required";
    if (!data.lastName) newErrors.lastName = "Last name is required";
    
    // Simple date validation (assumes MM/DD/YYYY format in a single string for simplicity here, 
    // though prompt asked for split fields. Implementing split fields logic below)
    const [mm, dd, yyyy] = data.dob.split('/');
    if (!mm || !dd || !yyyy || mm.length !== 2 || dd.length !== 2 || yyyy.length !== 4) {
        if (data.dob.length > 0) newErrors.dob = "Invalid date format";
    }

    if (!data.gender) newErrors.gender = "Please select a gender";
    
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

  const [mm, dd, yyyy] = data.dob.split('/');

  return (
    <div className="animate-slide-in-right">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              required
              value={data.firstName}
              onChange={(e) => onUpdate({ firstName: e.target.value })}
              onBlur={() => setTouched(prev => ({ ...prev, firstName: true }))}
              error={touched.firstName ? errors.firstName : undefined}
              isValid={!!data.firstName && !errors.firstName}
              placeholder="e.g. John"
            />
            <Input
              label="Last Name"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className="text-error">*</span></label>
            <div className="flex gap-4 items-start">
                <div className="w-24">
                    <input 
                        className={`w-full h-12 px-3 border rounded-lg text-center focus:ring-2 focus:ring-medical-blue focus:outline-none ${errors.dob ? 'border-error' : 'border-gray-300'}`}
                        placeholder="MM"
                        maxLength={2}
                        value={mm || ''}
                        onChange={(e) => handleDateChange('mm', e.target.value.replace(/\D/g, ''))}
                    />
                    <span className="text-xs text-gray-400 mt-1 block text-center">Month</span>
                </div>
                <span className="text-2xl text-gray-300 mt-1">/</span>
                <div className="w-24">
                    <input 
                        className={`w-full h-12 px-3 border rounded-lg text-center focus:ring-2 focus:ring-medical-blue focus:outline-none ${errors.dob ? 'border-error' : 'border-gray-300'}`}
                        placeholder="DD"
                        maxLength={2}
                        value={dd || ''}
                        onChange={(e) => handleDateChange('dd', e.target.value.replace(/\D/g, ''))}
                    />
                    <span className="text-xs text-gray-400 mt-1 block text-center">Day</span>
                </div>
                <span className="text-2xl text-gray-300 mt-1">/</span>
                <div className="flex-1">
                    <input 
                        className={`w-full h-12 px-3 border rounded-lg text-center focus:ring-2 focus:ring-medical-blue focus:outline-none ${errors.dob ? 'border-error' : 'border-gray-300'}`}
                        placeholder="YYYY"
                        maxLength={4}
                        value={yyyy || ''}
                        onChange={(e) => handleDateChange('yyyy', e.target.value.replace(/\D/g, ''))}
                    />
                    <span className="text-xs text-gray-400 mt-1 block text-center">Year</span>
                </div>
            </div>
            {touched.dob && errors.dob && <p className="mt-1 text-sm text-error">{errors.dob}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender <span className="text-error">*</span></label>
                <select 
                    className={`w-full h-12 px-4 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-medical-blue focus:outline-none ${touched.gender && errors.gender ? 'border-error' : 'border-gray-300'}`}
                    value={data.gender}
                    onChange={(e) => onUpdate({ gender: e.target.value as any })}
                    onBlur={() => setTouched(prev => ({ ...prev, gender: true }))}
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-6 text-gray-700">
                    <i className="fas fa-chevron-down text-xs"></i>
                </div>
                {touched.gender && errors.gender && <p className="mt-1 text-sm text-error">{errors.gender}</p>}
            </div>
            
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Civil Status</label>
                <select 
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-medical-blue focus:outline-none"
                    value={data.civilStatus}
                    onChange={(e) => onUpdate({ civilStatus: e.target.value as any })}
                >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-6 text-gray-700">
                    <i className="fas fa-chevron-down text-xs"></i>
                </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
            <Button variant="outline" onClick={onBack} leftIcon={<i className="fas fa-arrow-left"></i>}>
                Back
            </Button>
            <Button onClick={handleNext} rightIcon={<i className="fas fa-arrow-right"></i>}>
                Next
            </Button>
        </div>
      </div>
    </div>
  );
};
