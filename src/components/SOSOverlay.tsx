import { useEffect, useState } from 'react';
import { MapPin, Phone, ShieldAlert, X } from 'lucide-react';
import { db, auth } from '../firebase/config';
import { collection, query, getDocs } from 'firebase/firestore';

export default function SOSOverlay({ onClose }: { onClose: () => void }) {
  const [countdown, setCountdown] = useState(5);
  const [status, setStatus] = useState<'counting' | 'active'>('counting');

  useEffect(() => {
    if (status === 'counting') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        triggerSOS();
      }
    }
  }, [countdown, status]);

  const triggerSOS = async () => {
    setStatus('active');
    
    // Attempt to get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log("SOS Location", pos.coords.latitude, pos.coords.longitude);
          // In a real app, this updates Firestore document 'active_sos'
        },
        (err) => console.log("Location error", err),
        { enableHighAccuracy: true }
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-app-bg/90 flex flex-col items-center justify-center p-6 backdrop-blur-md">
      <div className="absolute top-6 right-6" onClick={onClose}>
        <X className="text-app-dim w-8 h-8 cursor-pointer" />
      </div>
      
      {status === 'counting' ? (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-app-red mb-6">SOS ATTACHED</h2>
          <p className="text-lg text-app-text mb-12">Alerting Police & Contacts in</p>
          <div className="w-32 h-32 rounded-full border-4 border-red-500/30 flex items-center justify-center mx-auto relative mb-12">
            <div className="absolute inset-0 rounded-full border-t-4 border-red-500 animate-spin" style={{ animationDuration: '1s' }}></div>
            <span className="text-6xl font-black text-app-red">{countdown}</span>
          </div>
          <button 
            onClick={onClose}
            className="px-8 py-4 bg-app-border rounded-full text-app-text font-bold tracking-widest uppercase hover:bg-slate-700 active:bg-slate-600 transition"
          >
            Cancel SOS
          </button>
        </div>
      ) : (
        <div className="text-center w-full max-w-sm">
          <div className="w-24 h-24 bg-app-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(255,59,48,0.6)] animate-pulse">
            <ShieldAlert className="w-12 h-12 text-app-text" />
          </div>
          <h2 className="text-3xl font-bold text-app-text mb-2">SOS ACTIVE</h2>
          <p className="text-app-red font-medium mb-8">Authorities and Emergency Contacts have been notified.</p>
          
          <div className="bg-app-card rounded-2xl p-4 text-left space-y-4 mb-8">
            <div className="flex items-start gap-4">
              <MapPin className="text-app-red shrink-0 mt-1" />
              <div>
                <p className="text-sm text-app-dim uppercase font-semibold">Broadcasting Location</p>
                <p className="text-app-text font-mono text-sm mt-1">Lat: 12.9716° N<br/>Lon: 77.5946° E</p>
              </div>
            </div>
            <div className="w-full h-px bg-app-border"></div>
            <div className="flex items-start gap-4">
              <Phone className="text-app-blue shrink-0 mt-1" />
              <div>
                <p className="text-sm text-app-dim uppercase font-semibold">Emergency Contacts Notified</p>
                <p className="text-app-text text-sm mt-1">Rohan Sharma (SMS Sent)<br/>Priya Verma (SMS Sent)</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-app-red/20 border border-app-red/40 rounded-xl text-app-red font-bold active:bg-red-900/50 transition"
          >
            Disable SOS
          </button>
        </div>
      )}
    </div>
  );
}
