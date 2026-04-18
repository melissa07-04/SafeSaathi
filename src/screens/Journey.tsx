import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { ArrowLeft, MapPin, Navigation, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const mapContainerStyle = { width: '100%', height: '100%' };
const defaultCenter = { lat: 18.5204, lng: 73.8567 }; // Pune

export default function Journey() {
  const navigate = useNavigate();
  const { trustedContacts } = useAppStore();

  const [destination, setDestination] = useState('');
  const [directions, setDirections] = useState<any>(null);
  const [eta, setEta] = useState<number | null>(null);
  const [distance, setDistance] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [mapError, setMapError] = useState<string>('');

  const [currentPosition, setCurrentPosition] = useState(defaultCenter);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          setMapError("Location access denied. Using default Pune location.");
        }
      );
    }
  }, []);

  const calculateRoute = async () => {
    if (!destination) {
      alert("Please enter a destination");
      return;
    }
    setIsCalculating(true);
    setMapError('');

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
    } catch (error: any) {
      console.error(error);
      setMapError("Failed to calculate route. Check destination or API key.");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-app-bg relative overflow-hidden">
      {/* Google Maps */}
      <LoadScript 
        googleMapsApiKey="AIzaSyCL3rWDtBsecZ2up7nDtPVHy2bh0QhMI58"   // ← Make sure key is here
        onLoad={() => console.log("✅ Google Maps script loaded successfully")}
        onError={() => setMapError("Failed to load Google Maps. Check API key.")}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={currentPosition}
          zoom={13}
        >
          {directions && <DirectionsRenderer directions={directions} />}
          <Marker position={currentPosition} label="You" />
        </GoogleMap>
      </LoadScript>

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

      {/* Error Message */}
      {mapError && (
        <div className="absolute top-20 left-4 right-4 z-40 bg-red-900/90 text-white p-4 rounded-xl text-sm">
          {mapError}
        </div>
      )}

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

            {mapError && <p className="text-red-500 text-xs">{mapError}</p>}

            {eta && (
              <div className="bg-app-blue/10 border border-app-blue/30 p-5 rounded-2xl">
                <p className="text-3xl font-bold text-app-blue">{eta} min</p>
                <p className="text-sm text-app-dim">{distance}</p>
              </div>
            )}

            <button
              onClick={calculateRoute}
              disabled={!destination || isCalculating}
              className="w-full py-4 bg-white/10 text-white font-medium rounded-2xl disabled:opacity-50"
            >
              {isCalculating ? "Calculating..." : "Show Route & ETA"}
            </button>

            <button
              disabled={!eta}
              className="w-full bg-app-blue py-4 rounded-2xl font-bold text-white disabled:opacity-50"
            >
              Start Protected Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}