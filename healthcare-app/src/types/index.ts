// User Types
export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type UserRole = 'patient' | 'doctor';

export interface User {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
  dateOfBirth: Date;
  gender: Gender;
  bloodType: BloodType;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
  dateOfBirth: Date;
  gender: Gender;
  bloodType: BloodType;
  patientId: string;
  password: string;
  confirmPassword: string;
}

// Health Assessment Types
export interface HealthData {
  age: number;
  weight: number;
  height: number;
  exercise: number;
  sleep: number;
  sugarIntake: number;
  bmi: number;
  smoking: boolean;
  alcohol: boolean;
  profession: 'Doctor' | 'Driver' | 'Engineer' | 'Farmer' | 'Office Worker' | 'Student' | 'Teacher';
}

export interface HealthPredictionResult {
  riskPrediction: 0 | 1;
  riskStatus: 'High Risk' | 'Low Risk/Save';
}

export interface PneumoniaResult {
  probability: number;
  label: 'Pneumonia' | 'Normal';
  imagePreview: string;
}

export interface DepressionData {
  gender: string;
  age: number;
  profession: string;
  sleepDuration: number;
  dietaryHabits: string;
  suicidalThoughts: boolean;
  workHours: number;
  financialStress: number;
  familyHistory: boolean;
  pressureLevel: number;
  satisfactionLevel: number;
}

export interface DepressionResult {
  riskPrediction: 0 | 1;
  probability: number;
  riskStatus: 'High Risk' | 'Low Risk';
}

// Chat Types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatThread {
  id: string;
  messages: Message[];
  createdAt: Date;
}

// Assessment History
export type AssessmentType = 'health_risk' | 'pneumonia' | 'depression';

export interface HealthAssessment {
  id: string;
  userId: string;
  assessmentType: AssessmentType;
  data: Record<string, unknown>;
  result: Record<string, unknown>;
  createdAt: Date;
}
