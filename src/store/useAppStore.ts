import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';

export type UserProfile = {
  name?: string;
  email?: string;
  phone?: string;

  // Personal Details
  height?: string;
  weight?: string;
  identificationMark?: string;

  // Emergency Medical Information
  bloodGroup?: string;
  allergies?: string;
  medicalConditions?: string;     // Changed from 'illnesses' to 'medicalConditions'

  // Security Questions
  securityQuestions?: Array<{
    question: string;
    answer: string;
  }>;

  // Keep old fields for backward compatibility (optional)
  securityQuestion?: string;
  securityAnswer?: string;

  createdAt?: number;
};

export type JourneyStatus = 'planned' | 'active' | 'completed' | 'sos';

export type Journey = {
  id: string;
  userId: string;
  source: string;
  destination: string;
  status: JourneyStatus;
  createdAt: number;
  updatedAt: number;
};

type AppState = {
  authUser: FirebaseUser | null;
  profile: UserProfile | null;
  activeJourney: Journey | null;
  isSOSActive: boolean;

  setAuthUser: (user: FirebaseUser | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setActiveJourney: (journey: Journey | null) => void;
  setSOSActive: (active: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  authUser: null,
  profile: null,
  activeJourney: null,
  isSOSActive: false,

  setAuthUser: (authUser) => set({ authUser }),
  setProfile: (profile) => set({ profile }),
  setActiveJourney: (activeJourney) => set({ activeJourney }),
  setSOSActive: (isSOSActive) => set({ isSOSActive }),
}));