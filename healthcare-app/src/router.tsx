/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoadingSpinner, ProtectedRoute } from './components';
import type { ReactNode } from 'react';

// Lazy load pages for code splitting
const LandingPage = lazy(() =>
  import('./pages/LandingPage').then((module) => ({ default: module.LandingPage }))
);
const LoginPage = lazy(() =>
  import('./pages/LoginPage').then((module) => ({ default: module.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('./pages/RegisterPage').then((module) => ({ default: module.RegisterPage }))
);
const PatientDashboard = lazy(() =>
  import('./pages/PatientDashboard').then((module) => ({ default: module.PatientDashboard }))
);
const DoctorDashboard = lazy(() =>
  import('./pages/DoctorDashboard').then((module) => ({ default: module.DoctorDashboard }))
);
const HealthPrediction = lazy(() =>
  import('./pages/HealthPrediction').then((module) => ({ default: module.HealthPrediction }))
);
const PneumoniaDetection = lazy(() =>
  import('./pages/PneumoniaDetection').then((module) => ({ default: module.PneumoniaDetection }))
);
const DepressionAssessment = lazy(() =>
  import('./pages/DepressionAssessment').then((module) => ({
    default: module.DepressionAssessment,
  }))
);
const MedicalChatbot = lazy(() =>
  import('./pages/MedicalChatbot').then((module) => ({ default: module.MedicalChatbot }))
);

// Wrapper component for Suspense
function SuspenseWrapper({ children }: { children: ReactNode }) {
  return <Suspense fallback={<LoadingSpinner message="Loading page..." />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <SuspenseWrapper>
        <LandingPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/login',
    element: (
      <SuspenseWrapper>
        <LoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/register',
    element: (
      <SuspenseWrapper>
        <RegisterPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/patient',
    children: [
      {
        path: 'dashboard',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'health-prediction',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute>
              <HealthPrediction />
            </ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'pneumonia-detection',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute>
              <PneumoniaDetection />
            </ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'depression-assessment',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute>
              <DepressionAssessment />
            </ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'chatbot',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute>
              <MedicalChatbot />
            </ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: '/doctor',
    children: [
      {
        path: 'dashboard',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute>
              <DoctorDashboard />
            </ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
