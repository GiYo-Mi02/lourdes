export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say' | '';
export type CivilStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed' | '';

export interface PatientData {
  firstName: string;
  lastName: string;
  dob: string; // MM/DD/YYYY
  gender: Gender;
  civilStatus: CivilStatus;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  guardianName: string;
  guardianPhone: string;
  vitals: {
    respiratoryRate?: VitalMeasurement;
    pulse?: VitalMeasurement;
    spo2?: VitalMeasurement;
    bp?: VitalMeasurement;
    temperature?: VitalMeasurement;
  };
}

export interface PatientRecord extends PatientData {
  id: string;
  checkInTime: string;
  status: 'Waiting' | 'In Progress' | 'Completed' | 'Assistance Needed' | 'Cancelled';
  synced?: boolean;
}

export interface VitalMeasurement {
  value: string;
  unit: string;
  status: 'Normal' | 'Warning' | 'Critical';
  timestamp: string;
}

export type VitalType = 'Respiratory Rate' | 'Pulse' | 'Blood Oxygen (SpO₂)' | 'Blood Pressure' | 'Body Temperature';

export interface VitalConfig {
  id: keyof PatientData['vitals'];
  title: string;
  icon: string; // FontAwesome class
  durationSec: number;
  instructions: string[];
  unit: string;
  normalRange: string;
  enabled?: boolean; // New field for settings
}

export interface AccessibilityState {
  fontSize: 'small' | 'normal' | 'large';
  highContrast: boolean;
  audioEnabled: boolean;
  screenReaderEnabled: boolean; // New field
  language: string;
}
