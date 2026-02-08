import axios from 'axios';

export async function getCoordinates(address) {
  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: address, format: 'json' },
    });
    if (!res.data.length) return { latitude: 0, longitude: 0 };
    return { latitude: parseFloat(res.data[0].lat), longitude: parseFloat(res.data[0].lon) };
  } catch {
    return { latitude: 0, longitude: 0 };
  }
}
