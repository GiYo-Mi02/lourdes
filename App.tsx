import React, { useState, useEffect, useMemo } from 'react';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { ProgressBar } from './components/ProgressBar';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { PersonalInfoScreen } from './screens/PersonalInfoScreen';
import { ContactInfoScreen } from './screens/ContactInfoScreen';
import { VitalsBriefingScreen } from './screens/VitalsBriefingScreen';
import { VitalMeasurementScreen } from './screens/VitalMeasurementScreen';
import { ReviewScreen } from './screens/ReviewScreen';
import { SuccessScreen } from './screens/SuccessScreen';
import { AssistanceScreen } from './screens/AssistanceScreen';
import { AdminDashboard } from './screens/admin/AdminDashboard';
import { AccessibilityState, PatientData, VitalConfig } from './types';
import { getKioskSettings } from './services/patientService';
import { ErrorBoundary } from './components/ErrorBoundary';

// Load test utilities in development
if (import.meta.env.DEV) {
  import('./services/testDatabase');
}

const INITIAL_DATA: PatientData = {
  firstName: '',
  lastName: '',
  dob: '',
  gender: '',
  civilStatus: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  guardianName: '',
  guardianPhone: '',
  vitals: {}
};

const DEFAULT_VITAL_CONFIGS: VitalConfig[] = [
    {
        id: 'respiratoryRate',
        title: 'Respiratory Rate',
        icon: 'fas fa-lungs',
        durationSec: 5,
        unit: 'breaths/min',
        instructions: ['Sit upright comfortably.', 'Breathe normally.', 'Do not talk during measurement.'],
        normalRange: '12-20'
    },
    {
        id: 'pulse',
        title: 'Pulse',
        icon: 'fas fa-heart',
        durationSec: 4,
        unit: 'bpm',
        instructions: ['Place your finger on the sensor.', 'Keep your hand still.', 'Relax your arm.'],
        normalRange: '60-100'
    },
    {
        id: 'spo2',
        title: 'Blood Oxygen (SpO₂)',
        icon: 'fas fa-fingerprint',
        durationSec: 4,
        unit: '%',
        instructions: ['Insert your finger into the clip.', 'Keep steady.', 'Breathe normally.'],
        normalRange: '95-100'
    },
    {
        id: 'bp',
        title: 'Blood Pressure',
        icon: 'fas fa-compress-alt',
        durationSec: 6,
        unit: 'mmHg',
        instructions: ['Rest your arm on the table.', 'Cuff should be snug.', 'Keep feet flat on floor.'],
        normalRange: '120/80'
    },
    {
        id: 'temperature',
        title: 'Body Temperature',
        icon: 'fas fa-thermometer-half',
        durationSec: 3,
        unit: '°F',
        instructions: ['Look at the sensor.', 'Remove glasses or hat.', 'Stay still.'],
        normalRange: '97.8-99.1'
    }
];

const App: React.FC = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [step, setStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);
  const [patientData, setPatientData] = useState<PatientData>(INITIAL_DATA);
  const [accessibility, setAccessibility] = useState<AccessibilityState>({
    fontSize: 'normal',
    highContrast: false,
    audioEnabled: false,
    screenReaderEnabled: false,
    language: 'EN'
  });

  const [activeVitalConfigs, setActiveVitalConfigs] = useState<VitalConfig[]>(DEFAULT_VITAL_CONFIGS);

  // Load Settings
  useEffect(() => {
    const settings = getKioskSettings();
    const enabledConfigs = DEFAULT_VITAL_CONFIGS.filter(c => settings.vitals[c.id as string] !== false);
    setActiveVitalConfigs(enabledConfigs);
  }, []);

  // Screen Reader Effect
  useEffect(() => {
    if (accessibility.screenReaderEnabled) {
      const msg = new SpeechSynthesisUtterance();
      let textToRead = "";
      
      if (step === 0) textToRead = "Welcome to Patient Check-In. Please tap start to begin.";
      else if (step === 1) textToRead = "Step 1, Personal Information form.";
      else if (step === 2) textToRead = "Step 2, Contact Details form.";
      else if (step === 3) textToRead = "Step 3, Vitals Briefing.";
      else if (step >= 4 && step < 4 + activeVitalConfigs.length) {
          const config = activeVitalConfigs[step - 4];
          textToRead = `Measuring ${config.title}. ${config.instructions.join(' ')}`;
      }
      else if (step === 10) textToRead = "Check in complete. Please take a seat.";

      if(textToRead) {
          msg.text = textToRead;
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(msg);
      }
    }
  }, [step, accessibility.screenReaderEnabled, activeVitalConfigs]);

  const updateData = (newData: Partial<PatientData>) => {
    setPatientData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(0, prev - 1));
  const goToStep = (s: number) => setStep(s);
  const resetApp = () => {
      setStep(0);
      setPatientData(INITIAL_DATA);
  };
  
  const goToAssistance = () => {
      setPreviousStep(step);
      setStep(99);
  };
  
  const returnFromAssistance = () => {
      setStep(previousStep);
  };
  
  const toggleAdmin = () => {
      // In a real app, prompt for PIN
      setIsAdminMode(!isAdminMode);
  };

  // Global Styles based on Accessibility
  const containerClasses = useMemo(() => {
      let classes = "min-h-screen transition-all duration-300 ";
      if (accessibility.highContrast) classes += "high-contrast bg-black ";
      else classes += "bg-gray-50 text-gray-900 ";
      
      if (accessibility.fontSize === 'small') classes += "text-sm ";
      if (accessibility.fontSize === 'large') classes += "text-xl ";
      
      return classes;
  }, [accessibility]);

  if (isAdminMode) {
      return <AdminDashboard onExit={() => setIsAdminMode(false)} />;
  }

  // Steps Mapping
  // 0: Welcome
  // 1: Personal
  // 2: Contact
  // 3: Briefing
  // 4 -> 4+N: Dynamic Vitals
  // X: Review
  // X+1: Success
  // 99: Assistance

  const vitalsStartIndex = 4;
  const reviewIndex = vitalsStartIndex + activeVitalConfigs.length;
  const successIndex = reviewIndex + 1;

  const renderScreen = () => {
    if (step === 0) return <WelcomeScreen onNext={nextStep} onAdminLogin={toggleAdmin} accessibility={accessibility} />;
    if (step === 1) return <PersonalInfoScreen data={patientData} onUpdate={updateData} onNext={nextStep} onBack={prevStep} accessibility={accessibility} />;
    if (step === 2) return <ContactInfoScreen data={patientData} onUpdate={updateData} onNext={nextStep} onBack={prevStep} accessibility={accessibility} />;
    if (step === 3) return <VitalsBriefingScreen onNext={nextStep} onBack={prevStep} accessibility={accessibility} />;
    
    // Dynamic Vitals
    if (step >= vitalsStartIndex && step < reviewIndex) {
        const config = activeVitalConfigs[step - vitalsStartIndex];
        return (
            <VitalMeasurementScreen 
                config={config}
                onComplete={(measurement) => {
                    updateData({
                        vitals: { ...patientData.vitals, [config.id]: measurement }
                    });
                }}
                onNext={nextStep}
                onBack={prevStep}
                onSkip={nextStep}
                onRequestHelp={goToAssistance}
                accessibility={accessibility}
            />
        );
    }

    if (step === reviewIndex) return <ReviewScreen data={patientData} onSubmit={nextStep} onBack={prevStep} onEdit={goToStep} />;
    if (step === successIndex) return <SuccessScreen onRestart={resetApp} data={patientData} />;
    if (step === 99) return <AssistanceScreen onBack={returnFromAssistance} accessibility={accessibility} />;
    
    return null;
  };

  // Determine label for progress bar
  const getStepLabel = () => {
      if (step === 1) return "Step 1: Personal Information";
      if (step === 2) return "Step 2: Contact Details";
      if (step === 3) return "Step 3: Vital Signs Overview";
      if (step >= vitalsStartIndex && step < reviewIndex) {
          const config = activeVitalConfigs[step - vitalsStartIndex];
          return `Measuring: ${config.title}`;
      }
      if (step === reviewIndex) return "Review & Confirm";
      return "";
  };

  // Calculate progress relative to total visible steps
  const totalVisualSteps = 4 + activeVitalConfigs.length; // 1,2,3 + vitals + review
  const getVisualStep = () => {
      if (step === 0) return 0;
      if (step === 99) return previousStep;
      if (step > reviewIndex) return totalVisualSteps;
      return step;
  };

  return (
    <ErrorBoundary>
      <div className={containerClasses}>
        <AccessibilityToolbar settings={accessibility} onUpdate={setAccessibility} />
        
        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-8 h-screen flex flex-col max-w-[1024px]">
            {/* Header / Logo */}
            {step < successIndex && step !== 99 && (
                <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-medical-blue rounded flex items-center justify-center text-white mr-3">
                        <i className="fas fa-plus font-bold text-xl"></i>
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-800 text-lg leading-tight">Lourdes Hospital</h1>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Vitalis Kiosk</p>
                    </div>
                </div>
            )}

            {step > 0 && step < successIndex && (
                <ProgressBar currentStep={getVisualStep()} totalSteps={totalVisualSteps} label={getStepLabel()} />
            )}

            <div className="flex-1 relative">
                {renderScreen()}
            </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
