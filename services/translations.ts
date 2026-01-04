// Translation System for Lourdes Hospital Kiosk
// Supports English (EN) and Tagalog (TL)

export type Language = 'EN' | 'TL';

export interface Translations {
  // Welcome Screen
  welcome_title: string;
  welcome_subtitle: string;
  welcome_description: string;
  welcome_time_estimate: string;
  welcome_step1: string;
  welcome_step2: string;
  welcome_step3: string;
  welcome_step4: string;
  start_button: string;
  admin_button: string;
  
  // Personal Info Screen
  personal_info_title: string;
  personal_info_subtitle: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  civil_status: string;
  select_gender: string;
  male: string;
  female: string;
  other: string;
  prefer_not_say: string;
  single: string;
  married: string;
  widowed: string;
  separated: string;
  
  // Contact Info Screen
  contact_info_title: string;
  contact_info_subtitle: string;
  phone_number: string;
  address_line1: string;
  address_line2: string;
  city: string;
  province: string;
  postal_code: string;
  guardian_info: string;
  guardian_name: string;
  guardian_phone: string;
  
  // Vitals Briefing Screen
  vitals_briefing_title: string;
  vitals_briefing_subtitle: string;
  vitals_briefing_description: string;
  vitals_to_collect: string;
  respiratory_rate: string;
  pulse_rate: string;
  blood_oxygen: string;
  blood_pressure: string;
  body_temperature: string;
  
  // Vital Measurement Screen
  measuring: string;
  remain_still: string;
  measurement_complete: string;
  measurement_failed: string;
  retry_button: string;
  skip_button: string;
  continue_button: string;
  need_help_button: string;
  
  // Review Screen
  review_title: string;
  review_subtitle: string;
  review_personal: string;
  review_contact: string;
  review_vitals: string;
  review_edit: string;
  submit_button: string;
  
  // Success Screen
  success_title: string;
  success_subtitle: string;
  success_patient_id: string;
  success_next_steps: string;
  success_instruction1: string;
  success_instruction2: string;
  success_instruction3: string;
  print_button: string;
  new_patient_button: string;
  
  // Assistance Screen
  assistance_title: string;
  assistance_subtitle: string;
  assistance_description: string;
  assistance_wait_message: string;
  assistance_location: string;
  assistance_cancel: string;
  
  // Common/Navigation
  next_button: string;
  back_button: string;
  cancel_button: string;
  required_field: string;
  optional_field: string;
  
  // Vital Instructions
  vital_instruction_respiratory_1: string;
  vital_instruction_respiratory_2: string;
  vital_instruction_respiratory_3: string;
  vital_instruction_pulse_1: string;
  vital_instruction_pulse_2: string;
  vital_instruction_pulse_3: string;
  vital_instruction_spo2_1: string;
  vital_instruction_spo2_2: string;
  vital_instruction_spo2_3: string;
  vital_instruction_bp_1: string;
  vital_instruction_bp_2: string;
  vital_instruction_bp_3: string;
  vital_instruction_temp_1: string;
  vital_instruction_temp_2: string;
  vital_instruction_temp_3: string;
  
  // Accessibility
  font_size: string;
  high_contrast: string;
  audio_guide: string;
  screen_reader: string;
  language: string;
}

export const translations: Record<Language, Translations> = {
  EN: {
    // Welcome Screen
    welcome_title: 'Welcome to VITALIS',
    welcome_subtitle: 'We\'re here to help you get started',
    welcome_description: 'This kiosk will guide you through a quick and easy registration process.',
    welcome_time_estimate: 'This will take about 5-7 minutes:',
    welcome_step1: 'Review Personal Information',
    welcome_step2: 'Update Contact Details',
    welcome_step3: 'Measure Vital Signs',
    welcome_step4: 'Confirm & Submit',
    start_button: 'Start Check-In',
    admin_button: 'Admin',
    
    // Personal Info Screen
    personal_info_title: 'Personal Information',
    personal_info_subtitle: 'Please provide your basic details',
    first_name: 'First Name',
    last_name: 'Last Name',
    date_of_birth: 'Date of Birth',
    gender: 'Gender',
    civil_status: 'Civil Status',
    select_gender: 'Select Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    prefer_not_say: 'Prefer not to say',
    single: 'Single',
    married: 'Married',
    widowed: 'Widowed',
    separated: 'Separated',
    
    // Contact Info Screen
    contact_info_title: 'Contact Information',
    contact_info_subtitle: 'How can we reach you?',
    phone_number: 'Phone Number',
    address_line1: 'Address Line 1',
    address_line2: 'Address Line 2 (Optional)',
    city: 'City/Municipality',
    province: 'Province',
    postal_code: 'Postal Code',
    guardian_info: 'Guardian Information (Optional)',
    guardian_name: 'Guardian Name',
    guardian_phone: 'Guardian Phone',
    
    // Vitals Briefing Screen
    vitals_briefing_title: 'We\'ll now measure 5 vital signs',
    vitals_briefing_subtitle: 'using our automated devices.',
    vitals_briefing_description: 'Our staff will assist you with each measurement to ensure accuracy and your comfort. Please relax and follow the on-screen instructions.',
    vitals_to_collect: 'Vitals to collect:',
    respiratory_rate: 'Respiratory Rate',
    pulse_rate: 'Pulse Rate',
    blood_oxygen: 'Blood Oxygen (SpO₂)',
    blood_pressure: 'Blood Pressure',
    body_temperature: 'Body Temperature',
    
    // Vital Measurement Screen
    measuring: 'Measuring',
    remain_still: 'Please remain still',
    measurement_complete: 'Measurement Complete',
    measurement_failed: 'Measurement Failed',
    retry_button: 'Retry Measurement',
    skip_button: 'Skip (Optional)',
    continue_button: 'Continue',
    need_help_button: 'Need Help?',
    
    // Review Screen
    review_title: 'Review Your Information',
    review_subtitle: 'Please confirm all details are correct',
    review_personal: 'Personal Information',
    review_contact: 'Contact Information',
    review_vitals: 'Vital Signs',
    review_edit: 'Edit',
    submit_button: 'Submit Check-In',
    
    // Success Screen
    success_title: 'Check-In Complete!',
    success_subtitle: 'Thank you for completing your registration',
    success_patient_id: 'Patient ID',
    success_next_steps: 'Next Steps:',
    success_instruction1: 'Please take a seat in the waiting area (Zone B, Blue Chairs)',
    success_instruction2: 'Your name will be called when ready',
    success_instruction3: 'Average wait time: 15-20 minutes',
    print_button: 'Print Receipt',
    new_patient_button: 'New Patient Check-In',
    
    // Assistance Screen
    assistance_title: 'Assistance Requested',
    assistance_subtitle: 'Staff notified',
    assistance_description: 'Please remain at the kiosk. Help will arrive shortly to assist you with the check-in process.',
    assistance_wait_message: 'A nurse is on their way.',
    assistance_location: 'Location',
    assistance_cancel: 'Cancel Request & Return',
    
    // Common/Navigation
    next_button: 'Next',
    back_button: 'Back',
    cancel_button: 'Cancel',
    required_field: 'Required',
    optional_field: 'Optional',
    
    // Vital Instructions
    vital_instruction_respiratory_1: 'Sit upright comfortably.',
    vital_instruction_respiratory_2: 'Breathe normally.',
    vital_instruction_respiratory_3: 'Do not talk during measurement.',
    vital_instruction_pulse_1: 'Place your finger on the sensor.',
    vital_instruction_pulse_2: 'Keep your hand still.',
    vital_instruction_pulse_3: 'Relax your arm.',
    vital_instruction_spo2_1: 'Insert your finger into the clip.',
    vital_instruction_spo2_2: 'Keep steady.',
    vital_instruction_spo2_3: 'Breathe normally.',
    vital_instruction_bp_1: 'Rest your arm on the table.',
    vital_instruction_bp_2: 'Cuff should be snug.',
    vital_instruction_bp_3: 'Keep feet flat on floor.',
    vital_instruction_temp_1: 'Look at the sensor.',
    vital_instruction_temp_2: 'Remove glasses or hat.',
    vital_instruction_temp_3: 'Stay still.',
    
    // Accessibility
    font_size: 'Font Size',
    high_contrast: 'High Contrast',
    audio_guide: 'Audio Guide',
    screen_reader: 'Screen Reader',
    language: 'Language',
  },
  
  TL: {
    // Welcome Screen
    welcome_title: 'Maligayang Pagdating sa VITALIS',
    welcome_subtitle: 'Nandito kami upang tulungan ka',
    welcome_description: 'Ang kiosk na ito ay gagabay sa iyo sa isang mabilis at madaling proseso ng rehistrasyon.',
    welcome_time_estimate: 'Aabutin lamang ng 5-7 minuto:',
    welcome_step1: 'Suriin ang Personal na Impormasyon',
    welcome_step2: 'I-update ang Detalye ng Pakikipag-ugnayan',
    welcome_step3: 'Sukatin ang Vital Signs',
    welcome_step4: 'Kumpirmahin at Isumite',
    start_button: 'Simulan ang Check-In',
    admin_button: 'Admin',
    
    // Personal Info Screen
    personal_info_title: 'Personal na Impormasyon',
    personal_info_subtitle: 'Pakibigay ang iyong pangunahing detalye',
    first_name: 'Pangalan',
    last_name: 'Apelyido',
    date_of_birth: 'Petsa ng Kapanganakan',
    gender: 'Kasarian',
    civil_status: 'Katayuang Sibil',
    select_gender: 'Pumili ng Kasarian',
    male: 'Lalaki',
    female: 'Babae',
    other: 'Iba pa',
    prefer_not_say: 'Ayaw sabihin',
    single: 'Single',
    married: 'Kasal',
    widowed: 'Biyudo/Biyuda',
    separated: 'Hiwalay',
    
    // Contact Info Screen
    contact_info_title: 'Impormasyon sa Pakikipag-ugnayan',
    contact_info_subtitle: 'Paano ka namin maaabot?',
    phone_number: 'Numero ng Telepono',
    address_line1: 'Address Line 1',
    address_line2: 'Address Line 2 (Opsyonal)',
    city: 'Lungsod/Munisipalidad',
    province: 'Probinsya',
    postal_code: 'Postal Code',
    guardian_info: 'Impormasyon ng Tagapag-alaga (Opsyonal)',
    guardian_name: 'Pangalan ng Tagapag-alaga',
    guardian_phone: 'Telepono ng Tagapag-alaga',
    
    // Vitals Briefing Screen
    vitals_briefing_title: 'Susukatin natin ang 5 vital signs',
    vitals_briefing_subtitle: 'gamit ang aming automated devices.',
    vitals_briefing_description: 'Tutulungan ka ng aming staff sa bawat pagsukat upang masiguro ang katumpakan at iyong kaginhawahan. Mangyaring magrelaks at sundin ang mga tagubilin sa screen.',
    vitals_to_collect: 'Vital signs na susukatin:',
    respiratory_rate: 'Respiratory Rate',
    pulse_rate: 'Pulse Rate',
    blood_oxygen: 'Blood Oxygen (SpO₂)',
    blood_pressure: 'Blood Pressure',
    body_temperature: 'Temperatura ng Katawan',
    
    // Vital Measurement Screen
    measuring: 'Sinusukat',
    remain_still: 'Mangyaring manatiling tahimik',
    measurement_complete: 'Tapos na ang Pagsukat',
    measurement_failed: 'Nabigo ang Pagsukat',
    retry_button: 'Subukan Muli ang Pagsukat',
    skip_button: 'Laktawan (Opsyonal)',
    continue_button: 'Magpatuloy',
    need_help_button: 'Kailangan ng Tulong?',
    
    // Review Screen
    review_title: 'Suriin ang Iyong Impormasyon',
    review_subtitle: 'Pakikumpirma na tama ang lahat ng detalye',
    review_personal: 'Personal na Impormasyon',
    review_contact: 'Impormasyon sa Pakikipag-ugnayan',
    review_vitals: 'Vital Signs',
    review_edit: 'I-edit',
    submit_button: 'Isumite ang Check-In',
    
    // Success Screen
    success_title: 'Tapos na ang Check-In!',
    success_subtitle: 'Salamat sa pagkumpleto ng iyong rehistrasyon',
    success_patient_id: 'Patient ID',
    success_next_steps: 'Mga Susunod na Hakbang:',
    success_instruction1: 'Mangyaring umupo sa waiting area (Zone B, Blue Chairs)',
    success_instruction2: 'Tatawagin ang iyong pangalan kapag handa na',
    success_instruction3: 'Average na oras ng paghihintay: 15-20 minuto',
    print_button: 'I-print ang Resibo',
    new_patient_button: 'Bagong Patient Check-In',
    
    // Assistance Screen
    assistance_title: 'Humiling ng Tulong',
    assistance_subtitle: 'Naabisuhan na ang staff',
    assistance_description: 'Mangyaring manatili sa kiosk. Darating na ang tulong upang tulungan ka sa proseso ng check-in.',
    assistance_wait_message: 'Paparating na ang isang nurse.',
    assistance_location: 'Lokasyon',
    assistance_cancel: 'Kanselahin ang Kahilingan at Bumalik',
    
    // Common/Navigation
    next_button: 'Susunod',
    back_button: 'Bumalik',
    cancel_button: 'Kanselahin',
    required_field: 'Kinakailangan',
    optional_field: 'Opsyonal',
    
    // Vital Instructions
    vital_instruction_respiratory_1: 'Umupo nang tuwid at komportable.',
    vital_instruction_respiratory_2: 'Huminga nang normal.',
    vital_instruction_respiratory_3: 'Huwag magsalita habang sinusukat.',
    vital_instruction_pulse_1: 'Ilagay ang iyong daliri sa sensor.',
    vital_instruction_pulse_2: 'Panatilihing tahimik ang kamay.',
    vital_instruction_pulse_3: 'Irelaks ang braso.',
    vital_instruction_spo2_1: 'Ipasok ang daliri sa clip.',
    vital_instruction_spo2_2: 'Panatilihing matatag.',
    vital_instruction_spo2_3: 'Huminga nang normal.',
    vital_instruction_bp_1: 'Ipahinga ang braso sa mesa.',
    vital_instruction_bp_2: 'Ang cuff ay dapat mahigpit.',
    vital_instruction_bp_3: 'Panatilihing patag ang mga paa sa sahig.',
    vital_instruction_temp_1: 'Tumingin sa sensor.',
    vital_instruction_temp_2: 'Alisin ang salamin o sombrero.',
    vital_instruction_temp_3: 'Manatiling tahimik.',
    
    // Accessibility
    font_size: 'Laki ng Font',
    high_contrast: 'Mataas na Contrast',
    audio_guide: 'Audio Guide',
    screen_reader: 'Screen Reader',
    language: 'Wika',
  },
};

// Helper function to get translation
export const t = (key: keyof Translations, language: Language = 'EN'): string => {
  return translations[language][key] || translations['EN'][key];
};

// Helper function to get vital instructions as array
export const getVitalInstructions = (vitalType: string, language: Language = 'EN'): string[] => {
  const instructionKeys: Record<string, [keyof Translations, keyof Translations, keyof Translations]> = {
    'respiratoryRate': ['vital_instruction_respiratory_1', 'vital_instruction_respiratory_2', 'vital_instruction_respiratory_3'],
    'pulse': ['vital_instruction_pulse_1', 'vital_instruction_pulse_2', 'vital_instruction_pulse_3'],
    'spo2': ['vital_instruction_spo2_1', 'vital_instruction_spo2_2', 'vital_instruction_spo2_3'],
    'bp': ['vital_instruction_bp_1', 'vital_instruction_bp_2', 'vital_instruction_bp_3'],
    'temperature': ['vital_instruction_temp_1', 'vital_instruction_temp_2', 'vital_instruction_temp_3'],
  };
  
  const keys = instructionKeys[vitalType];
  if (!keys) return [];
  
  return keys.map(key => t(key, language));
};
