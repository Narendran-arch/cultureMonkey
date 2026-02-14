export default function MapView({ address, lat, lng }) {
  const latitude = Number(lat);
  const longitude = Number(lng);

  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return (
      <div className="h-full w-full flex items-center justify-center text-sm text-gray-500">
        Location not available
      </div>
    );
  }

  const delta = 0.01;

  const minLng = longitude - delta;
  const minLat = latitude - delta;
  const maxLng = longitude + delta;
  const maxLat = latitude + delta;

  return (
    <iframe
      title={address}
      width="100%"
      height="100%"
      loading="lazy"
      className="rounded-lg"
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${minLng},${minLat},${maxLng},${maxLat}&layer=mapnik&marker=${latitude},${longitude}`}
    />
  );
}
