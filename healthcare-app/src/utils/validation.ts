import { z } from 'zod';

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Registration schema
export const registrationSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    emergencyContact: z.string().min(10, 'Emergency contact must be at least 10 digits'),
    dateOfBirth: z.date(),
    gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']),
    bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    patientId: z.string().min(3, 'Patient ID must be at least 3 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Health prediction schema
export const healthPredictionSchema = z.object({
  age: z.number().min(0).max(150, 'Age must be between 0 and 150'),
  weight: z.number().min(0).max(300, 'Weight must be between 0 and 300 kg'),
  height: z.number().min(0).max(300, 'Height must be between 0 and 300 cm'),
  exercise: z.number().min(0).max(24, 'Exercise hours must be between 0 and 24'),
  sleep: z.number().min(0).max(24, 'Sleep hours must be between 0 and 24'),
  sugarIntake: z.number().min(0, 'Sugar intake must be positive'),
  bmi: z.number().min(0).max(100, 'BMI must be between 0 and 100'),
  smoking: z.boolean(),
  alcohol: z.boolean(),
  profession: z.enum([
    'Doctor',
    'Driver',
    'Engineer',
    'Farmer',
    'Office Worker',
    'Student',
    'Teacher',
  ]),
});

// Depression assessment schema
export const depressionAssessmentSchema = z.object({
  gender: z.string().min(1, 'Gender is required'),
  age: z.number().min(13, 'Age must be at least 13').max(150, 'Age must be less than 150'),
  profession: z.string().min(1, 'Profession/Status is required'),
  sleepDuration: z
    .number()
    .min(0, 'Sleep duration must be positive')
    .max(24, 'Sleep duration cannot exceed 24 hours'),
  dietaryHabits: z.string().min(1, 'Dietary habits are required'),
  suicidalThoughts: z.boolean(),
  workHours: z
    .number()
    .min(0, 'Work hours must be positive')
    .max(24, 'Work hours cannot exceed 24'),
  financialStress: z
    .number()
    .min(1, 'Financial stress level must be between 1 and 10')
    .max(10, 'Financial stress level must be between 1 and 10'),
  familyHistory: z.boolean(),
  pressureLevel: z
    .number()
    .min(1, 'Pressure level must be between 1 and 10')
    .max(10, 'Pressure level must be between 1 and 10'),
  satisfactionLevel: z
    .number()
    .min(1, 'Satisfaction level must be between 1 and 10')
    .max(10, 'Satisfaction level must be between 1 and 10'),
});
