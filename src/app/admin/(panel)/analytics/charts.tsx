"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#3b82f6", "#2563eb", "#60a5fa", "#1d4ed8", "#93c5fd"];

export function TrafficChart({ data }: { data: { date: string; visitors: number; pageViews: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic (last 14 days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" />
            <YAxis tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--popover))",
                fontSize: 12,
              }}
            />
            <Area type="monotone" dataKey="visitors" stroke="#3b82f6" fill="url(#v)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function TopPagesChart({ data }: { data: { path: string; views: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top pages</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
            <XAxis type="number" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" />
            <YAxis
              type="category"
              dataKey="path"
              tick={{ fontSize: 11 }}
              width={110}
              stroke="currentColor"
              className="text-muted-foreground"
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--popover))",
                fontSize: 12,
              }}
            />
            <Bar dataKey="views" radius={[0, 6, 6, 0]} fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function LeadSourceChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads by type</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--popover))",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
