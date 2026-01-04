import { PatientData, PatientRecord, VitalConfig } from '../types';
import { supabase } from './supabaseClient';
import { handleError } from './errorService';

const STORAGE_KEY = 'lourdes_patient_records';
const SETTINGS_KEY = 'lourdes_kiosk_settings';
const KIOSK_SETTINGS_KEY = 'lourdes_kiosk_config';
const ASSISTANCE_KEY = 'lourdes_assistance_requests';
const SEQUENCE_KEY = 'lourdes_patient_sequence';

// --- Kiosk Settings ---
export interface KioskSettings {
  hospitalName: string;
  kioskId: string;
  vitals: Record<string, boolean>;
}

const DEFAULT_KIOSK_SETTINGS: KioskSettings = {
  hospitalName: 'Vitalis Kiosk',
  kioskId: 'KIOSK-01',
  vitals: {
    respiratoryRate: true,
    pulse: true,
    spo2: true,
    bp: true,
    temperature: true
  }
};

export const getKioskSettings = (): KioskSettings => {
  const saved = localStorage.getItem(KIOSK_SETTINGS_KEY);
  if (saved) {
    try {
      return { ...DEFAULT_KIOSK_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      console.error("Error parsing kiosk settings", e);
    }
  }
  return DEFAULT_KIOSK_SETTINGS;
};

export const saveKioskSettings = (settings: KioskSettings): void => {
  localStorage.setItem(KIOSK_SETTINGS_KEY, JSON.stringify(settings));
};

// --- Assistance Request System ---
export interface AssistanceRequest {
  id: string;
  kioskId: string;
  timestamp: string;
  status: 'pending' | 'acknowledged' | 'resolved';
  resolvedAt?: string;
  resolvedBy?: string;
}

export const createAssistanceRequest = async (): Promise<AssistanceRequest> => {
  const settings = getKioskSettings();
  const request: AssistanceRequest = {
    id: `AST-${Date.now()}`,
    kioskId: settings.kioskId,
    timestamp: new Date().toISOString(),
    status: 'pending'
  };

  // Save locally
  const requests = getLocalAssistanceRequests();
  requests.unshift(request);
  localStorage.setItem(ASSISTANCE_KEY, JSON.stringify(requests));

  // Try to sync to Supabase
  if (supabase) {
    try {
      const { error } = await supabase.from('assistance_requests').insert([{
        id: request.id,
        kiosk_id: request.kioskId,
        timestamp: request.timestamp,
        status: request.status
      }]);
      
      if (error) throw error;
      console.log('✅ Assistance request synced to Supabase:', request.id);
    } catch (err) {
      console.warn("⚠️ Failed to sync assistance request to Supabase:", err);
      handleError('Failed to sync assistance request', err, 'warning');
    }
  } else {
    console.warn('⚠️ Supabase not configured - assistance request saved locally only');
  }

  return request;
};

export const getAssistanceRequests = async (): Promise<AssistanceRequest[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('assistance_requests')
        .select('*')
        .order('timestamp', { ascending: false });

      if (!error && data) {
        return data.map((d: any) => ({
          id: d.id,
          kioskId: d.kiosk_id,
          timestamp: d.timestamp,
          status: d.status,
          resolvedAt: d.resolved_at,
          resolvedBy: d.resolved_by
        }));
      }
    } catch (err) {
      console.warn("Failed to fetch assistance requests:", err);
    }
  }
  return getLocalAssistanceRequests();
};

export const resolveAssistanceRequest = async (id: string): Promise<void> => {
  const now = new Date().toISOString();
  
  // Update locally first
  const requests = getLocalAssistanceRequests();
  const updated = requests.map(r => 
    r.id === id ? { ...r, status: 'resolved' as const, resolvedAt: now } : r
  );
  localStorage.setItem(ASSISTANCE_KEY, JSON.stringify(updated));

  // Update in Supabase
  if (supabase) {
    try {
      const { error } = await supabase
        .from('assistance_requests')
        .update({ status: 'resolved', resolved_at: now })
        .eq('id', id);
      
      if (error) throw error;
      console.log('✅ Assistance request resolved in Supabase:', id);
    } catch (err) {
      console.warn("⚠️ Failed to update assistance request:", err);
      handleError('Failed to sync assistance resolution', err, 'warning');
    }
  } else {
    console.warn('⚠️ Supabase not configured - assistance resolved locally only');
  }
};

const getLocalAssistanceRequests = (): AssistanceRequest[] => {
  try {
    const stored = localStorage.getItem(ASSISTANCE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

// --- Patient ID Generation ---
const generatePatientId = (): string => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const day = String(new Date().getDate()).padStart(2, '0');
  
  // Get and increment sequence number
  const sequenceData = localStorage.getItem(SEQUENCE_KEY);
  let sequence = 1;
  
  if (sequenceData) {
    try {
      const parsed = JSON.parse(sequenceData);
      // Reset sequence if it's a new day
      if (parsed.date === `${year}-${month}-${day}`) {
        sequence = parsed.seq + 1;
      }
    } catch (e) {
      // Start fresh
    }
  }
  
  localStorage.setItem(SEQUENCE_KEY, JSON.stringify({
    date: `${year}-${month}-${day}`,
    seq: sequence
  }));
  
  // Format: LRD-YYYYMMDD-NNNN (e.g., LRD-20260104-0001)
  return `LRD-${year}${month}${day}-${String(sequence).padStart(4, '0')}`;
};

// --- DOB Format Conversion ---
const convertDobToIso = (dob: string): string => {
  // Input format: MM/DD/YYYY, Output: YYYY-MM-DD
  if (!dob || dob.trim() === '') {
    console.error('❌ DOB is empty!');
    return new Date().toISOString().split('T')[0]; // Fallback to today
  }
  
  const parts = dob.trim().split('/');
  if (parts.length !== 3) {
    console.error('❌ DOB format invalid:', dob);
    return new Date().toISOString().split('T')[0]; // Fallback to today
  }
  
  const [mm, dd, yyyy] = parts;
  const isoDate = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  
  // Validate the date
  const dateObj = new Date(isoDate);
  if (isNaN(dateObj.getTime())) {
    console.error('❌ DOB creates invalid date:', isoDate);
    return new Date().toISOString().split('T')[0]; // Fallback to today
  }
  
  console.log('✅ DOB converted:', dob, '→', isoDate);
  return isoDate;
};

// Helper to get local records
const getLocalRecords = (): PatientRecord[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse local records", e);
    return [];
  }
};

/**
 * Saves a patient record.
 * Implements Store-and-Forward: Saves locally first, then tries to sync.
 */
export const savePatientRecord = async (data: PatientData): Promise<PatientRecord> => {
  // 1. Create the record object with professional ID
  const newRecord: PatientRecord = {
    ...data,
    id: generatePatientId(),
    checkInTime: new Date().toISOString(),
    status: 'Waiting',
    synced: false
  };

  // 2. Save to Local Storage (Source of Truth for Kiosk)
  const currentRecords = getLocalRecords();
  const updatedRecords = [newRecord, ...currentRecords];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));

  // 3. Try to Sync to Supabase immediately
  if (supabase) {
    try {
      const dbRecord = mapRecordToDb(newRecord);
      
      // Debug: Log the data being sent
      console.log('📤 Attempting to save to Supabase:', {
        id: dbRecord.id,
        dob: dbRecord.dob,
        phone: dbRecord.phone,
        vitals: typeof dbRecord.vitals
      });
      
      const { data, error } = await supabase.from('patients').insert([dbRecord]).select();
      
      if (!error) {
        // Mark as synced in local storage
        newRecord.synced = true;
        const recordsAfterSync = updatedRecords.map(r => r.id === newRecord.id ? { ...r, synced: true } : r);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recordsAfterSync));
        console.log('✅ Patient record synced to Supabase:', newRecord.id);
        console.log('✅ Database confirmed:', data);
      } else {
        console.error('❌ Supabase insert failed with details:');
        console.error('   Error code:', error.code);
        console.error('   Error message:', error.message);
        console.error('   Error details:', error.details);
        console.error('   Error hint:', error.hint);
        console.error('   Data sent:', JSON.stringify(dbRecord, null, 2));
        handleError(`Failed to sync to database: ${error.message}`, error, 'warning');
      }
    } catch (err) {
      console.error('❌ Network/Exception error:', err);
      console.error('   Error details:', err instanceof Error ? err.message : String(err));
      handleError('Network error - data saved locally only', err, 'warning');
    }
  } else {
    console.warn('⚠️ Supabase not configured - data saved to localStorage only');
  }

  return newRecord;
};

/**
 * Syncs any pending records to Supabase.
 * Should be called periodically or on online event.
 */
export const syncPendingRecords = async (): Promise<number> => {
  if (!supabase) return 0;

  const records = getLocalRecords();
  const pending = records.filter(r => !r.synced);

  if (pending.length === 0) return 0;

  let syncedCount = 0;

  for (const record of pending) {
    try {
      const dbRecord = mapRecordToDb(record);
      const { error } = await supabase.from('patients').insert([dbRecord]);

      if (!error) {
        record.synced = true;
        syncedCount++;
      } else {
        console.error("Sync failed for record", record.id, error);
      }
    } catch (err) {
      console.error("Sync error", err);
    }
  }

  // Update local storage with new synced statuses
  if (syncedCount > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  return syncedCount;
};

/**
 * Retrieves all patient records.
 * Merges local and remote if possible, or just returns local for Kiosk view.
 */
export const getPatientRecords = async (): Promise<PatientRecord[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('check_in_time', { ascending: false });

      if (error) throw error;
      if (data) {
        return data.map(mapDbToRecord);
      }
    } catch (err) {
      handleError("Failed to fetch from database. Using local records.", err, 'warning');
    }
  }

  return getLocalRecords();
};

/**
 * Updates a patient's status.
 */
export const updatePatientStatus = async (id: string, status: PatientRecord['status']): Promise<void> => {
    // 1. Update Local Storage first (optimistic update)
    const records = getLocalRecords();
    const updated = records.map(r => r.id === id ? { ...r, status } : r);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // 2. Update Supabase for real-time sync
    if (supabase) {
        try {
            const { error } = await supabase
                .from('patients')
                .update({ status })
                .eq('id', id);
            
            if (error) throw error;
            console.log('✅ Patient status updated in Supabase:', id, status);
        } catch (err) {
            console.error('⚠️ Failed to update status in Supabase:', err);
            handleError(`Failed to sync status update for ${id}`, err, 'warning');
        }
    } else {
        console.warn('⚠️ Supabase not configured - status updated locally only');
    }
};

export const clearRecords = async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEY);
};

// --- Configuration Services ---

export const getVitalsSettings = (): Record<string, boolean> => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if(saved) {
        try {
            return JSON.parse(saved);
        } catch(e) { 
            console.error("Error parsing settings", e); 
        }
    }
    // Default
    return {
        respiratoryRate: true,
        pulse: true,
        spo2: true,
        bp: true,
        temperature: true
    };
};

export const saveVitalsSettings = (settings: Record<string, boolean>) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// --- Mappers ---

const mapRecordToDb = (r: PatientRecord) => {
  // Validate required fields
  if (!r.firstName || !r.lastName) {
    console.error('❌ Missing required name fields:', { firstName: r.firstName, lastName: r.lastName });
  }
  if (!r.phone) {
    console.error('❌ Missing required phone field');
  }
  
  const dbRecord = {
    id: r.id,
    first_name: r.firstName || 'Unknown',
    last_name: r.lastName || 'Unknown',
    dob: convertDobToIso(r.dob),
    gender: r.gender || 'Not specified',
    civil_status: r.civilStatus || null,
    phone: r.phone || '',
    address_line1: r.addressLine1 || null,
    address_line2: r.addressLine2 || null,
    city: r.city || null,
    state: r.state || null,
    zip_code: r.zipCode || null,
    guardian_name: r.guardianName || null,
    guardian_phone: r.guardianPhone || null,
    vitals: r.vitals || {},
    check_in_time: r.checkInTime,
    status: r.status
  };
  
  console.log('📋 Mapped record for database:', {
    id: dbRecord.id,
    name: `${dbRecord.first_name} ${dbRecord.last_name}`,
    dob: dbRecord.dob,
    phone: dbRecord.phone
  });
  
  return dbRecord;
};

const mapDbToRecord = (db: any): PatientRecord => ({
  id: db.id,
  firstName: db.first_name,
  lastName: db.last_name,
  dob: db.dob,
  gender: db.gender,
  civilStatus: db.civil_status,
  phone: db.phone,
  addressLine1: db.address_line1,
  addressLine2: db.address_line2,
  city: db.city,
  state: db.state,
  zipCode: db.zip_code,
  guardianName: db.guardian_name,
  guardianPhone: db.guardian_phone,
  vitals: db.vitals,
  checkInTime: db.check_in_time,
  status: db.status,
  synced: true
});
