import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';

export type UserProfile = {
  name: string;
  email: string;
  phone?: string;
  securityQuestion?: string;
  securityAnswer?: string;
  height?: string;
  weight?: string;
  bloodGroup?: string;
  illnesses?: string;
  allergies?: string;
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
