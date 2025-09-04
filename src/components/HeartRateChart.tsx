import React from "react";
import {
  Brush,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface HRDataPoint {
  index: number;
  hr: number;
  lat: number;
  lon: number;
  time: Date;
  secondsSinceStart: number;
}

interface HeartRateChartProps {
  data: HRDataPoint[];
}

const HeartRateChart: React.FC<HeartRateChartProps> = ({ data }) => {
  if (!data.length) return null;

  return (
    <div className="w-full h-full">
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" />

          <XAxis
            dataKey="secondsSinceStart" // use the time/distance field
            type="number"
            domain={["dataMin", "dataMax"]} // auto-scale to your points
            tickFormatter={(val: number) => {
              const mins = Math.floor(val / 60);
              const secs = Math.floor(val % 60);
              return `${mins}:${secs.toString().padStart(2, "0")}`;
            }}
            label={{
              value: "Time (minutes:seconds)",
              position: "insideBottomRight",
              offset: -10,
            }}
            tick={{ fontSize: 12 }}
          />

          <YAxis
            dataKey="hr"
            domain={["dataMin", "dataMax"]} // auto-scale to your points
            label={{
              value: "HR (bpm)",
              angle: -90,
              position: "insideLeft",
              offset: 10,
            }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: any) => `${value} bpm`}
            labelFormatter={(label) => {
              const mins = Math.floor(label / 60);
              const secs = Math.floor(label % 60);
              return `${mins}:${secs.toString().padStart(2, "0")}`;
            }}
          />
          <Line
            type="monotone"
            dataKey="hr"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, stroke: "#ef4444", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HeartRateChart;
