import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '../components/Button';
import { PatientData, VitalMeasurement, VitalConfig, VitalType, AccessibilityState } from '../types';
import { VitalVisualizer } from '../components/VitalVisualizer';
import { analyzeVital } from '../services/vitalAnalysisService';
import { useTranslation } from '../hooks/useTranslation';
import { getVitalInstructions } from '../services/translations';

interface Props {
  config: VitalConfig;
  onComplete: (measurement: VitalMeasurement) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onRequestHelp: () => void;
  accessibility: AccessibilityState;
}

type MachineState = 'idle' | 'measuring' | 'success' | 'error';

export const VitalMeasurementScreen: React.FC<Props> = ({ config, onComplete, onNext, onBack, onSkip, onRequestHelp, accessibility }) => {
  const { t } = useTranslation(accessibility);
  const [state, setState] = useState<MachineState>('idle');
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<string>('');
  const [attempts, setAttempts] = useState(0);
  const measurementCompleteRef = useRef(false);

  // Get translated instructions for the vital
  const instructions = getVitalInstructions(config.id, accessibility.language);

  // Reset state when config changes (next vital)
  useEffect(() => {
    setState('idle');
    setProgress(0);
    setElapsed(0);
    setResult('');
    setAttempts(0);
    measurementCompleteRef.current = false;
  }, [config.id]);

  const generateMockValue = useCallback((title: string): string => {
      switch(title) {
          case 'Respiratory Rate': return (12 + Math.floor(Math.random() * 8)).toString();
          case 'Pulse': return (60 + Math.floor(Math.random() * 40)).toString();
          case 'Blood Oxygen (SpO₂)': return (95 + Math.floor(Math.random() * 5)).toString();
          case 'Blood Pressure': 
             const sys = 110 + Math.floor(Math.random() * 30);
             const dia = 70 + Math.floor(Math.random() * 20);
             return `${sys}/${dia}`;
          case 'Body Temperature': return (97 + Math.random() * 2).toFixed(1);
          default: return '0';
      }
  }, []);

  const finishMeasurement = useCallback(() => {
    if (measurementCompleteRef.current) return;
    measurementCompleteRef.current = true;

    const currentAttempt = attempts + 1;
    setAttempts(currentAttempt);

    // Simulate failure rate
    // We increase error rate to 30% to demonstrate retry logic more easily
    if (Math.random() < 0.3) {
        setState('error');
    } else {
        const mockValue = generateMockValue(config.title);
        const status = analyzeVital(config.title as VitalType, mockValue);
        setResult(mockValue);
        
        // Schedule onComplete to run after state update
        setTimeout(() => {
          onComplete({
              value: mockValue,
              unit: config.unit,
              status: status,
              timestamp: new Date().toISOString()
          });
        }, 0);
        
        setState('success');
    }
  }, [attempts, config.title, config.unit, generateMockValue, onComplete]);

  useEffect(() => {
    let interval: any;
    if (state === 'measuring' && !measurementCompleteRef.current) {
        const totalTime = config.durationSec * 10; // simulation speedup
        const stepTime = 100;
        const totalSteps = totalTime / stepTime;
        
        interval = setInterval(() => {
            setElapsed(prev => prev + 1);
            setProgress(prev => {
                const newProgress = prev + (100 / totalSteps);
                if (newProgress >= 100) {
                    finishMeasurement();
                    return 100;
                }
                return newProgress;
            });
        }, stepTime);
    }
    return () => clearInterval(interval);
  }, [state, config.durationSec, finishMeasurement]);

  const startMeasurement = () => {
    measurementCompleteRef.current = false;
    setState('measuring');
    setProgress(0);
    setElapsed(0);
  };

  return (
    <div className="animate-fade-in flex flex-col items-center">
      <div className="bg-white rounded-xl shadow-lg border border-blue-100 max-w-3xl w-full p-10 min-h-[500px] flex flex-col justify-between relative overflow-hidden">
        
        {/* Background Decorative Icon */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-5 pointer-events-none text-medical-blue">
            <i className={`${config.icon} text-9xl`}></i>
        </div>

        {/* State: IDLE */}
        {state === 'idle' && (
            <>
                <div className="text-center">
                    <div className="w-24 h-24 bg-medical-light rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className={`${config.icon} text-5xl text-medical-blue`}></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Instructions:</h2>
                    <div className="bg-blue-50/50 rounded-lg p-6 text-left max-w-lg mx-auto mb-8 border border-blue-100">
                        <ol className="list-decimal pl-5 space-y-3 text-gray-700 text-lg">
                            {instructions.map((inst, idx) => (
                                <li key={idx}>{inst}</li>
                            ))}
                            <li className="font-semibold text-medical-blue">{t('continue_button')}</li>
                        </ol>
                    </div>
                    <div className="inline-flex items-center text-gray-500 mb-8 bg-gray-100 px-4 py-2 rounded-full">
                        <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                        Status: Ready to measure
                    </div>
                </div>
                <div className="flex flex-col items-center w-full gap-4">
                    <Button onClick={startMeasurement} size="lg" className="w-80 shadow-lg shadow-blue-100">
                        {t('continue_button')}
                    </Button>
                    <button onClick={onRequestHelp} className="text-medical-blue hover:underline text-sm font-medium">
                        {t('need_help_button')}
                    </button>
                </div>
            </>
        )}

        {/* State: MEASURING */}
        {state === 'measuring' && (
            <div className="text-center flex-1 flex flex-col justify-center">
                 <div className="mb-8">
                    <div className="w-24 h-24 bg-medical-light rounded-full flex items-center justify-center mx-auto mb-6 animate-[spin_3s_linear_infinite]">
                        <i className="fas fa-circle-notch text-5xl text-medical-blue"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 animate-pulse">{t('measuring')} {config.title}...</h2>
                    <p className="text-gray-500 mt-2">{t('remain_still')}</p>
                </div>

                <VitalVisualizer isActive={true} type={config.title === 'Pulse' || config.title === 'Blood Pressure' ? 'pulse' : 'wave'} />

                <div className="w-full max-w-lg mx-auto">
                    <div className="flex justify-between text-sm font-bold text-medical-blue mb-2">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                        <div className="bg-medical-blue h-full rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-gray-400 text-sm">Time elapsed: {Math.floor(elapsed / 10)}s</p>
                </div>

                <div className="mt-12">
                     <Button variant="outline" onClick={() => setState('idle')} className="border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300">
                        {t('cancel_button')}
                     </Button>
                </div>
            </div>
        )}

        {/* State: SUCCESS */}
        {state === 'success' && (
            <div className="text-center flex-1 flex flex-col justify-center animate-scale-in">
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-check text-6xl text-success"></i>
                </div>
                <h2 className="text-3xl font-bold text-success mb-2">{t('measurement_complete')}</h2>
                
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 max-w-md mx-auto my-8 transform transition-all hover:scale-105 duration-300">
                    <p className="text-gray-600 text-sm uppercase tracking-wide font-bold mb-2">{config.title}</p>
                    <p className="text-5xl font-bold text-gray-800 mb-2">{result} <span className="text-2xl text-gray-500 font-normal">{config.unit}</span></p>
                    <div className="inline-block bg-green-200 text-green-800 text-xs px-3 py-1 rounded-full font-bold uppercase">Normal Range</div>
                </div>

                <p className="text-gray-600 mb-8">Your {config.title.toLowerCase()} is within healthy range.</p>

                <div className="flex justify-end">
                    <Button onClick={onNext} size="lg" rightIcon={<i className="fas fa-arrow-right"></i>}>
                        {t('continue_button')}
                    </Button>
                </div>
            </div>
        )}

        {/* State: ERROR */}
        {state === 'error' && (
             <div className="text-center flex-1 flex flex-col justify-center animate-shake">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-exclamation-triangle text-5xl text-blue-600"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('measurement_failed')}</h2>
                <p className="text-gray-500 mb-6">Attempt {attempts} of 3</p>
                
                <div className="text-left bg-blue-50 p-6 rounded-lg max-w-md mx-auto mb-8 border-l-4 border-medical-blue">
                    <p className="font-semibold text-gray-800 mb-2">Please ensure:</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>You are sitting still</li>
                        <li>The device is properly positioned</li>
                        <li>You are following the instructions</li>
                    </ul>
                </div>

                <div className="flex flex-col gap-4 max-w-xs mx-auto w-full">
                    <Button onClick={startMeasurement} fullWidth className="bg-medical-blue hover:bg-medical-dark">
                        {t('retry_button')}
                    </Button>
                    
                    {/* Only show these options after 3 failed attempts (initial + 2 retries) */}
                    {attempts >= 3 && (
                        <>
                            <Button variant="warning" leftIcon={<i className="fas fa-user-nurse"></i>} fullWidth onClick={onRequestHelp}>
                                {t('need_help_button')}
                            </Button>
                            <Button variant="outline" onClick={onSkip} fullWidth>
                                {t('skip_button')}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        )}

        {/* Navigation Footer for IDLE state */}
        {state === 'idle' && (
            <div className="flex justify-between items-center mt-auto pt-8 border-t border-gray-100 w-full">
                <Button variant="outline" onClick={onBack} leftIcon={<i className="fas fa-arrow-left"></i>}>{t('back_button')}</Button>
                <button onClick={onSkip} className="text-gray-400 hover:text-gray-600 font-medium px-4 py-2">
                    {t('skip_button')} <i className="fas fa-forward ml-2"></i>
                </button>
            </div>
        )}
      </div>
    </div>
  );
};