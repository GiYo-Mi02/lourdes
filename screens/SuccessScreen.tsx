import React, { useEffect, useState, useRef } from 'react';
import { Button } from '../components/Button';
import { PatientData } from '../types';
import { savePatientRecord } from '../services/patientService';

interface Props {
  onRestart: () => void;
  data: PatientData;
}

export const SuccessScreen: React.FC<Props> = ({ onRestart, data }) => {
  const [countdown, setCountdown] = useState(60);
  const [refId, setRefId] = useState('Saving...');
  const [checkInTime, setCheckInTime] = useState(new Date());
  // Use a ref to ensure we only save once per mount
  const hasSaved = useRef(false);

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Check-In Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .header h1 { margin: 0; font-size: 18px; }
            .header p { margin: 5px 0 0; color: #666; font-size: 12px; }
            .ref-id { text-align: center; background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .ref-id .label { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
            .ref-id .value { font-size: 24px; font-weight: bold; font-family: monospace; margin-top: 5px; }
            .info { margin: 15px 0; }
            .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .info-row .label { color: #666; }
            .info-row .value { font-weight: bold; }
            .instructions { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px; }
            .instructions h3 { margin: 0 0 10px; font-size: 14px; }
            .instructions li { margin: 8px 0; font-size: 12px; color: #444; }
            .footer { text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px dashed #ccc; font-size: 10px; color: #888; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Lourdes Hospital</h1>
            <p>Patient Check-In Receipt</p>
          </div>
          <div class="ref-id">
            <div class="label">Reference ID</div>
            <div class="value">${refId}</div>
          </div>
          <div class="info">
            <div class="info-row">
              <span class="label">Patient</span>
              <span class="value">${data.firstName} ${data.lastName}</span>
            </div>
            <div class="info-row">
              <span class="label">Check-In Time</span>
              <span class="value">${checkInTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <div class="info-row">
              <span class="label">Date</span>
              <span class="value">${checkInTime.toLocaleDateString()}</span>
            </div>
          </div>
          <div class="instructions">
            <h3>Next Steps:</h3>
            <ul>
              <li>Please take a seat in the waiting area (Zone B, Blue Chairs)</li>
              <li>Your name will be called when ready</li>
              <li>Average wait time: 15-20 minutes</li>
            </ul>
          </div>
          <div class="footer">
            <p>Thank you for choosing Lourdes Hospital</p>
            <p>For emergencies, please notify staff immediately</p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  useEffect(() => {
    const saveData = async () => {
        if (!hasSaved.current) {
            hasSaved.current = true;
            try {
                const record = await savePatientRecord(data);
                setRefId(record.id);
                setCheckInTime(new Date(record.checkInTime));
            } catch (error) {
                console.error("Failed to save record", error);
                setRefId("Error");
            }
        }
    };
    saveData();
  }, [data]);

  useEffect(() => {
    const timer = setInterval(() => {
        setCountdown(prev => {
            if (prev <= 1) {
                onRestart();
                return 0;
            }
            return prev - 1;
        });
    }, 1000);
    return () => clearInterval(timer);
  }, [onRestart]);

  return (
    <div className="flex flex-col h-full items-center justify-center animate-fade-in pb-10">
      
      <div className="relative mb-8">
           <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-20"></div>
           <div className="relative w-32 h-32 bg-success rounded-full flex items-center justify-center shadow-xl shadow-green-200">
                <i className="fas fa-check text-6xl text-white"></i>
           </div>
      </div>

      <h1 className="text-4xl font-bold text-success mb-4">Check-In Complete!</h1>
      <p className="text-xl text-gray-600 max-w-lg text-center leading-relaxed mb-10">
          Your information has been submitted successfully and is now being reviewed by our medical staff.
      </p>

      <div className="bg-green-50 border-2 border-green-100 rounded-xl p-8 max-w-md w-full mb-10 text-center">
          <p className="text-gray-500 text-sm mb-1 uppercase tracking-widest font-semibold">Reference ID</p>
          <p className="text-3xl font-mono font-bold text-gray-800 mb-4 tracking-tight">{refId}</p>
          <div className="h-px bg-green-200 w-full mb-4"></div>
          <p className="text-gray-600 font-medium">Checked in at {checkInTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
      </div>

      <div className="w-full max-w-lg mb-12">
           <h3 className="text-lg font-bold text-gray-800 mb-4 ml-2">Next Steps:</h3>
           <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-start">
                    <i className="fas fa-chair text-medical-blue mt-1 mr-4 text-xl"></i>
                    <div>
                        <p className="font-semibold text-gray-800">Please take a seat in the waiting area.</p>
                        <p className="text-sm text-gray-500">Zone B, Blue Chairs</p>
                    </div>
                </div>
                 <div className="flex items-start">
                    <i className="fas fa-volume-up text-medical-blue mt-1 mr-4 text-xl"></i>
                     <div>
                        <p className="font-semibold text-gray-800">Your name will be called when ready.</p>
                    </div>
                </div>
                 <div className="flex items-start">
                    <i className="fas fa-hourglass-half text-medical-blue mt-1 mr-4 text-xl"></i>
                     <div>
                        <p className="font-semibold text-gray-800">Average wait time: <span className="text-success">15-20 minutes</span></p>
                    </div>
                </div>
           </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg justify-center">
           <Button variant="outline" size="lg" onClick={handlePrint} leftIcon={<i className="fas fa-print"></i>} className="flex-1">Print Receipt</Button>
           <Button variant="primary" size="lg" onClick={onRestart} className="flex-1">Start New Check-In</Button>
      </div>

      <p className="mt-8 text-gray-400 italic text-sm">Returning to home in {countdown} seconds...</p>
    </div>
  );
};
