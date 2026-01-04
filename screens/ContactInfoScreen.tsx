import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PatientData } from '../types';

interface Props {
  data: PatientData;
  onUpdate: (data: Partial<PatientData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ContactInfoScreen: React.FC<Props> = ({ data, onUpdate, onNext, onBack }) => {
  const [confirmed, setConfirmed] = useState(false);

  const isValid = data.phone.length >= 10 && data.addressLine1.length > 0 && data.city.length > 0 && data.zipCode.length >= 4 && data.state.length > 0;

  return (
    <div className="animate-slide-in-right">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact & Guardian Details</h2>
        
        <div className="space-y-6">
            <Input
                label="Phone Number"
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
                    label="Address Line 1"
                    required
                    value={data.addressLine1}
                    onChange={(e) => onUpdate({ addressLine1: e.target.value })}
                    placeholder="House/Lot No., Street Name"
                />
            </div>

            <Input
                label="Address Line 2 (Optional)"
                value={data.addressLine2}
                onChange={(e) => onUpdate({ addressLine2: e.target.value })}
                placeholder="Barangay, Subdivision, Building"
            />

            <div className="grid grid-cols-10 gap-4">
                <div className="col-span-4">
                    <Input label="City/Municipality" required value={data.city} onChange={e => onUpdate({city: e.target.value})} placeholder="e.g., Quezon City" />
                </div>
                <div className="col-span-3">
                    <Input label="Province" required value={data.state} onChange={e => onUpdate({state: e.target.value})} placeholder="e.g., Metro Manila" />
                </div>
                <div className="col-span-3">
                    <Input label="Postal Code" required value={data.zipCode} onChange={e => onUpdate({zipCode: e.target.value.replace(/\D/g, '').substring(0, 4)})} placeholder="1234" />
                </div>
            </div>

            <div className="border-t border-gray-100 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Guardian Information (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Guardian Name"
                        value={data.guardianName}
                        onChange={(e) => onUpdate({ guardianName: e.target.value })}
                        helperText="For minors or assisted patients"
                    />
                    <Input
                        label="Guardian Phone"
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
                Back
            </Button>
            <Button onClick={onNext} disabled={!isValid || !confirmed} rightIcon={<i className="fas fa-arrow-right"></i>}>
                Next
            </Button>
        </div>
      </div>
    </div>
  );
};
