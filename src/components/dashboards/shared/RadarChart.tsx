// components/dashboards/shared/RadarChart.tsx
"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface RadarData {
  subject: string;
  value: number;
  fullMark: number;
}

interface RadarChartProps {
  data: RadarData[];
  color?: string;
}

export function SkillRadar({ data, color = "#f97316" }: RadarChartProps) {
  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar 
            name="Skills" 
            dataKey="value" 
            stroke={color} 
            fill={color} 
            fillOpacity={0.2} 
            strokeWidth={2} 
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}