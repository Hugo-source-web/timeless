"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

const DefaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],        // default Leaflet size
  iconAnchor: [12, 41],      // bottom center
  popupAnchor: [1, -34],     // popup position
  shadowSize: [41, 41],
});

export type Dealership = {
  id: number;
  name: string;
  city: string;
  position: LatLngExpression;
};

const SPAIN_CENTER: LatLngExpression = [40.0, -3.7];

type Props = {
  onDealerClick: (dealer: Dealership) => void;
};

export default function DealershipMap({ onDealerClick }: Props) {
  
  const [dealerships, setDealerships] = useState<Dealership[]>([]);

  useEffect(() => {
    async function loadDealers() {
      const res = await fetch("/api/dealerships");
      const data = await res.json();
      setDealerships(
        data.map((d: any) => ({
          id: d.id,
          name: d.name,
          city: d.city,
          position: [d.latitude, d.longitude] as LatLngExpression,
        }))
      );
    }

    loadDealers();
  }, []);

  if (typeof window === "undefined") return null;

  return (
    <MapContainer
      key="dealermap" 
      center={SPAIN_CENTER}
      zoom={6.5}
      scrollWheelZoom={false}
      dragging={false}
      zoomControl={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {dealerships.map((dealer) => (
        <Marker
          key={dealer.id}
          position={dealer.position}
          icon={DefaultIcon}
          eventHandlers={
            onDealerClick
              ? {
                  click: () => onDealerClick(dealer),
                }
              : undefined
          }
        >
          <Popup>{dealer.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

