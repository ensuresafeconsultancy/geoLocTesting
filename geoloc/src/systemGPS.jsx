import { useState, useEffect } from 'react'

const SystemGPS = () => {
    // const [location, setLocation] = useState({ lat: null, lon: null, accuracy: null });
    const [initialLoc , seInitialLoc]= useState({ lat: null, lon: null});
    const [error, setError] = useState(null);
    const [address, setAddress] = useState('');
  
    const [distance , setDistance] = useState('');

    //mobile lat and long - balaji data - working
    // const homeLat = 11.5342999;
    // const homeLong = 79.4849891;

    const homeLat = import.meta.env.COMPANY_LAT;
    const homeLong = import.meta.env.COMPANY_LONG;

    // const homeLat2 = 11.5342973;
    // const homeLong2 = 79.4850291;

    //system lat long - balaji data- Initial Location: 10.1582, 77.8994

    const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const currentLat = position.coords.latitude;
              const currentLon = position.coords.longitude;
              seInitialLoc({ lat: currentLat, lon: currentLon });
              console.log(`Initial Location: ${currentLat}, ${currentLon}`);

              console.log();
              fetchAddress(currentLat, currentLon);
              const distance = calculateDistance(homeLat , homeLong ,  currentLat , currentLon );
              setDistance(distance.toFixed(2));

              // getGoogleLocation();
            },
            (error) => {
              console.error('Error getting initial location:', error);
              setError('Error getting initial location');
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        } else {
          setError('Geolocation is not supported by this browser.');
        }
      };

    useEffect(() => {
        getLocation();
      }, []);


      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // Radius of the Earth in meters
        const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;
    
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        const distance = R * c; // in meters
        return distance;
      };


      const fetchAddress = async (lat, lng) => {
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
        const data = await response.json();
  
        if (data.status === 'OK' && data.results.length > 0) {
          const relevantResult = data.results.find(result => result.types.includes("street_address")) || data.results[0];
          setAddress(relevantResult.formatted_address);
        } else {
          setError('Unable to retrieve address');
        }
      };
  
    

  return (
    <div>
        <button onClick={()=>{seInitialLoc({ lat: null, lon: null}); setDistance('Loading...'); getLocation()}} >Get my Current location Coordinate: </button>
        <p>{`Initial Location: ${initialLoc.lat? initialLoc.lat : "Loading..."}, ${initialLoc.lon? initialLoc.lon : "Loading..."}`}</p>
        {error ? (
        <p>Error: {error}</p>
      ) : (
        <p>Address: {address}</p>
      )}

        {/* <button>Get Distance</button> <br /><br />
        <button>Stop Distance finding</button><br /><br /> */}

        Distance : {distance} meters

    </div>
  )
}

export default SystemGPS;