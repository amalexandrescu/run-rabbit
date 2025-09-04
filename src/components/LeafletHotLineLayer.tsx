import { useEffect } from "react";
import { useMap } from "react-leaflet";
import "leaflet-hotline";
import L from "leaflet";
import { PointData } from "./RunningMap";

function hrToRatio(hr: number) {
  if (hr < 110) return 0;
  if (hr < 120) return 0.2;
  if (hr < 140) return 0.5;
  if (hr < 160) return 0.8;
  return 1;
}

const palette = {
  0.0: "#2381DD", // <110
  0.2: "#82C91F", // 110-119
  0.5: "#DFCA3F", // 120-139
  0.8: "#F37B1D", // 140-159
  1.0: "#D3201F", // 160+
};

const LeafletHotlineLayer: React.FC<{ trackPoints: PointData[] }> = ({
  trackPoints,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || trackPoints.length === 0) return;

    const hotlineData = trackPoints.map((p) => [
      p.lat,
      p.lon,
      hrToRatio(p.hr ?? 0),
    ]);

    // Clean up old hotline layers
    map.eachLayer((layer: any) => {
      if (layer instanceof (L as any).Hotline) {
        map.removeLayer(layer);
      }
    });

    // Black border underlay
    (L as any)
      .hotline(hotlineData, {
        min: 0,
        max: 1,
        palette: {
          0.0: "black",
          1.0: "black",
        },
        weight: 8,
      })
      .addTo(map);

    // HR gradient overlay
    (L as any)
      .hotline(hotlineData, {
        min: 0,
        max: 1,
        palette: palette,
        weight: 6,
      })
      .addTo(map);
  }, [map, trackPoints]);

  return null;
};

export default LeafletHotlineLayer;
