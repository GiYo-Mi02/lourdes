import React, { useState } from 'react';
import { Button } from '../components/Button';
import { PatientData } from '../types';

interface Props {
  data: PatientData;
  onSubmit: () => void;
  onBack: () => void;
  onEdit: (step: number) => void;
}

export const ReviewScreen: React.FC<Props> = ({ data, onSubmit, onBack, onEdit }) => {
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
        onSubmit();
    }, 2000);
  };

  const SectionHeader = ({ title, step }: { title: string, step: number }) => (
    <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <button onClick={() => onEdit(step)} className="text-medical-blue hover:text-blue-700 text-sm font-semibold hover:underline">
            Edit
        </button>
    </div>
  );

  const DataRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between py-2 border-b border-gray-50 last:border-0">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="text-gray-800 font-bold text-right">{value || '-'}</span>
    </div>
  );

  return (
    <div className="animate-slide-in-right h-full">
       <div className="bg-white rounded-xl shadow-lg border border-gray-100 max-w-4xl mx-auto flex flex-col h-[calc(100vh-200px)] min-h-[600px]">
            <div className="p-6 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                 <h2 className="text-2xl font-bold text-gray-800">Review Your Information</h2>
                 <p className="text-gray-500">Please verify all details before submitting.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {/* Personal Info */}
                <section>
                    <SectionHeader title="Personal Information" step={1} />
                    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                        <DataRow label="Full Name" value={`${data.firstName} ${data.lastName}`} />
                        <DataRow label="Gender" value={data.gender} />
                        <DataRow label="Date of Birth" value={data.dob} />
                        <DataRow label="Civil Status" value={data.civilStatus} />
                    </div>
                </section>

                {/* Contact Info */}
                <section>
                    <SectionHeader title="Contact Information" step={2} />
                    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                        <DataRow label="Phone" value={data.phone} />
                        <DataRow label="Address" value={`${data.addressLine1} ${data.addressLine2}, ${data.city}, ${data.state} ${data.zipCode}`} />
                        <DataRow label="Guardian" value={data.guardianName ? `${data.guardianName} (${data.guardianPhone})` : 'N/A'} />
                    </div>
                </section>

                {/* Vitals */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Vital Signs Collected</h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5 shadow-sm">
                        {Object.entries(data.vitals).map(([key, vital]) => {
                             if(!vital) return null;
                             return (
                                <div key={key} className="flex justify-between items-center py-3 border-b border-green-100 last:border-0">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-green-200 text-green-700 flex items-center justify-center mr-3">
                                            <i className="fas fa-check text-xs"></i>
                                        </div>
                                        <span className="text-gray-700 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-gray-900 font-bold text-lg mr-2">{vital.value} <small className="text-gray-500 font-normal">{vital.unit}</small></span>
                                        <span className="inline-block bg-white text-green-600 text-[10px] px-2 py-0.5 rounded border border-green-200 font-bold uppercase tracking-wider">{vital.status}</span>
                                    </div>
                                </div>
                             );
                        })}
                    </div>
                </section>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                 <div className="flex items-center mb-6 bg-white p-4 rounded-lg border border-gray-200">
                    <input
                        type="checkbox"
                        id="final-confirm"
                        className="w-6 h-6 text-medical-blue rounded focus:ring-medical-blue cursor-pointer"
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                    />
                    <label htmlFor="final-confirm" className="ml-3 text-gray-800 font-semibold cursor-pointer select-none">
                        I confirm all information is accurate to the best of my knowledge
                    </label>
                </div>

                <div className="flex justify-between">
                    <Button variant="outline" onClick={onBack} disabled={isSubmitting} leftIcon={<i className="fas fa-arrow-left"></i>}>Back</Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="success" 
                        size="lg" 
                        disabled={!confirmed} 
                        isLoading={isSubmitting}
                        rightIcon={<i className="fas fa-check"></i>}
                        className="w-48"
                    >
                        Submit
                    </Button>
                </div>
            </div>
       </div>
    </div>
  );
};
