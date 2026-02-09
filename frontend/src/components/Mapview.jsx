import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView({ lat, lng }) {
  return (
    <MapContainer
     key={`${lat}-${lng}`}
      center={[lat, lng]}
      zoom={13}
      className="h-64 w-full rounded-lg"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]} />
    </MapContainer>
  );
}
