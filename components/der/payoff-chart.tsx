"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DerPathwayYear } from "@/lib/model/der-pathways";

const audFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

export function PayoffChart({
  data,
  v2gStartYear,
}: {
  data: DerPathwayYear[];
  v2gStartYear: number;
}) {
  return (
    <div className="h-[380px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 16, right: 16, left: 12, bottom: 10 }}>
          <CartesianGrid stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fill: "#475569", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#cbd5e1" }}
            label={{ value: "Years", position: "insideBottom", offset: -4, fill: "#475569" }}
          />
          <YAxis
            tick={{ fill: "#475569", fontSize: 12 }}
            tickFormatter={(value) => audFormatter.format(Number(value)).replace("A$", "$")}
            tickLine={false}
            axisLine={false}
            width={82}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              audFormatter.format(value).replace("A$", "$"),
              name,
            ]}
            labelFormatter={(year) => `Year ${year}`}
            contentStyle={{ borderRadius: 8, borderColor: "#cbd5e1", color: "#0f172a" }}
          />
          <Legend verticalAlign="top" height={36} />
          <ReferenceLine
            x={v2gStartYear}
            stroke="#64748b"
            strokeDasharray="4 4"
            label={{ value: "V2G starts", position: "insideTopRight", fill: "#475569", fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="batteryNowDiscounted"
            name="Battery now"
            stroke="#0f766e"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="waitForV2gDiscounted"
            name="Wait for V2G"
            stroke="#ea580c"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
