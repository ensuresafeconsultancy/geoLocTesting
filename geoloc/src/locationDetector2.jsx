import { useState, useEffect } from 'react';
import axios from 'axios';

const LocationDetector2 = () => {
  const [location, setLocation] = useState({ lat: null, lon: null, accuracy: null });
  const [initialLoc, seInitialLoc] = useState({ lat: null, lon: null });
  const [error, setError] = useState(null);
  const [distance, setDistance] = useState('');

  const companyLat = 13.0482176; // Company latitude
  const companyLon = 80.2193408; // Company longitude

  const getGoogleLocation = async () => {
    try {
      const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY; // Replace with your Google API key
      const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${googleApiKey}`;

      const response = await axios.post(url, { considerIp: true });
      const refinedLat = response.data.location.lat;
      const refinedLon = response.data.location.lng;
      const accuracy = response.data.accuracy;

      setLocation({ lat: refinedLat, lon: refinedLon, accuracy });
      console.log(`Refined Location: ${refinedLat}, ${refinedLon}`);

      // Call Distance Matrix API
      getDistanceMatrix(refinedLat, refinedLon, companyLat, companyLon, googleApiKey);
    } catch (error) {
      console.error('Error refining location:', error);
      setError('Error refining location');
    }
  };

  const getDistanceMatrix = async (originLat, originLon, destLat, destLon, apiKey) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${originLat},${originLon}&destinations=${destLat},${destLon}&key=${apiKey}`;

      const response = await axios.get(url);
      const distanceData = response.data.rows[0].elements[0];
      const distanceText = distanceData.distance.text;

      console.log(`Distance from company: ${distanceText}`);
      setDistance(distanceText);
    } catch (error) {
      console.error('Error fetching distance:', error);
      setError('Error fetching distance');
    }
  };

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const currentLat = position.coords.latitude;
            const currentLon = position.coords.longitude;
            seInitialLoc({ lat: currentLat, lon: currentLon });
            console.log(`Initial Location: ${currentLat}, ${currentLon}`);
            getGoogleLocation();
          },
          (error) => {
            console.error('Error getting initial location:', error);
            setError('Error getting initial location');
            // In case of an error, fall back to Google location directly
            getGoogleLocation();
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        setError('Geolocation is not supported by this browser.');
        // Fall back to Google location if Geolocation API is not supported
        getGoogleLocation();
      }
    };

    getLocation();
  }, []);

  return (
    <div>
      <h1>Location Detector</h1>
      <p>{error ? error : ''}</p>
      <p>
        Our Initial Location calculated by our device: <br />
        latitude: {initialLoc.lat}, <br />
        longitude: {initialLoc.lon} <br /><br />
        Redefined by Google <br />
        Latitude: {location.lat}<br />
        Longitude: {location.lon}<br />
        Accuracy: {location.accuracy} meters <br /><br />
        Company location: 13.0482176, 80.2193408 <br />
        Distance: {distance}
      </p>
    </div>
  );
};

export default LocationDetector2;
