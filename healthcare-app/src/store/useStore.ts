import { create } from 'zustand';
import type {
  User,
  LoginCredentials,
  RegistrationData,
  ChatThread,
  HealthAssessment,
} from '../types';
import apiClient from '../services/api';

interface AppState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegistrationData) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;

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

export const useStore = create<AppState>((set) => ({
  // Auth state
  user: null,
  isAuthenticated: false,

  login: async (credentials: LoginCredentials) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.post('/auth/login', credentials);
      const { user, token } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      let errorMessage = 'Login failed';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.detail || error.response.data?.message || errorMessage;
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Cannot connect to server. Please ensure the backend is running on http://localhost:8000';
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
      }
      
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  register: async (data: RegistrationData) => {
    try {
      set({ isLoading: true, error: null });
      
      // Format the data to ensure dateOfBirth is a string
      const formattedData = {
        ...data,
        dateOfBirth: data.dateOfBirth instanceof Date 
          ? data.dateOfBirth.toISOString().split('T')[0]
          : data.dateOfBirth,
      };
      
      const response = await apiClient.post('/auth/register', formattedData);
      const { user, token } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      let errorMessage = 'Registration failed';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.detail || error.response.data?.message || errorMessage;
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Cannot connect to server. Please ensure the backend is running on http://localhost:8000';
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
      }
      
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    set({
      user: null,
      isAuthenticated: false,
      currentThreadId: null,
      threads: [],
      assessments: [],
    });
  },

  initializeAuth: () => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, isAuthenticated: true });
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  },

  // UI state
  isLoading: false,
  error: null,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),

  // Chat state
  currentThreadId: null,
  threads: [],
  setCurrentThread: (threadId: string) => set({ currentThreadId: threadId }),
  addThread: (thread: ChatThread) => set((state) => ({ threads: [...state.threads, thread] })),

  // Assessment history
  assessments: [],
  addAssessment: (assessment: HealthAssessment) =>
    set((state) => ({ assessments: [...state.assessments, assessment] })),
}));
