// Google Maps and Places API Loader & Utilities

const DEFAULT_API_KEY = 'AIzaSyA34ghMAyANDMPkTHie9OqvGRYVP1XAq6g';

export const getGoogleMapsApiKey = (): string => {
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || DEFAULT_API_KEY;
};

let googleMapsPromise: Promise<any> | null = null;

export const loadGoogleMapsScript = (apiKey?: string): Promise<any> => {
  const key = apiKey || getGoogleMapsApiKey();
  if (!key) {
    return Promise.reject(new Error('No Google Maps API Key provided'));
  }

  if (typeof window !== 'undefined' && (window as any).google?.maps?.places) {
    return Promise.resolve((window as any).google.maps);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Check if script element already exists
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        resolve((window as any).google?.maps);
      });
      existingScript.addEventListener('error', (err) => {
        reject(err);
      });
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.type = 'text/javascript';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places&language=es&region=CL`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if ((window as any).google?.maps) {
        resolve((window as any).google.maps);
      } else {
        reject(new Error('Google Maps script loaded but google.maps object not found'));
      }
    };

    script.onerror = (error) => {
      googleMapsPromise = null;
      reject(error);
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

export interface PlaceAddressResult {
  formattedAddress: string;
  streetAddress: string;
  cityOrComuna: string;
  region: string;
  country: string;
  lat?: number;
  lng?: number;
  placeId?: string;
  url?: string;
}

export const extractAddressComponents = (place: any): PlaceAddressResult => {
  const components: any[] = place.address_components || [];
  
  let streetNumber = '';
  let route = '';
  let sublocality = '';
  let locality = '';
  let adminAreaLevel3 = ''; // Often Comuna in Chile
  let adminAreaLevel2 = ''; // Often Provincia in Chile
  let adminAreaLevel1 = ''; // Región
  let country = '';

  components.forEach((c) => {
    const types: string[] = c.types || [];
    if (types.includes('street_number')) streetNumber = c.long_name;
    if (types.includes('route')) route = c.long_name;
    if (types.includes('sublocality') || types.includes('sublocality_level_1')) sublocality = c.long_name;
    if (types.includes('locality')) locality = c.long_name;
    if (types.includes('administrative_area_level_3')) adminAreaLevel3 = c.long_name;
    if (types.includes('administrative_area_level_2')) adminAreaLevel2 = c.long_name;
    if (types.includes('administrative_area_level_1')) adminAreaLevel1 = c.long_name;
    if (types.includes('country')) country = c.long_name;
  });

  // Street address: "Nueva Costanera 3222"
  const streetAddress = route 
    ? (streetNumber ? `${route} ${streetNumber}` : route)
    : place.name || place.formatted_address || '';

  // Comuna / City: prefer comuna (adminAreaLevel3) + city (locality)
  const comuna = adminAreaLevel3 || sublocality || locality;
  const city = locality || adminAreaLevel2 || 'Santiago';
  const cityOrComuna = comuna && city && comuna !== city
    ? `${comuna}, ${city}`
    : comuna || city || 'Santiago, Chile';

  const lat = place.geometry?.location ? place.geometry.location.lat() : undefined;
  const lng = place.geometry?.location ? place.geometry.location.lng() : undefined;

  return {
    formattedAddress: place.formatted_address || streetAddress,
    streetAddress,
    cityOrComuna,
    region: adminAreaLevel1,
    country: country || 'Chile',
    lat,
    lng,
    placeId: place.place_id,
    url: place.url || (lat && lng ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` : undefined)
  };
};
