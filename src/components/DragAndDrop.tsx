import { FileRejection, useDropzone } from "react-dropzone";
import gpxParser from "../utils/gpxParser";
import { GPXTrack } from "./RunningMap";

interface DragAndDropProps {
  onTracksParsed: (tracks: GPXTrack[]) => void;
}

const DragAndDrop: React.FC<DragAndDropProps> = ({ onTracksParsed }) => {
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      accept: {
        "application/gpx+xml": [".gpx"],
      },
      maxFiles: 1,
      onDrop: async (
        acceptedFiles: File[],
        _fileRejections: FileRejection[]
      ) => {
        if (acceptedFiles.length === 0) return;

        //just one gpx file at a time
        const gpx = await gpxParser(acceptedFiles[0]);
        onTracksParsed(gpx.trk);
      },
    });

  const files = acceptedFiles.map((file) => (
    <li key={file.path} className="text-sm text-gray-700">
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div
      {...getRootProps()}
      className={`flex w-[80%] h-[70%] items-center justify-center border-2 border-dashed rounded-lg cursor-pointer p-6 text-center transition-all bg-[#fafafa]
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-gray-700">Drop the file here...</p>
      ) : (
        <p className="text-gray-500">
          Drag & drop a file here, or click to select
        </p>
      )}
    </div>
  );
};

export default DragAndDrop;
