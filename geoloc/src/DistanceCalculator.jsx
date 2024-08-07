import { useState } from 'react';
import axios from 'axios';

const DistanceCalculator = () => {
  const [distance, setDistance] = useState('');
  const [error, setError] = useState('');

  const origin = '11.5601,79.5223'; // Vadalur
  const destination = '11.5583,79.4731'; // Neyveli (Mandharakuppan)
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  const getDistance = async () => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`);
      if (response.data.status === 'OK') {
        const distanceValue = response.data.rows[0].elements[0].distance.text;
        setDistance(distanceValue);
      } else {
        setError('Error fetching distance');
      }
    } catch (error) {
      setError('Error fetching distance');
    }
  };

  return (
    <div>
      <h1>Distance Calculator</h1>
      <button onClick={getDistance}>Calculate Distance</button>
      {distance && <p>Distance: {distance}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default DistanceCalculator;
