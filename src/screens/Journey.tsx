import { useState, useEffect } from 'react';
import { ArrowLeft, ShieldAlert, MapPin, Navigation as NavIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

export default function Journey() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [isJourneyActive, setIsJourneyActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const startJourney = async () => {
    if (!destination) return;
    setLoading(true);
    try {
      const journeyId = `journey_${Date.now()}`;
      // In a real app we would get the geocoded source/dest
      await setDoc(doc(db, 'journeys', journeyId), {
        userId: auth.currentUser?.uid,
        source: 'Current Location',
        destination,
        status: 'active',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      setIsJourneyActive(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (isJourneyActive) {
    return <ActiveJourney stopJourney={() => setIsJourneyActive(false)} />;
  }

  return (
    <div className="flex flex-col h-screen relative bg-app-bg">
      {/* Header */}
      <div className="absolute top-0 w-full z-20 flex justify-between items-center p-6 bg-gradient-to-b from-[#11121C] to-transparent">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-app-card-light rounded-full flex items-center justify-center border border-app-border cursor-pointer text-app-text"
          >
            <ArrowLeft className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-app-text leading-tight">Setup Journey</h1>
            <span className="text-[10px] uppercase text-app-dim tracking-wider">Enter Destination</span>
          </div>
        </div>
        <div className="w-10 h-10 bg-app-blue/20 border border-app-blue/30 rounded-full flex items-center justify-center text-app-blue">
          <ShieldAlert className="w-5 h-5" />
        </div>
      </div>

      {/* Mock Map Background */}
      <div className="absolute inset-0 bg-app-card overflow-hidden opacity-80" 
        style={{
          backgroundImage: 'linear-gradient(#222436 1px, transparent 1px), linear-gradient(90deg, #222436 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      >
        <svg className="w-full h-full stroke-purple-500/30" strokeWidth="3" fill="none" viewBox="0 0 400 800">
          <path d="M 200,600 C 100,500 300,300 200,100" />
        </svg>
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-10 h-10 bg-app-bg rounded-full flex items-center justify-center shadow-xl border-4 border-app-border relative z-10">
            <MapPin className="text-app-blue w-5 h-5" fill="currentColor" />
          </div>
          <div className="bg-app-bg text-app-text px-3 py-1 rounded-full text-xs font-bold mt-2 shadow-lg z-20">Destination</div>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="absolute bottom-16 w-full p-6 z-20 pb-28">
        <div className="bg-app-card rounded-3xl p-5 border border-app-border shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-app-card p-4 rounded-xl border border-app-border/50">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(10,132,255,0.6)]"></div>
              <span className="text-app-text font-medium">Current Location</span>
            </div>
            
            <div className="flex items-center gap-4 bg-app-card p-4 rounded-xl border border-app-border">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(255,59,48,0.6)]"></div>
              <input 
                type="text"
                placeholder="Where to?"
                className="bg-transparent text-app-text w-full outline-none placeholder:text-app-dim"
                value={destination}
                onChange={e => setDestination(e.target.value)}
              />
            </div>
            
            <button 
              onClick={startJourney}
              disabled={!destination || loading}
              className="w-full bg-app-blue hover:bg-app-blue/80 text-app-text font-bold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <NavIcon className="w-5 h-5" />
              {loading ? 'Starting...' : 'Start Protected Journey'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveJourney({ stopJourney }: { stopJourney: () => void }) {
  const [eta, setEta] = useState(24);
  
  useEffect(() => {
    // mock eta countdown
    const i = setInterval(() => setEta(e => Math.max(0, e - 1)), 60000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="flex flex-col h-screen relative bg-app-bg">
      {/* Mock Map Background for Active Journey */}
       <div className="absolute inset-0 bg-[#1C1C1E] overflow-hidden" 
        style={{
          backgroundImage: 'linear-gradient(#1A1C29 1px, transparent 1px), linear-gradient(90deg, #1A1C29 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      >
        <svg className="w-full h-full stroke-blue-500/50" strokeWidth="4" fill="none" viewBox="0 0 400 800" strokeDasharray="10 10" strokeLinecap="round">
          <path d="M 200,600 C 100,500 300,300 200,100" />
        </svg>
        <div className="absolute top-[40%] left-[45%] w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-[0_0_20px_rgba(10,132,255,0.6)] z-10 flex items-center justify-center">
             <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>

      <div className="absolute top-0 w-full z-20 flex justify-between items-start p-6">
        <div className="bg-app-card/90 backdrop-blur-md px-4 py-2 rounded-full border border-app-border shadow-xl flex items-center gap-3">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-app-text font-bold text-sm tracking-wide">AI Route Active & Safe</span>
        </div>
      </div>

      <div className="absolute bottom-0 w-full p-6 z-20 pb-28">
        <div className="bg-app-card/90 backdrop-blur-xl rounded-3xl p-6 border border-app-border shadow-2xl">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-4xl font-black text-app-text">{eta} <span className="text-lg text-app-dim">min</span></h3>
              <p className="text-app-dim font-medium">ETA • 8.4 km remaining</p>
            </div>
            <button 
              onClick={stopJourney}
              className="px-6 py-2 bg-red-500/10 text-app-red rounded-full font-bold border border-red-500/30"
            >
              End Trip
            </button>
          </div>
          
          <div className="h-px w-full bg-app-border mb-6"></div>

          <div className="flex items-center justify-between">
            <div className="flex gap-4">
               <div className="bg-app-blue/20 p-3 rounded-full text-app-blue items-center justify-center flex">
                 <ShieldAlert className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="text-app-text font-bold">Deviation Monitor on</h4>
                  <p className="text-app-dim text-sm">Alerts if off track &gt; 100m</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
