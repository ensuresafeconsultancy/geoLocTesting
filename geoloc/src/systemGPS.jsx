import { useState, useEffect } from 'react'

const SystemGPS = () => {
    const [location, setLocation] = useState({ lat: null, lon: null, accuracy: null });
    const [initialLoc , seInitialLoc]= useState({ lat: null, lon: null});
    const [error, setError] = useState(null);
  
    const [distance , setDistance] = useState('');

    //mobile lat and long - balaji data
    const homeLat = 11.5342999;
    const homeLong = 79.4849891;

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
              const distance = calculateDistance(homeLat , homeLong ,  currentLat , currentLon );
              setDistance(distance);

              
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
    

  return (
    <div>
        <button onClick={()=>{seInitialLoc({ lat: null, lon: null}); setDistance('Loading...'); getLocation()}} >Get my Current location Coordinate: </button>
        <p>{`Initial Location: ${initialLoc.lat? initialLoc.lat : "Loading..."}, ${initialLoc.lon? initialLoc.lon : "Loading..."}`}</p>
        <p>{error? error : ''}</p><br /><br />

        Distance : {distance} meters




    </div>
  )
}

export default SystemGPS;