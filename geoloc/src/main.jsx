import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import LocationDetector from './locationDetector.jsx'
import LocationDetector2 from './locationDetector2.jsx'
import DistanceCalculator from './DistanceCalculator.jsx'
import SystemGPS from './systemGPS.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(


    <SystemGPS />
    // <LocationDetector />
    // <LocationDetector2 />
    // <DistanceCalculator />
)
