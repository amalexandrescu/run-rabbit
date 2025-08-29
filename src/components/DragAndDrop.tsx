import { useDropzone } from "react-dropzone";

const DragAndDrop = () => {
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      accept: {
        "application/gpx+xml": [".gpx"], // only accept .gpx files
      },
    });

  const files = acceptedFiles.map((file) => (
    <li key={file.path} className="text-sm text-gray-700">
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <section className="flex flex-col items-center w-full max-w-md mx-auto mt-10">
      <div
        {...getRootProps()}
        className={`w-full h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer p-6 text-center transition-all bg-[#fafafa]
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-gray-700">Drop the file here...</p>
        ) : (
          <p className="text-gray-500">
            Drag & drop a file here, or click to select
          </p>
        )}{" "}
      </div>
      <aside className="mt-4 w-full">
        <h4 className="font-semibold mb-2">Files</h4>
        <ul className="space-y-1">{files}</ul>
      </aside>
    </section>
  );
};

export default DragAndDrop;
