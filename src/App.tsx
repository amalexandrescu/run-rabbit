import { useEffect, useState } from "react";
import "./App.css";
import DragAndDrop from "./components/DragAndDrop";
import RunningMap, { GPXTrack, PointData } from "./components/RunningMap";
import HeartRateChart, { HRDataPoint } from "./components/HeartRateChart";
import formatTimeBetweenPoints from "./utils/formatTimeBetweenTwoPoints";

export interface TrackPoint {
  lat: number; // latitude
  lon: number; // longitude
  ele?: string; // elevation
  hr?: number; // heart rate
  cad?: number; // cadence
  time?: Date;
}

function App() {
  const [gpxUploaded, setGpxUploaded] = useState<boolean>(false);
  const [tracks, setTracks] = useState<GPXTrack[]>([]);
  const [trackPoints, setTrackPoints] = useState<any[]>([]);
  const [hrData, setHrData] = useState<HRDataPoint[]>([]);

  useEffect(() => {
    if (tracks.length >= 0 && tracks[0]) {
      const firstSegment = tracks[0].trkseg[0];
      const trkpoints: PointData[] = firstSegment.trkpt.map(
        (p, index, arr) => ({
          lat: parseFloat(p.$.lat),
          lon: parseFloat(p.$.lon),
          ele: p.ele ? parseFloat(p.ele) : undefined,
          cad: p.extensions?.["ns3:TrackPointExtension"]?.["ns3:cad"]
            ? parseInt(p.extensions["ns3:TrackPointExtension"]["ns3:cad"])
            : undefined,
          hr: p.extensions?.["ns3:TrackPointExtension"]?.["ns3:hr"]
            ? parseInt(p.extensions["ns3:TrackPointExtension"]["ns3:hr"])
            : undefined,
          time: p.time,
          secondsSinceStart: formatTimeBetweenPoints(
            arr[0].time,
            arr[index].time,
            index
          ),
        })
      );

      setTrackPoints(trkpoints);
    }
  }, [tracks]);

  useEffect(() => {
    if (trackPoints.length > 0) {
      const hrDataList: HRDataPoint[] = trackPoints.map((p, i) => ({
        index: i,
        hr: p.hr ?? 0,
        lat: p.lat,
        lon: p.lon,
        time: p.time,
        secondsSinceStart: p.secondsSinceStart,
      }));

      setHrData(hrDataList);
    }
  }, [trackPoints]);

  return (
    <div className="h-screen w-full flex flex-col p-4 gap-4">
      {!gpxUploaded && (
        <div className="h-full w-full flex items-center justify-center">
          <DragAndDrop
            onTracksParsed={(parsedTracks) => {
              setTracks(parsedTracks);
              setGpxUploaded(true);
            }}
          />
        </div>
      )}

      {gpxUploaded && (
        <>
          <div className="flex flex-col h-full">
            <div className="h-1/2 w-full">
              {trackPoints.length > 0 && (
                <RunningMap trackPoints={trackPoints} />
              )}
            </div>
            <div className="h-1/2 w-full">
              <HeartRateChart data={hrData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
