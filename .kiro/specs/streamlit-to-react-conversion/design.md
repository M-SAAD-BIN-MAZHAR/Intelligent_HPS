# Design Document

## Overview

This design document outlines the architecture and implementation strategy for converting the Intelligent Hospital Management System from Streamlit to a modern React-based web application. The system will maintain all existing functionality while providing a superior user experience through modern web technologies, responsive design, and optimized performance.

The React application will serve as the frontend client, communicating with existing FastAPI backends for ML model inference and database operations. The design emphasizes modularity, maintainability, and scalability while delivering a beautiful, intuitive user interface.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Port 5173)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Landing    │  │   Patient    │  │   Doctor     │      │
│  │     Page     │  │   Portal     │  │  Dashboard   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         State Management (Zustand/Context)            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Client Layer (Axios)                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  FastAPI Backends (Port 8000)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Health Risk  │  │  Pneumonia   │  │  Depression  │      │
│  │  Prediction  │  │  Detection   │  │  Assessment  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────────────────────────┐    │
│  │   Medical    │  │      Authentication API          │    │
│  │   Chatbot    │  │                                  │    │
│  └──────────────┘  └──────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL Database                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Patient Data │  │  Chat Threads│  │  Medical     │      │
│  │              │  │              │  │  Records     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite (fast development and optimized builds)
- **UI Library**: Material-UI (MUI) v5 for comprehensive component library
- **Styling**: Emotion (CSS-in-JS) + Tailwind CSS for utility classes
- **State Management**: Zustand (lightweight and simple)
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **Form Management**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Icons**: React Icons (Lucide React)
- **Animations**: Framer Motion

**Backend (Existing):**
- FastAPI for REST APIs
- TensorFlow/Keras for ML models
- LangChain for RAG chatbot
- PostgreSQL for data persistence

## Components and Interfaces

### Component Hierarchy

```
App
├── Router
│   ├── LandingPage
│   │   ├── Header
│   │   ├── HeroSection
│   │   ├── RoleSelection
│   │   └── FeatureGrid
│   │
│   ├── AuthPages
│   │   ├── LoginPage
│   │   │   └── LoginForm
│   │   └── RegisterPage
│   │       └── RegistrationForm
│   │
│   ├── PatientPortal (Protected)
│   │   ├── PatientDashboard
│   │   │   ├── DashboardHeader
│   │   │   ├── ProfileCard
│   │   │   └── ServiceGrid
│   │   │
│   │   ├── HealthPrediction
│   │   │   ├── HealthForm
│   │   │   └── ResultDisplay
│   │   │
│   │   ├── PneumoniaDetection
│   │   │   ├── ImageUploader
│   │   │   ├── ImagePreview
│   │   │   └── DiagnosisResult
│   │   │
│   │   ├── DepressionAssessment
│   │   │   ├── AssessmentForm
│   │   │   └── RiskDisplay
│   │   │
│   │   └── MedicalChatbot
│   │       ├── ChatSidebar
│   │       ├── ChatWindow
│   │       ├── MessageList
│   │       └── MessageInput
│   │
│   └── DoctorDashboard (Protected)
│       ├── DashboardHeader
│       ├── PatientList
│       └── ReportsView
│
└── SharedComponents
    ├── GlassCard
    ├── GradientButton
    ├── LoadingSpinner
    ├── ErrorBoundary
    └── ProtectedRoute
```

### Core Components

#### 1. Layout Components

**GlassCard Component**
```typescript
interface GlassCardProps {
  children: React.ReactNode;
  blur?: number;
  opacity?: number;
  padding?: number;
  className?: string;
}
```
- Implements glassmorphism effect with backdrop blur
- Configurable transparency and blur intensity
- Responsive padding and border radius

**GradientButton Component**
```typescript
interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
}
```
- Gradient background with hover animations
- Loading state with spinner
- Accessible with keyboard navigation

#### 2. Authentication Components

**LoginForm Component**
```typescript
interface LoginFormProps {
  onSuccess: (userData: UserData) => void;
  onRegisterClick: () => void;
}

interface LoginCredentials {
  email: string;
  password: string;
}
```
- Form validation with Zod schema
- Error handling and display
- Remember me functionality

**RegistrationForm Component**
```typescript
interface RegistrationFormProps {
  onSuccess: (userData: UserData) => void;
  onLoginClick: () => void;
}

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  patientId: string;
  password: string;
  confirmPassword: string;
}
```
- Multi-step form with progress indicator
- Real-time validation feedback
- Password strength indicator

#### 3. Feature Components

**HealthPredictionForm Component**
```typescript
interface HealthPredictionFormProps {
  onSubmit: (data: HealthData) => Promise<void>;
}

interface HealthData {
  age: number;
  weight: number;
  height: number;
  exercise: number;
  sleep: number;
  sugarIntake: number;
  bmi: number;
  smoking: boolean;
  alcohol: boolean;
  profession: ProfessionType;
}

interface HealthPredictionResult {
  riskPrediction: 0 | 1;
  riskStatus: 'High Risk' | 'Low Risk/Save';
}
```

**PneumoniaDetection Component**
```typescript
interface PneumoniaDetectionProps {
  onUpload: (file: File) => Promise<void>;
}

interface PneumoniaResult {
  probability: number;
  label: 'Pneumonia' | 'Normal';
  imagePreview: string;
}
```

**MedicalChatbot Component**
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatThread {
  id: string;
  messages: Message[];
  createdAt: Date;
}

interface MedicalChatbotProps {
  userId: string;
}
```

### API Service Layer

**API Client Configuration**
```typescript
// src/services/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**API Service Interfaces**
```typescript
// Authentication API
interface AuthAPI {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(data: RegistrationData): Promise<AuthResponse>;
  logout(): Promise<void>;
  refreshToken(): Promise<TokenResponse>;
}

// Health Prediction API
interface HealthPredictionAPI {
  predictRisk(data: HealthData): Promise<HealthPredictionResult>;
}

// Pneumonia Detection API
interface PneumoniaAPI {
  detectPneumonia(image: File): Promise<PneumoniaResult>;
}

// Depression Assessment API
interface DepressionAPI {
  assessDepression(data: DepressionData): Promise<DepressionResult>;
}

// Chatbot API
interface ChatbotAPI {
  sendMessage(threadId: string, message: string): Promise<ChatResponse>;
  getThreads(userId: string): Promise<ChatThread[]>;
  getThread(threadId: string): Promise<ChatThread>;
  createThread(): Promise<{ threadId: string }>;
}
```

## Data Models

### User Models

```typescript
interface User {
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
  role: 'patient' | 'doctor';
  createdAt: Date;
  updatedAt: Date;
}

type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';
type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
```

### Health Assessment Models

```typescript
interface HealthAssessment {
  id: string;
  userId: string;
  assessmentType: 'health_risk' | 'pneumonia' | 'depression';
  data: Record<string, any>;
  result: Record<string, any>;
  createdAt: Date;
}

interface HealthRiskAssessment extends HealthAssessment {
  assessmentType: 'health_risk';
  data: HealthData;
  result: HealthPredictionResult;
}

interface PneumoniaAssessment extends HealthAssessment {
  assessmentType: 'pneumonia';
  data: { imageUrl: string };
  result: PneumoniaResult;
}

interface DepressionAssessment extends HealthAssessment {
  assessmentType: 'depression';
  data: DepressionData;
  result: DepressionResult;
}
```

### State Management Models

```typescript
// Zustand Store
interface AppState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegistrationData) => Promise<void>;
  logout: () => void;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Chat state
  currentThreadId: string | null;
  threads: ChatThread[];
  setCurrentThread: (threadId: string) => void;
  addThread: (thread: ChatThread) => void;
  
  // Assessment history
  assessments: HealthAssessment[];
  addAssessment: (assessment: HealthAssessment) => void;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Authentication state consistency
*For any* user session, when a user successfully logs in, the authentication state should be set to true, user data should be stored in state management, and the auth token should be persisted in local storage.
**Validates: Requirements 2.4**

### Property 2: Protected route access control
*For any* protected route navigation attempt, if the user is not authenticated, the application should redirect to the login page and preserve the intended destination for post-login redirect.
**Validates: Requirements 2.6**

### Property 3: Form validation consistency
*For any* form submission across the application, all required fields must be validated before API submission, and validation errors should be displayed to the user with specific field-level feedback.
**Validates: Requirements 2.2, 5.2, 6.2, 7.2**

### Property 4: API error handling
*For any* API request that fails, the application should catch the error, display a user-friendly error message, and provide a retry mechanism without crashing the application.
**Validates: Requirements 11.3, 11.4**

### Property 5: Session persistence
*For any* authenticated user, when the page is refreshed or the browser is reopened, the session should be restored from local storage if the token is still valid, maintaining the user's authenticated state.
**Validates: Requirements 2.4**

### Property 6: Responsive layout adaptation
*For any* screen size change, all components should adapt their layout appropriately, ensuring content remains accessible and usable on mobile, tablet, and desktop devices.
**Validates: Requirements 10.1, 10.2, 10.3**

### Property 7: Health prediction data transformation
*For any* health prediction form submission, the profession selection should be correctly one-hot encoded into seven binary fields before sending to the API, matching the expected backend format.
**Validates: Requirements 5.3**

### Property 8: Image upload validation
*For any* file upload in pneumonia detection, the application should validate that the file is an image (JPG or PNG), is within size limits, and display appropriate error messages for invalid files.
**Validates: Requirements 6.1, 6.7**

### Property 9: Chat message ordering
*For any* chat thread, messages should be displayed in chronological order with user messages and assistant messages clearly distinguished by styling and positioning.
**Validates: Requirements 8.2, 8.4**

### Property 10: Logout state cleanup
*For any* logout action, the application should clear all user data from state management, remove auth tokens from local storage, reset all feature-specific state, and redirect to the landing page.
**Validates: Requirements 2.5**

### Property 11: Loading state visibility
*For any* asynchronous operation (API call, file upload, etc.), a loading indicator should be displayed to the user while the operation is in progress and hidden when complete or failed.
**Validates: Requirements 11.2**

### Property 12: Risk result visual consistency
*For any* health assessment result (health risk, depression, pneumonia), high-risk results should be displayed with red/error styling and warning icons, while low-risk results should use green/success styling and positive icons.
**Validates: Requirements 5.5, 5.6, 6.5, 6.6, 7.5, 7.6**

### Property 13: Navigation state preservation
*For any* navigation between pages within the patient portal, the user's authentication state and profile data should be preserved without requiring re-authentication.
**Validates: Requirements 4.7**

### Property 14: Form input sanitization
*For any* user input field, the application should sanitize input to prevent XSS attacks by escaping special characters and validating against expected patterns.
**Validates: Requirements 14.4**

### Property 15: API request authentication
*For any* API request to protected endpoints, the request should include a valid authentication token in the Authorization header, and handle 401 responses by redirecting to login.
**Validates: Requirements 14.3**

## Error Handling

### Error Categories

1. **Network Errors**
   - Connection timeout
   - Server unreachable
   - DNS resolution failure
   - Strategy: Display retry button, cache last successful state

2. **Authentication Errors**
   - Invalid credentials
   - Expired token
   - Unauthorized access
   - Strategy: Clear session, redirect to login, preserve intended destination

3. **Validation Errors**
   - Invalid form input
   - Missing required fields
   - Format mismatch
   - Strategy: Display field-level errors, prevent submission, provide examples

4. **API Errors**
   - 400 Bad Request: Show specific error message from API
   - 404 Not Found: Display "resource not found" message
   - 500 Server Error: Show generic error, log details, provide support contact
   - 503 Service Unavailable: Display maintenance message

5. **File Upload Errors**
   - Invalid file type
   - File too large
   - Upload interrupted
   - Strategy: Validate before upload, show progress, allow retry

### Error Handling Implementation

```typescript
// Global error handler
class ErrorHandler {
  static handle(error: Error | AxiosError): UserFriendlyError {
    if (axios.isAxiosError(error)) {
      return this.handleAPIError(error);
    }
    return this.handleGenericError(error);
  }
  
  static handleAPIError(error: AxiosError): UserFriendlyError {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    
    switch (status) {
      case 400:
        return { title: 'Invalid Request', message, canRetry: false };
      case 401:
        return { title: 'Unauthorized', message: 'Please log in again', canRetry: false };
      case 404:
        return { title: 'Not Found', message: 'Resource not found', canRetry: false };
      case 500:
        return { title: 'Server Error', message: 'Please try again later', canRetry: true };
      default:
        return { title: 'Error', message: 'Something went wrong', canRetry: true };
    }
  }
}

// Error Boundary Component
class ErrorBoundary extends React.Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error tracking service (e.g., Sentry)
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.resetError} />;
    }
    return this.props.children;
  }
}
```

## Testing Strategy

### Unit Testing

**Framework**: Jest + React Testing Library

**Coverage Areas**:
1. **Component Rendering**: Verify components render with correct props
2. **User Interactions**: Test button clicks, form submissions, input changes
3. **Conditional Rendering**: Test components show/hide based on state
4. **Utility Functions**: Test data transformation, validation, formatting

**Example Test Cases**:
- LoginForm renders with email and password fields
- GradientButton shows loading spinner when loading prop is true
- HealthPredictionForm validates numeric inputs are positive
- ErrorHandler returns correct error message for 401 status

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Each property test should run a minimum of 100 iterations to ensure comprehensive coverage across random inputs.

**Test Tagging**: Each property-based test must include a comment with the format:
```typescript
// Feature: streamlit-to-react-conversion, Property 1: Authentication state consistency
```

**Property Test Implementation**:

```typescript
import fc from 'fast-check';

// Property 1: Authentication state consistency
// Feature: streamlit-to-react-conversion, Property 1: Authentication state consistency
test('authentication state consistency', () => {
  fc.assert(
    fc.property(
      fc.record({
        email: fc.emailAddress(),
        password: fc.string({ minLength: 8 }),
      }),
      async (credentials) => {
        const store = createTestStore();
        await store.login(credentials);
        
        // After successful login, all three conditions must be true
        expect(store.isAuthenticated).toBe(true);
        expect(store.user).not.toBeNull();
        expect(localStorage.getItem('authToken')).not.toBeNull();
      }
    ),
    { numRuns: 100 }
  );
});

// Property 3: Form validation consistency
// Feature: streamlit-to-react-conversion, Property 3: Form validation consistency
test('form validation prevents submission with invalid data', () => {
  fc.assert(
    fc.property(
      fc.record({
        age: fc.integer({ min: -100, max: 200 }),
        weight: fc.integer({ min: -50, max: 500 }),
        email: fc.string(),
      }),
      (formData) => {
        const errors = validateHealthForm(formData);
        const hasErrors = Object.keys(errors).length > 0;
        const shouldHaveErrors = 
          formData.age < 0 || formData.age > 150 ||
          formData.weight < 0 || formData.weight > 300 ||
          !isValidEmail(formData.email);
        
        expect(hasErrors).toBe(shouldHaveErrors);
      }
    ),
    { numRuns: 100 }
  );
});

// Property 7: Health prediction data transformation
// Feature: streamlit-to-react-conversion, Property 7: Health prediction data transformation
test('profession one-hot encoding is correct', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('Doctor', 'Driver', 'Engineer', 'Farmer', 'Office Worker', 'Student', 'Teacher'),
      (profession) => {
        const encoded = oneHotEncodeProfession(profession);
        const professionKeys = [
          'profession_doctor', 'profession_driver', 'profession_engineer',
          'profession_farmer', 'profession_office_worker', 'profession_student', 'profession_teacher'
        ];
        
        // Exactly one field should be 1, all others should be 0
        const sum = professionKeys.reduce((acc, key) => acc + encoded[key], 0);
        expect(sum).toBe(1);
        
        // The correct field should be 1
        const expectedKey = `profession_${profession.toLowerCase().replace(' ', '_')}`;
        expect(encoded[expectedKey]).toBe(1);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Integration Testing

**Framework**: React Testing Library + MSW (Mock Service Worker)

**Test Scenarios**:
1. Complete user registration flow
2. Login → Dashboard → Feature navigation
3. Health prediction form submission → API call → Result display
4. Image upload → Pneumonia detection → Result rendering
5. Chat message send → Streaming response → History update

### End-to-End Testing

**Framework**: Playwright

**Critical User Flows**:
1. New user registration and first login
2. Patient completes health risk assessment
3. Patient uploads X-ray for pneumonia detection
4. Patient interacts with medical chatbot
5. User logout and re-login with session restoration

## Performance Optimization

### Code Splitting

```typescript
// Lazy load route components
const PatientDashboard = lazy(() => import('./pages/PatientDashboard'));
const HealthPrediction = lazy(() => import('./pages/HealthPrediction'));
const PneumoniaDetection = lazy(() => import('./pages/PneumoniaDetection'));

// Route configuration with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard" element={<PatientDashboard />} />
    <Route path="/health-prediction" element={<HealthPrediction />} />
  </Routes>
</Suspense>
```

### Image Optimization

- Lazy load images using Intersection Observer
- Compress uploaded images before sending to API
- Use WebP format with fallback to JPEG/PNG
- Implement progressive image loading

### State Management Optimization

```typescript
// Zustand with selective subscriptions
const useAuth = () => useStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
}), shallow);

// Prevent unnecessary re-renders
const MemoizedComponent = React.memo(Component, (prev, next) => {
  return prev.data.id === next.data.id;
});
```

### API Response Caching

```typescript
// Cache GET requests for static data
const cache = new Map();

async function fetchWithCache(url: string, ttl: number = 300000) {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  
  const data = await apiClient.get(url);
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}
```

## Deployment Strategy

### Build Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@mui/material', '@emotion/react'],
          'chart-vendor': ['recharts'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
```

### Environment Configuration

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Smart Healthcare System
VITE_ENABLE_ANALYTICS=false

# .env.production
VITE_API_BASE_URL=https://api.healthcare.com
VITE_APP_NAME=Smart Healthcare System
VITE_ENABLE_ANALYTICS=true
```

### Docker Configuration

```dockerfile
# Multi-stage build for React app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Security Considerations

### Authentication Security

- Store JWT tokens in httpOnly cookies (preferred) or secure localStorage
- Implement token refresh mechanism before expiration
- Use HTTPS in production for all communications
- Implement CSRF protection for state-changing operations

### Input Sanitization

```typescript
import DOMPurify from 'dompurify';

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}
```

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               connect-src 'self' http://localhost:8000;">
```

## Accessibility

### WCAG 2.1 AA Compliance

- Semantic HTML elements (header, nav, main, footer)
- ARIA labels for interactive elements
- Keyboard navigation support (Tab, Enter, Escape)
- Focus indicators for all interactive elements
- Color contrast ratio minimum 4.5:1
- Screen reader announcements for dynamic content
- Skip navigation links

### Implementation Example

```typescript
<GradientButton
  onClick={handleSubmit}
  aria-label="Submit health prediction form"
  aria-busy={isLoading}
  aria-disabled={hasErrors}
>
  {isLoading ? 'Processing...' : 'Predict Risk'}
</GradientButton>
```

## Migration Strategy

### Phase 1: Foundation (Week 1-2)
- Set up React project with Vite and TypeScript
- Configure routing, state management, and API client
- Implement authentication pages (login, register)
- Create shared components (GlassCard, GradientButton, etc.)

### Phase 2: Core Features (Week 3-4)
- Implement Patient Dashboard
- Build Health Risk Prediction feature
- Build Pneumonia Detection feature
- Build Depression Assessment feature

### Phase 3: Advanced Features (Week 5-6)
- Implement Medical Chatbot with streaming
- Build Doctor Dashboard
- Add assessment history and profile management

### Phase 4: Polish & Testing (Week 7-8)
- Comprehensive testing (unit, integration, E2E)
- Performance optimization
- Accessibility audit and fixes
- Documentation and deployment

### Parallel Backend Work
- Create authentication API endpoints
- Ensure CORS configuration for React app
- Add file upload handling for images
- Implement chat thread management API
