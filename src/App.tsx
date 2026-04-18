import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useAppStore } from './store/useAppStore';

import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import Journey from './screens/Journey';
import Contacts from './screens/Contacts';
import Profile from './screens/Profile';
import FeelingSafe from './screens/FeelingSafe';
import SOSButton from './components/SOSButton';
import BottomNav from './components/BottomNav';

export default function App() {
  const { setAuthUser, setProfile } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as any);
          }
        } catch (e) {
          console.error('Error fetching profile', e);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [setAuthUser, setProfile]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-app-bg flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-app-blue"></div>
      </div>
    );
  }

  return (
    <div className="bg-app-bg min-h-screen flex justify-center w-full font-sans text-app-text">
      <div className="w-full max-w-md bg-app-bg min-h-screen relative shadow-2xl flex flex-col sm:border-x sm:border-app-border">
        <BrowserRouter>
          <div className="flex-1 overflow-x-hidden overflow-y-auto pb-24">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/journey" element={<ProtectedRoute><Journey /></ProtectedRoute>} />
              <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/feeling-safe" element={<ProtectedRoute><FeelingSafe /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <AuthWrapper>
            <SOSButton />
            <BottomNav />
          </AuthWrapper>
        </BrowserRouter>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const authUser = useAppStore((state) => state.authUser);
  if (!authUser) return <Navigate to="/login" replace />;
  return children;
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const authUser = useAppStore((state) => state.authUser);
  if (!authUser) return null;
  return <>{children}</>;
}
