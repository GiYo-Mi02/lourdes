import { VitalType, VitalMeasurement } from '../types';

interface VitalThreshold {
  min: number;
  max: number;
}

interface VitalRange {
  normal: VitalThreshold;
  warning: {
    low: VitalThreshold;
    high: VitalThreshold;
  };
  // Critical is anything outside warning
}

// Medical thresholds (simplified for standard adult)
// Temperature in °F to match UI display
const VITAL_RANGES: Record<string, VitalRange> = {
  'Body Temperature': {
    normal: { min: 97.0, max: 99.0 },
    warning: { low: { min: 95.0, max: 96.9 }, high: { min: 99.1, max: 100.4 } }
  },
  'Pulse': {
    normal: { min: 60, max: 100 },
    warning: { low: { min: 50, max: 59 }, high: { min: 101, max: 120 } }
  },
  'Blood Oxygen (SpO₂)': {
    normal: { min: 95, max: 100 },
    warning: { low: { min: 90, max: 94 }, high: { min: 101, max: 100 } } // High warning not really applicable for SpO2 usually, but keeping structure
  },
  'Respiratory Rate': {
    normal: { min: 12, max: 20 },
    warning: { low: { min: 8, max: 11 }, high: { min: 21, max: 25 } }
  },
  // BP is complex (Systolic/Diastolic), handling separately in logic or simplifying here
};

export const analyzeVital = (type: VitalType, valueStr: string): 'Normal' | 'Warning' | 'Critical' => {
  const value = parseFloat(valueStr);
  if (isNaN(value)) return 'Warning'; // Invalid read

  if (type === 'Blood Pressure') {
    // Format: "120/80"
    const parts = valueStr.split('/');
    if (parts.length !== 2) return 'Warning';
    const sys = parseFloat(parts[0]);
    const dia = parseFloat(parts[1]);
    
    if (sys < 90 || sys > 180 || dia < 60 || dia > 120) return 'Critical';
    if (sys > 140 || dia > 90) return 'Warning';
    return 'Normal';
  }

  const range = VITAL_RANGES[type];
  if (!range) return 'Normal'; // Default if unknown

  if (value >= range.normal.min && value <= range.normal.max) {
    return 'Normal';
  }

  if ((value >= range.warning.low.min && value <= range.warning.low.max) ||
      (value >= range.warning.high.min && value <= range.warning.high.max)) {
    return 'Warning';
  }

  return 'Critical';
};

export const getVitalColor = (status: 'Normal' | 'Warning' | 'Critical'): string => {
  switch (status) {
    case 'Normal': return 'text-green-600';
    case 'Warning': return 'text-yellow-600';
    case 'Critical': return 'text-red-600';
    default: return 'text-gray-600';
  }
};
