import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { getKioskSettings, saveKioskSettings, KioskSettings } from '../../services/patientService';

export const AdminSettings: React.FC = () => {
  const [hospitalName, setHospitalName] = useState('Lourdes Hospital');
  const [kioskId, setKioskId] = useState('KIOSK-01');
  const [vitalsConfig, setVitalsConfig] = useState({
      respiratoryRate: true,
      pulse: true,
      spo2: true,
      bp: true,
      temperature: true
  });
  const [saved, setSaved] = useState(false);
  
  useEffect(() => {
    const settings = getKioskSettings();
    setHospitalName(settings.hospitalName);
    setKioskId(settings.kioskId);
    setVitalsConfig(settings.vitals);
  }, []);

  const handleSave = () => {
      const settings: KioskSettings = {
        hospitalName,
        kioskId,
        vitals: vitalsConfig
      };
      saveKioskSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex-1 bg-gray-50 p-8 overflow-y-auto animate-fade-in">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800">Kiosk Configuration</h2>
                <p className="text-gray-500">Manage device settings and workflow parameters.</p>
            </div>
            
            <div className="p-8 space-y-8">
                {/* General Settings */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <i className="fas fa-sliders-h w-8 text-medical-blue"></i>
                        General Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                            label="Hospital Name" 
                            value={hospitalName} 
                            onChange={(e) => setHospitalName(e.target.value)} 
                        />
                        <Input 
                            label="Kiosk Identifier" 
                            value={kioskId} 
                            onChange={(e) => setKioskId(e.target.value)} 
                        />
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* Vitals Workflow */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <i className="fas fa-heartbeat w-8 text-medical-blue"></i>
                        Vital Signs Workflow
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">Select which measurements are required during patient intake.</p>
                    
                    <div className="space-y-3">
                        <Toggle 
                            label="Respiratory Rate" 
                            checked={vitalsConfig.respiratoryRate} 
                            onChange={(v) => setVitalsConfig({...vitalsConfig, respiratoryRate: v})} 
                        />
                        <Toggle 
                            label="Pulse Rate" 
                            checked={vitalsConfig.pulse} 
                            onChange={(v) => setVitalsConfig({...vitalsConfig, pulse: v})} 
                        />
                        <Toggle 
                            label="Blood Oxygen (SpO₂)" 
                            checked={vitalsConfig.spo2} 
                            onChange={(v) => setVitalsConfig({...vitalsConfig, spo2: v})} 
                        />
                        <Toggle 
                            label="Blood Pressure" 
                            checked={vitalsConfig.bp} 
                            onChange={(v) => setVitalsConfig({...vitalsConfig, bp: v})} 
                        />
                        <Toggle 
                            label="Body Temperature" 
                            checked={vitalsConfig.temperature} 
                            onChange={(v) => setVitalsConfig({...vitalsConfig, temperature: v})} 
                        />
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* Security */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <i className="fas fa-shield-alt w-8 text-medical-blue"></i>
                        Security
                    </h3>
                    <div className="max-w-md">
                        <Button variant="outline" size="sm" leftIcon={<i className="fas fa-key"></i>}>
                            Change Admin PIN
                        </Button>
                    </div>
                </section>

                <div className="pt-6 flex justify-end items-center gap-4">
                    {saved && (
                      <span className="text-green-600 flex items-center gap-2">
                        <i className="fas fa-check-circle"></i> Settings saved!
                      </span>
                    )}
                    <Button onClick={handleSave} size="lg" className="w-40">
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
};

const Toggle = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (val: boolean) => void }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
        <span className="text-gray-700 font-medium">{label}</span>
        <button 
            onClick={() => onChange(!checked)}
            className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out relative ${checked ? 'bg-medical-blue' : 'bg-gray-300'}`}
        >
            <div className={`w-4 h-4 bg-white rounded-full shadow-md absolute top-1 transition-transform duration-200 ${checked ? 'left-7' : 'left-1'}`}></div>
        </button>
    </div>
);
