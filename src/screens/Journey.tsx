import { useState, useEffect, useRef } from 'react';
import { GoogleMap, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { ArrowLeft, MapPin, Navigation, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useAppStore } from '../store/useAppStore';

const mapContainerStyle = { width: '100%', height: '100%' };
const defaultCenter = { lat: 18.5204, lng: 73.8567 };

export default function Journey() {
  const navigate = useNavigate();
  const { trustedContacts, setActiveJourney } = useAppStore();

  const [destination, setDestination] = useState('');
  const [directions, setDirections] = useState<any>(null);
  const [eta, setEta] = useState<number | null>(null);
  const [distance, setDistance] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [isJourneyActive, setIsJourneyActive] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);
  const [liveLocation, setLiveLocation] = useState(defaultCenter);

  const journeyIdRef = useRef<string>('');
  const watchIdRef = useRef<number | null>(null);

  // Get initial location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
          setCurrentPosition(pos);
          setLiveLocation(pos);
        },
        () => console.log("Location permission denied")
      );
    }
  }, []);

  // Live location tracking
  useEffect(() => {
    if (!isJourneyActive || !journeyIdRef.current) return;

    const updateLiveLocation = (position: GeolocationPosition) => {
      const newPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setLiveLocation(newPos);

      // Update live location in Firestore (shared with trusted contacts)
      updateDoc(doc(db, 'journeys', journeyIdRef.current), {
        liveLocation: newPos,
        updatedAt: Date.now()
      }).catch(err => console.error("Live update failed", err));
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      updateLiveLocation,
      (error) => console.error("Live location error:", error),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [isJourneyActive]);

  const calculateRoute = async () => {
    if (!destination) return;
    setIsCalculating(true);

    try {
      const directionsService = new google.maps.DirectionsService();
      const result = await directionsService.route({
        origin: currentPosition,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      if (!result?.routes?.length) throw new Error("No route found");

      const leg = result.routes[0].legs[0];
      const durationMinutes = Math.ceil((leg.duration?.value || 1800) / 60);
      const distanceText = leg.distance?.text || "Unknown distance";

      setDirections(result);
      setEta(durationMinutes);
      setDistance(distanceText);
    } catch (error) {
      alert("Could not calculate route. Try a clearer destination.");
    } finally {
      setIsCalculating(false);
    }
  };

  const startJourney = async () => {
    if (!destination || !eta) return;

    try {
      const journeyId = `journey_${Date.now()}`;
      journeyIdRef.current = journeyId;

      const journeyData = {
        userId: auth.currentUser?.uid,
        source: "Current Location",
        destination,
        status: 'active',
        eta,
        distance,
        startTime: Date.now(),
        liveLocation: liveLocation,
        createdAt: Date.now(),
      };

      await setDoc(doc(db, 'journeys', journeyId), journeyData);
      setActiveJourney(journeyData as any);
      setIsJourneyActive(true);

      alert(`✅ Journey Started!\n\nLive location is now being shared with ${trustedContacts.length} trusted contact(s).`);

    } catch (error) {
      console.error(error);
      alert("Failed to start journey");
    }
  };

  const stopJourney = async () => {
    if (journeyIdRef.current) {
      await updateDoc(doc(db, 'journeys', journeyIdRef.current), { status: 'completed' });
    }
    if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);

    setIsJourneyActive(false);
    setDirections(null);
    setEta(null);
    setDistance('');
    journeyIdRef.current = '';
  };

  if (isJourneyActive) {
    return <ActiveJourney 
      eta={eta} 
      distance={distance} 
      destination={destination} 
      liveLocation={liveLocation}
      stopJourney={stopJourney} 
    />;
  }

  return (
    <div className="flex flex-col h-screen bg-app-bg relative overflow-hidden">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={currentPosition}
        zoom={13}
      >
        {directions && <DirectionsRenderer directions={directions} />}
        <Marker position={currentPosition} label="You" />
      </GoogleMap>

      {/* Header */}
      <div className="absolute top-0 w-full z-30 p-6 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-4">
          <div onClick={() => navigate(-1)} className="w-10 h-10 bg-app-card-light rounded-full flex items-center justify-center border border-app-border cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Live Journey</h1>
            <p className="text-sm text-gray-400">SafeSaathi Protection</p>
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-6 bg-gradient-to-t from-black to-transparent pt-20">
        <div className="bg-app-card rounded-3xl p-6 border border-app-border shadow-2xl">
          <div className="space-y-5">
            <div className="flex items-center gap-3 bg-app-bg p-4 rounded-2xl">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-xs text-app-dim">Starting from</p>
                <p className="text-app-text font-medium">Current Location</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-app-bg p-4 rounded-2xl">
              <MapPin className="text-red-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Where are you going?"
                className="bg-transparent flex-1 outline-none text-app-text placeholder:text-app-dim"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            {eta && (
              <div className="bg-app-blue/10 border border-app-blue/30 p-5 rounded-2xl flex items-center gap-5">
                <Clock className="text-app-blue w-8 h-8" />
                <div>
                  <p className="text-3xl font-bold text-app-blue">{eta} <span className="text-lg">min</span></p>
                  <p className="text-sm text-app-dim">{distance}</p>
                </div>
              </div>
            )}

            <button
              onClick={calculateRoute}
              disabled={!destination || isCalculating}
              className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-2xl transition disabled:opacity-50"
            >
              {isCalculating ? "Calculating..." : "Show Route & ETA"}
            </button>

            <button
              onClick={startJourney}
              disabled={!eta}
              className="w-full bg-app-blue hover:bg-app-blue/90 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <Navigation className="w-5 h-5" />
              Start Protected Journey
            </button>

            {trustedContacts.length > 0 && (
              <p className="text-center text-xs text-app-dim">
                Live location will be shared with {trustedContacts.length} trusted contacts
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Active Journey Screen with Live Map
function ActiveJourney({ eta, distance, destination, liveLocation, stopJourney }: any) {
  const [remainingTime, setRemainingTime] = useState(eta || 25);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev: number) => Math.max(0, prev - 1));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen bg-[#0a0c14] relative flex flex-col">
      <div className="absolute top-6 left-6 z-50 bg-green-500 text-black text-xs px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
        <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
        LIVE TRACKING • SHARED
      </div>

      {/* Live Map */}
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={liveLocation}
        zoom={15}
      >
        <Marker position={liveLocation} label="You" />
      </GoogleMap>

      <div className="absolute bottom-0 left-0 right-0 z-30 p-6 bg-gradient-to-t from-black to-transparent pt-20">
        <div className="bg-app-card rounded-3xl p-6 border border-app-border">
          <div className="text-center mb-6">
            <p className="text-6xl font-black text-white">{remainingTime}</p>
            <p className="text-app-dim">minutes remaining</p>
            <p className="mt-4 text-app-text">{destination}</p>
          </div>

          <button 
            onClick={stopJourney}
            className="w-full bg-red-600 py-4 rounded-2xl text-white font-bold text-lg"
          >
            End Journey
          </button>
        </div>
      </div>
    </div>
  );
}