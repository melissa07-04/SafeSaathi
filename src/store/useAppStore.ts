import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';

export type TrustedContact = {
  id: string;
  name: string;
  phone: string;
  relation?: string;
};

export type UserProfile = {
  name?: string;
  email?: string;
  phone?: string;
  height?: string;
  weight?: string;
  identificationMark?: string;
  bloodGroup?: string;
  allergies?: string;
  medicalConditions?: string;
  securityQuestions?: Array<{ question: string; answer: string }>;
  createdAt?: number;
};

export type JourneyStatus = 'planned' | 'active' | 'completed' | 'sos';

export type Journey = {
  id: string;
  userId: string;
  source: string;
  destination: string;
  status: JourneyStatus;
  eta?: number;
  distance?: string;
  startTime?: number;
  createdAt: number;
  liveLocation?: { lat: number; lng: number };   // ← Added for live tracking
};

type AppState = {
  authUser: FirebaseUser | null;
  profile: UserProfile | null;
  trustedContacts: TrustedContact[];
  activeJourney: Journey | null;
  isSOSActive: boolean;

  setAuthUser: (user: FirebaseUser | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setTrustedContacts: (contacts: TrustedContact[]) => void;
  addTrustedContact: (contact: TrustedContact) => void;
  removeTrustedContact: (id: string) => void;
  setActiveJourney: (journey: Journey | null) => void;
  setSOSActive: (active: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  authUser: null,
  profile: null,
  trustedContacts: [],
  activeJourney: null,
  isSOSActive: false,

  setAuthUser: (authUser) => set({ authUser }),
  setProfile: (profile) => set({ profile }),
  setTrustedContacts: (trustedContacts) => set({ trustedContacts }),
  addTrustedContact: (contact) => set((state) => ({
    trustedContacts: [...state.trustedContacts, contact]
  })),
  removeTrustedContact: (id) => set((state) => ({
    trustedContacts: state.trustedContacts.filter(c => c.id !== id)
  })),
  setActiveJourney: (activeJourney) => set({ activeJourney }),
  setSOSActive: (isSOSActive) => set({ isSOSActive }),
}));