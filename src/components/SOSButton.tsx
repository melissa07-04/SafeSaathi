import { useAppStore } from '../store/useAppStore';
import { ShieldAlert } from 'lucide-react';
import SOSOverlay from './SOSOverlay';

export default function SOSButton() {
  const { isSOSActive, setSOSActive } = useAppStore();

  return (
    <>
      <div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-app-red shadow-[0_0_25px_rgba(255,59,48,0.4)] p-3 cursor-pointer select-none active:scale-95 transition-transform"
        onClick={() => setSOSActive(true)}
      >
        <div className="bg-app-red border border-red-400 rounded-full w-14 h-14 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/20 blur-md rounded-full animate-pulse"></div>
          <span className="font-black text-app-text text-lg tracking-wider relative z-10">SOS</span>
        </div>
      </div>
      
      {isSOSActive && <SOSOverlay onClose={() => setSOSActive(false)} />}
    </>
  );
}
