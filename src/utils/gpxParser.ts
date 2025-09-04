import GPX from "gpx-parser-builder";

export const gpxParser = async (file: File) => {
  const text = await file.text();
  const gpx = GPX.parse(text);

  console.log("Parsed GPX object:", gpx);
  return gpx;
};

export default gpxParser;
