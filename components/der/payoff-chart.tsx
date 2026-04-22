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
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fill: "#86868b", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
            label={{ value: "Years", position: "insideBottom", offset: -4, fill: "#86868b" }}
          />
          <YAxis
            tick={{ fill: "#86868b", fontSize: 12 }}
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
            contentStyle={{
              background: "rgba(29,29,31,0.94)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              boxShadow: "0 18px 60px rgba(0,0,0,0.42)",
              color: "#f5f5f7",
            }}
            labelStyle={{ color: "#f5f5f7" }}
            itemStyle={{ color: "#f5f5f7" }}
          />
          <Legend verticalAlign="top" height={36} wrapperStyle={{ color: "#a1a1a6", fontSize: 13 }} />
          <ReferenceLine
            x={v2gStartYear}
            stroke="rgba(255,255,255,0.28)"
            strokeDasharray="4 4"
            label={{ value: "V2G starts", position: "insideTopRight", fill: "#a1a1a6", fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="batteryNowDiscounted"
            name="Battery now"
            stroke="#30d158"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="waitForV2gDiscounted"
            name="Wait for V2G"
            stroke="#0a84ff"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
