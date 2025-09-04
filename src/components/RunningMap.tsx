import { Icon } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import FitBounds from "../utils/FitBounds";
import LeafletHotlineLayer from "./LeafletHotLineLayer";

export interface GPXWaypoint {
  $: {
    lat: string;
    lon: string;
  };
  ele?: string;
  time?: Date;
  extensions?: {
    "ns3:TrackPointExtension"?: {
      "ns3:cad"?: string;
      "ns3:hr"?: string;
    };
  };
}

export interface GPXTrackSegment {
  trkpt: GPXWaypoint[];
}

export interface GPXTrack {
  name?: string;
  trkseg: GPXTrackSegment[];
  type?: string;
}

interface RunningMapProps {
  trackPoints: PointData[];
}

export interface PointData {
  lat: number;
  lon: number;
  cad?: number;
  hr?: number;
  ele?: number;
}

const startIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3313/3313803.png",
  iconSize: [22, 22],
});

const runningIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/6266/6266049.png",
  iconSize: [26, 26],
});

const finishIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3203/3203058.png",
  iconSize: [34, 34],
});

const RunningMap: React.FC<RunningMapProps> = ({ trackPoints }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const center: [number, number] = trackPoints.length
    ? [trackPoints[0].lat, trackPoints[0].lon]
    : [0, 0];

  useEffect(() => {
    if (trackPoints.length === 0 || !isRunning) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= trackPoints.length - 1) {
          clearInterval(interval);
          setIsRunning(false);
          return 0;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, trackPoints]);

  return (
    <div className="w-[100%] h-full">
      <MapContainer
        // scrollWheelZoom={false}
        doubleClickZoom={false}
        // zoomControl={false}
        center={center}
        zoom={13}
        className="h-full w-full rounded-[7px] overflow-hidden shadow-lg"
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <LeafletHotlineLayer trackPoints={trackPoints} />

        <FitBounds positions={trackPoints.map((p) => [p.lat, p.lon])} />

        {
          <Marker
            position={center}
            icon={startIcon}
            eventHandlers={{ click: () => setIsRunning(true) }}
          />
        }

        <Marker
          position={[
            trackPoints[trackPoints.length - 1].lat,
            trackPoints[trackPoints.length - 1].lon,
          ]}
          icon={finishIcon}
        />

        {isRunning && currentIndex < trackPoints.length && (
          <Marker
            position={[
              trackPoints[currentIndex].lat,
              trackPoints[currentIndex].lon,
            ]}
            icon={runningIcon}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default RunningMap;
