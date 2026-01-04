import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { createAssistanceRequest, getKioskSettings } from '../services/patientService';

interface Props {
  onBack: () => void;
}

export const AssistanceScreen: React.FC<Props> = ({ onBack }) => {
  const [seconds, setSeconds] = useState(0);
  const [requestSent, setRequestSent] = useState(false);
  const [kioskId, setKioskId] = useState('KIOSK-01');

  useEffect(() => {
    // Get kiosk settings
    const settings = getKioskSettings();
    setKioskId(settings.kioskId);

    // Create assistance request on mount
    const sendRequest = async () => {
      try {
        await createAssistanceRequest();
        setRequestSent(true);
      } catch (err) {
        console.error("Failed to send assistance request:", err);
      }
    };
    sendRequest();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
        setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    if (secs < 60) return `${secs}s ago`;
    const mins = Math.floor(secs / 60);
    return `${mins}m ${secs % 60}s ago`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in text-center p-8 bg-gray-50/50">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-200 rounded-full animate-ping opacity-20"></div>
        <div className="relative w-32 h-32 bg-white border-4 border-blue-100 rounded-full flex items-center justify-center shadow-xl">
            <i className="fas fa-user-nurse text-6xl text-medical-blue"></i>
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Assistance Requested</h2>
      <p className="text-medical-blue font-medium mb-8 bg-blue-50 px-4 py-1 rounded-full text-sm">
         Staff notified {formatTime(seconds)}
      </p>
      
      <div className="bg-white border border-blue-100 rounded-xl p-8 max-w-lg w-full mb-8 shadow-lg">
        <div className={`flex items-center justify-center mb-4 ${requestSent ? 'text-green-600' : 'text-yellow-600'}`}>
            <i className={`fas ${requestSent ? 'fa-check-circle' : 'fa-spinner fa-spin'} mr-2`}></i>
            <span className="font-semibold">{requestSent ? 'Signal Sent Successfully' : 'Sending signal...'}</span>
        </div>
        <p className="text-xl text-gray-800 mb-4 font-semibold">
          A nurse is on their way.
        </p>
        <p className="text-gray-600 mb-6 text-lg leading-relaxed">
          Please remain at the kiosk. Help will arrive shortly to assist you with the check-in process.
        </p>
        
        <div className="flex items-center justify-center gap-3 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200 mx-auto max-w-xs">
            <i className="fas fa-map-marker-alt text-red-500 text-lg"></i>
            <span className="font-mono font-medium">Location: {kioskId}</span>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-8">
        Did you press this by mistake?
      </p>

      <Button 
        variant="outline" 
        size="lg" 
        onClick={onBack} 
        leftIcon={<i className="fas fa-undo"></i>} 
        className="bg-white hover:bg-gray-50 border-gray-300 text-gray-600 hover:text-gray-800 min-w-[250px]"
      >
        Cancel Request & Return
      </Button>
    </div>
  );
};