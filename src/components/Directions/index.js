import React from 'react';
import  MapViewDirections from 'react-native-maps-directions';

const Directions = ({ destination, origin, onReady, waypoints }) => (
    <MapViewDirections
        destination = {destination}
        origin = {origin}
        onReady = {onReady}
        waypoints =  { waypoints}
        optimizeWaypoints ={waypoints}
        travelMode = 'DRIVING'
        avoidTolls = {true}
        apikey = {key}
        strokeWidth = {3}
        strokeColor = "#222"
    />
)

export default Directions;