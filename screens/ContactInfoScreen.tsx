import React, { useState } from 'react';
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

export const ContactInfoScreen: React.FC<Props> = ({ data, onUpdate, onNext, onBack, accessibility }) => {
  const { t } = useTranslation(accessibility);
  const [confirmed, setConfirmed] = useState(false);

  const isValid = data.phone.length >= 10 && data.addressLine1.length > 0 && data.city.length > 0 && data.zipCode.length >= 4 && data.state.length > 0;

  return (
    <div className="animate-slide-in-right">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('contact_info_title')}</h2>
        
        <div className="space-y-6">
            <Input
                label={t('phone_number')}
                required
                value={data.phone}
                onChange={(e) => {
                    // Support Philippine format: +63 or 09XX-XXX-XXXX
                    let v = e.target.value.replace(/[^0-9+]/g, '');
                    if (v.length > 13) v = v.substring(0, 13);
                    onUpdate({ phone: v });
                }}
                placeholder="09171234567 or +639171234567"
                isValid={data.phone.length >= 10}
                helperText="Mobile number for appointment reminders"
            />

            <div>
                <Input
                    label={t('address_line1')}
                    required
                    value={data.addressLine1}
                    onChange={(e) => onUpdate({ addressLine1: e.target.value })}
                    placeholder="House/Lot No., Street Name"
                />
            </div>

            <Input
                label={t('address_line2')}
                value={data.addressLine2}
                onChange={(e) => onUpdate({ addressLine2: e.target.value })}
                placeholder="Barangay, Subdivision, Building"
            />

            <div className="grid grid-cols-10 gap-4">
                <div className="col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('city')} <span className="text-error">*</span>
                    </label>
                    <select
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-medical-blue focus:outline-none"
                        value={data.city}
                        onChange={e => onUpdate({city: e.target.value})}
                        required
                    >
                        <option value="">Select City/Municipality</option>
                        <option value="Quezon City">Quezon City</option>
                        <option value="Manila">Manila</option>
                        <option value="Caloocan">Caloocan</option>
                        <option value="Las Piñas">Las Piñas</option>
                        <option value="Makati">Makati</option>
                        <option value="Malabon">Malabon</option>
                        <option value="Mandaluyong">Mandaluyong</option>
                        <option value="Marikina">Marikina</option>
                        <option value="Muntinlupa">Muntinlupa</option>
                        <option value="Navotas">Navotas</option>
                        <option value="Parañaque">Parañaque</option>
                        <option value="Pasay">Pasay</option>
                        <option value="Pasig">Pasig</option>
                        <option value="Pateros">Pateros</option>
                        <option value="San Juan">San Juan</option>
                        <option value="Taguig">Taguig</option>
                        <option value="Valenzuela">Valenzuela</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-9 flex items-center text-gray-700">
                        <i className="fas fa-chevron-down text-xs"></i>
                    </div>
                </div>
                <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('province')} <span className="text-error">*</span>
                    </label>
                    <select
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-medical-blue focus:outline-none"
                        value={data.state}
                        onChange={e => onUpdate({state: e.target.value})}
                        required
                    >
                        <option value="">Select Province</option>
                        <option value="Metro Manila">Metro Manila</option>
                        <option value="Cavite">Cavite</option>
                        <option value="Laguna">Laguna</option>
                        <option value="Batangas">Batangas</option>
                        <option value="Rizal">Rizal</option>
                        <option value="Bulacan">Bulacan</option>
                        <option value="Pampanga">Pampanga</option>
                        <option value="Bataan">Bataan</option>
                        <option value="Zambales">Zambales</option>
                        <option value="Tarlac">Tarlac</option>
                        <option value="Nueva Ecija">Nueva Ecija</option>
                        <option value="Pangasinan">Pangasinan</option>
                        <option value="La Union">La Union</option>
                        <option value="Ilocos Norte">Ilocos Norte</option>
                        <option value="Ilocos Sur">Ilocos Sur</option>
                        <option value="Cebu">Cebu</option>
                        <option value="Davao del Sur">Davao del Sur</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-9 flex items-center text-gray-700">
                        <i className="fas fa-chevron-down text-xs"></i>
                    </div>
                </div>
                <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('postal_code')} <span className="text-error">*</span>
                    </label>
                    <select
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-medical-blue focus:outline-none"
                        value={data.zipCode}
                        onChange={e => onUpdate({zipCode: e.target.value})}
                        required
                    >
                        <option value="">Select Postal Code</option>
                        <option value="1000">1000 - Manila</option>
                        <option value="1100">1100 - Quezon City</option>
                        <option value="1200">1200 - Makati</option>
                        <option value="1300">1300 - Pasay</option>
                        <option value="1400">1400 - Caloocan</option>
                        <option value="1500">1500 - Mandaluyong</option>
                        <option value="1600">1600 - Pasig</option>
                        <option value="1700">1700 - Parañaque</option>
                        <option value="1800">1800 - Marikina</option>
                        <option value="1900">1900 - Valenzuela</option>
                        <option value="4000">4000 - Cavite</option>
                        <option value="4100">4100 - Laguna</option>
                        <option value="4200">4200 - Batangas</option>
                        <option value="3000">3000 - Bulacan</option>
                        <option value="2000">2000 - Pampanga</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-9 flex items-center text-gray-700">
                        <i className="fas fa-chevron-down text-xs"></i>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">{t('guardian_info')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label={t('guardian_name')}
                        value={data.guardianName}
                        onChange={(e) => onUpdate({ guardianName: e.target.value })}
                        helperText="For minors or assisted patients"
                    />
                    <Input
                        label={t('guardian_phone')}
                        value={data.guardianPhone}
                        onChange={(e) => onUpdate({ guardianPhone: e.target.value })}
                    />
                </div>
            </div>

            <div className="flex items-center mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <input
                    type="checkbox"
                    id="confirm"
                    className="w-6 h-6 text-medical-blue rounded focus:ring-medical-blue cursor-pointer"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                />
                <label htmlFor="confirm" className="ml-3 text-gray-700 font-medium cursor-pointer">
                    I confirm this information is accurate
                </label>
            </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
            <Button variant="outline" onClick={onBack} leftIcon={<i className="fas fa-arrow-left"></i>}>
                {t('back_button')}
            </Button>
            <Button onClick={onNext} disabled={!isValid || !confirmed} rightIcon={<i className="fas fa-arrow-right"></i>}>
                {t('next_button')}
            </Button>
        </div>
      </div>
    </div>
  );
};
