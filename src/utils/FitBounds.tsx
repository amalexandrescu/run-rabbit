import React, { useEffect } from "react";
import { useMap } from "react-leaflet";

const FitBounds: React.FC<{ positions: [number, number][] }> = ({
  positions,
}) => {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [30, 30] });
    }
  }, [positions, map]);

  return null;
};

export default FitBounds;
