/**
 * Database Connection Test Utility
 * Run this in browser console to verify Supabase setup
 */

import { supabase } from './supabaseClient';
import { savePatientRecord } from './patientService';
import { PatientData } from '../types';

export const testDatabaseConnection = async () => {
  console.log('🔍 Starting database connection test...\n');

  // Test 1: Check Supabase client
  console.log('Test 1: Supabase Client');
  if (supabase) {
    console.log('✅ Supabase client initialized');
    console.log('   URL:', import.meta.env.VITE_SUPABASE_URL);
  } else {
    console.log('❌ Supabase client not initialized');
    console.log('   Check .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    return;
  }

  // Test 2: Check table access
  console.log('\nTest 2: Database Table Access');
  try {
    const { data, error } = await supabase.from('patients').select('count');
    if (error) throw error;
    console.log('✅ Can access patients table');
    console.log(`   Current records: ${data?.[0]?.count || 0}`);
  } catch (error: any) {
    console.log('❌ Cannot access patients table');
    console.log('   Error:', error.message);
    console.log('   Solution: Run the SQL schema in Supabase Dashboard → SQL Editor');
    return;
  }

  // Test 3: Check real-time
  console.log('\nTest 3: Real-Time Subscription');
  try {
    const channel = supabase
      .channel('test-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'patients' },
        (payload) => {
          console.log('📡 Real-time event received:', payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time subscription active');
          console.log('   Listening for changes on patients table');
        } else if (status === 'CHANNEL_ERROR') {
          console.log('❌ Real-time subscription failed');
          console.log('   Check Supabase Dashboard → Database → Replication');
        }
      });

    // Clean up after 5 seconds
    setTimeout(() => {
      channel.unsubscribe();
      console.log('🧹 Test subscription cleaned up');
    }, 5000);
  } catch (error: any) {
    console.log('❌ Real-time test failed:', error.message);
  }

  // Test 4: Test insert operation
  console.log('\nTest 4: Data Insert Test');
  const testPatient: PatientData = {
    firstName: 'Test',
    lastName: 'Patient',
    dob: '01/01/1990',
    gender: 'Male',
    civilStatus: 'Single',
    phone: '09171234567',
    addressLine1: '123 Test St',
    addressLine2: '',
    city: 'Quezon City',
    state: 'Metro Manila',
    zipCode: '1100',
    guardianName: '',
    guardianPhone: '',
    vitals: {
      temperature: { value: '98.6', unit: '°F', status: 'Normal', timestamp: new Date().toISOString() },
      pulse: { value: '72', unit: 'bpm', status: 'Normal', timestamp: new Date().toISOString() },
      respiratoryRate: { value: '16', unit: '/min', status: 'Normal', timestamp: new Date().toISOString() },
      spo2: { value: '98', unit: '%', status: 'Normal', timestamp: new Date().toISOString() },
      bp: { value: '120/80', unit: 'mmHg', status: 'Normal', timestamp: new Date().toISOString() }
    }
  };

  try {
    const record = await savePatientRecord(testPatient);
    console.log('✅ Test patient record created');
    console.log('   ID:', record.id);
    console.log('   Synced:', record.synced ? 'Yes' : 'No (local only)');
    
    // Clean up test record
    if (supabase && record.synced) {
      await supabase.from('patients').delete().eq('id', record.id);
      console.log('🧹 Test record cleaned up from database');
    }
  } catch (error: any) {
    console.log('❌ Failed to create test record:', error.message);
  }

  console.log('\n✨ Test complete! Check messages above for any issues.');
};

// Test assistance requests
export const testAssistanceRequests = async () => {
  console.log('🔍 Testing assistance requests...\n');

  if (!supabase) {
    console.log('❌ Supabase not configured');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('assistance_requests')
      .select('count');
    
    if (error) throw error;
    console.log('✅ Can access assistance_requests table');
    console.log(`   Current requests: ${data?.[0]?.count || 0}`);
  } catch (error: any) {
    console.log('❌ Cannot access assistance_requests table');
    console.log('   Error:', error.message);
    console.log('   Solution: Run migration script database/migration_add_assistance_requests.sql');
  }
};

// Quick status check
export const checkSystemStatus = () => {
  console.log('📊 System Status Check\n');
  
  console.log('Environment Variables:');
  console.log('  VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('  VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
  
  console.log('\nLocal Storage:');
  const records = localStorage.getItem('lourdes_patient_records');
  const settings = localStorage.getItem('lourdes_kiosk_config');
  console.log('  Patient Records:', records ? `✅ ${JSON.parse(records).length} records` : '⚠️ Empty');
  console.log('  Kiosk Settings:', settings ? '✅ Configured' : '⚠️ Using defaults');
  
  console.log('\nSupabase Client:');
  console.log('  Status:', supabase ? '✅ Initialized' : '❌ Not initialized');
  
  console.log('\n💡 Tip: Run testDatabaseConnection() for detailed checks');
};

// Export for console access
if (typeof window !== 'undefined') {
  (window as any).testDB = {
    connection: testDatabaseConnection,
    assistance: testAssistanceRequests,
    status: checkSystemStatus
  };
  console.log('🧪 Test utilities loaded! Run these in console:');
  console.log('  testDB.status()           - Quick status check');
  console.log('  testDB.connection()       - Full connection test');
  console.log('  testDB.assistance()       - Test assistance requests');
}
