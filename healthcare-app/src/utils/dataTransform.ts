// Define profession type locally to avoid module resolution issues
type ProfessionType = 'Doctor' | 'Driver' | 'Engineer' | 'Farmer' | 'Office Worker' | 'Student' | 'Teacher';

// One-hot encode profession for health prediction API
export const oneHotEncodeProfession = (profession: ProfessionType) => {
  return {
    profession_doctor: profession === 'Doctor' ? 1 : 0,
    profession_driver: profession === 'Driver' ? 1 : 0,
    profession_engineer: profession === 'Engineer' ? 1 : 0,
    profession_farmer: profession === 'Farmer' ? 1 : 0,
    profession_office_worker: profession === 'Office Worker' ? 1 : 0,
    profession_student: profession === 'Student' ? 1 : 0,
    profession_teacher: profession === 'Teacher' ? 1 : 0,
  };
};

// Format date for API
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Parse date from API
export const parseDateFromAPI = (dateString: string): Date => {
  return new Date(dateString);
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
