// utils/stationApi.js  (ESM)
// SKELETON: endpoint, auth, response field names ChargeZone API-oda match pannanum.
// Environment variables: STATION_API_URL, STATION_API_TOKEN

export async function getStationCoordinates(stationName) {
    const res = await fetch(process.env.STATION_API_URL, {
        headers: { Authorization: `Bearer ${process.env.STATION_API_TOKEN}` },
    });
    if (!res.ok) throw new Error(`Station API failed: ${res.status}`);

    const data = await res.json();

    // TODO: real response structure-ku maathunga (ippo guess)
    const list = data.data ?? data.stations ?? data;
    const station = list.find(s =>
        String(s.name ?? s.station_name ?? '').toLowerCase() === stationName.toLowerCase()
    );
    if (!station) throw new Error(`Station not found in API: ${stationName}`);

    const lat = Number(station.latitude ?? station.lat);
    const lng = Number(station.longitude ?? station.lng ?? station.long);
    if (Number.isNaN(lat) || Number.isNaN(lng)) throw new Error('Lat/long API response-la illa');

    console.log(`API station ${stationName}:`, { lat, lng });
    return { lat, lng };
}