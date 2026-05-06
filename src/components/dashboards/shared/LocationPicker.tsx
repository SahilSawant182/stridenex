"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Loader2, Navigation, Check, X, Maximize2, Move, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface LocationData {
  address_line_1: string;
  address_line_2?: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  map_link?: string;
}

interface Props {
  value: LocationData;
  onChange: (value: LocationData) => void;
}

// Component to handle map center updates
function ChangeView({ center, zoom = 15 }: { center: [number, number], zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Component to handle map clicks for manual adjustment
function MapEventsHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export const LocationPicker: React.FC<Props> = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([18.5204, 73.8567]); // Default to Pune, India
  const [searchStatus, setSearchStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync map center with current value
  useEffect(() => {
    if (value.latitude && value.longitude) {
      setMapCenter([value.latitude, value.longitude]);
    }
  }, [value.latitude, value.longitude]);

  // Handle clicking outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`
      );
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Autocomplete error:", error);
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data && data.display_name) {
        const parts = data.display_name.split(",");
        const addr1 = parts.slice(0, 2).join(",").trim();
        const pin = data.address.postcode || value.pincode;
        
        onChange({
          ...value,
          address_line_1: addr1,
          pincode: pin,
          latitude: lat,
          longitude: lng,
          map_link: `https://maps.google.com/?q=${lat},${lng}`
        });
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  };

  const handleSuggestionSelect = (item: any) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    
    onChange({
      ...value,
      address_line_1: item.display_name.split(",")[0],
      latitude: lat,
      longitude: lng,
      map_link: `https://maps.google.com/?q=${lat},${lng}`
    });
    
    setMapCenter([lat, lng]);
    setShowSuggestions(false);
    setSearchStatus("success");
  };

  const handleInputChange = (field: keyof LocationData, val: string) => {
    const updated = { ...value, [field]: val };
    onChange(updated);

    if (field === "address_line_1" || field === "address_line_2") {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        const query = [updated.address_line_1, updated.address_line_2].filter(Boolean).join(", ");
        fetchSuggestions(query);
      }, 500);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        reverseGeocode(latitude, longitude);
        setLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLoading(false);
      }
    );
  };

  const handleManualLocationSelect = (lat: number, lng: number) => {
    setMapCenter([lat, lng]);
    reverseGeocode(lat, lng);
  };

  return (
    <div className="space-y-6">
      {/* Address Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1.5 relative" ref={dropdownRef}>
          <div className="flex items-center justify-between ml-1">
            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Address Line 1 <span className="text-red-500">*</span>
            </Label>
            <button 
              type="button"
              onClick={useCurrentLocation}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              <Target className="w-3 h-3" /> Use My Location
            </button>
          </div>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={value.address_line_1 || ""}
              onChange={(e) => handleInputChange("address_line_1", e.target.value)}
              placeholder="Search or enter your building, street name..."
              className="w-full h-12 pl-12 pr-12 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none shadow-sm"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
              {searchStatus === "success" && <Check className="w-4 h-4 text-emerald-500" />}
            </div>
          </div>

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[110] overflow-hidden"
              >
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSuggestionSelect(item)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-none flex items-start gap-3 transition-colors group"
                  >
                    <MapPin className="w-4 h-4 text-slate-300 group-hover:text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-slate-800 line-clamp-1">{item.display_name.split(",")[0]}</p>
                      <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{item.display_name}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
            Address Line 2 (Optional)
          </Label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={value.address_line_2 || ""}
              onChange={(e) => handleInputChange("address_line_2", e.target.value)}
              placeholder="Area, Landmark, Floor/Unit"
              className="w-full h-11 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
            Pincode <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={value.pincode || ""}
              onChange={(e) => handleInputChange("pincode", e.target.value)}
              placeholder="e.g. 400001"
              maxLength={6}
              className="w-full h-11 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
            />
          </div>
        </div>
      </div>

      {/* Map Preview Container */}
      <div className="space-y-3">
        <div className="flex items-center justify-between ml-1">
          <div className="flex flex-col">
            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Map Preview
            </Label>
            <p className="text-[9px] text-slate-400 font-medium">Verify your business location on map</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100 flex items-center gap-2 transition-all"
          >
            <Maximize2 className="w-3 h-3" /> Adjust on Full Map
          </Button>
        </div>

        <div className="relative w-full h-[350px] rounded-3xl overflow-hidden border-2 border-slate-100 shadow-inner group">
          <MapContainer 
            center={mapCenter} 
            zoom={15} 
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
            dragging={false}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {value.latitude && value.longitude && (
              <Marker position={[value.latitude, value.longitude]} />
            )}
            <ChangeView center={mapCenter} />
          </MapContainer>
          
          <div className="absolute inset-0 z-[1000] bg-slate-900/5 group-hover:bg-transparent transition-colors pointer-events-none"></div>
          
          <div className="absolute bottom-4 right-4 z-[1000]">
            <Button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-white/90 backdrop-blur-md text-slate-900 border border-slate-200 rounded-2xl shadow-2xl px-4 h-10 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2"
            >
              <Move className="w-4 h-4 text-blue-500" />
              Interact with Map
            </Button>
          </div>
        </div>
      </div>

      {/* Full-screen Adjustment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-5xl h-full rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                      <Move className="w-5 h-5 text-white" />
                    </div>
                    Refine Business Location
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Drag the marker or click anywhere on the map to set the exact position</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Full-screen Map */}
              <div className="flex-1 relative">
                <MapContainer 
                  center={mapCenter} 
                  zoom={17} 
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {value.latitude && value.longitude && (
                    <Marker 
                      position={[value.latitude, value.longitude]} 
                      draggable={true}
                      eventHandlers={{
                        dragend: (e) => {
                          const marker = e.target;
                          const position = marker.getLatLng();
                          handleManualLocationSelect(position.lat, position.lng);
                        },
                      }}
                    />
                  )}
                  <ChangeView center={mapCenter} zoom={17} />
                  <MapEventsHandler onLocationSelect={handleManualLocationSelect} />
                </MapContainer>

                {/* Legend Overlay */}
                <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-3">
                  <div className="bg-white/90 backdrop-blur-md p-4 rounded-[1.5rem] border border-slate-200 shadow-2xl w-64">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Currently Selected</p>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed">
                        {[value.address_line_1, value.address_line_2].filter(Boolean).join(", ") || "No address selected"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Map Interaction Active
                </div>
                <Button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-900 text-white rounded-2xl px-8 h-12 font-bold text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                  Confirm Location
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
