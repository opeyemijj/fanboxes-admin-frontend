export default async function getLocation() {
  const clientMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_CLIENT_API_KEY;

  try {
    // Step 1: Call Google Geolocation API from browser
    const geolocationRes = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${clientMapsApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        considerIp: true
      })
    });

    if (!geolocationRes.ok) {
      throw new Error(`Geolocation API failed: ${geolocationRes.statusText}`);
    }

    const locationData = await geolocationRes.json();

    // Step 2: Send coordinates to your API for geocoding
    const res = await fetch('/api/location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        lat: locationData.location.lat,
        lng: locationData.location.lng
      })
    });

    if (!res.ok) {
      throw new Error(`Location API failed: ${res.statusText}`);
    }

    const fullLocationData = await res.json();
    // console.log('Full location data:', fullLocationData);

    return fullLocationData;
  } catch (error) {
    console.error('Location fetch failed:', error);
    return {
      country_code: 'US',
      name: 'United States of America',
      dial_code: '+1',
      ip: 'unknown',
      currency_code: 'USD',
      coordinates: null,
      error: error.message
    };
  }
}
