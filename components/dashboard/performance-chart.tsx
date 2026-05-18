"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type PerformancePoint = {
  day: string;
  leads: number;
  conversions: number;
};

export function PerformanceChart({ data }: { data: PerformancePoint[] }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="leads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.55} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="conversions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4fd1ff" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#4fd1ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#8b93a7", fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#8b93a7", fontSize: 12 }} />
          <Tooltip
            cursor={{ stroke: "rgba(255,255,255,0.12)" }}
            contentStyle={{
              background: "rgba(11,14,24,0.95)",
              border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 8
            }}
          />
          <Area type="monotone" dataKey="leads" stroke="#8b5cf6" fill="url(#leads)" strokeWidth={2} />
          <Area type="monotone" dataKey="conversions" stroke="#4fd1ff" fill="url(#conversions)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
