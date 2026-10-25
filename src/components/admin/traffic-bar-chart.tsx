"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  34, 48, 38, 61, 51, 73, 58, 42, 68, 84, 60, 77, 53, 89, 69, 57, 78, 96, 64,
  81, 71, 91, 62, 85, 73, 100, 78, 92, 83, 95,
].map((views, index) => {
  const date = new Date(Date.UTC(2026, 8, 26 + index));
  return {
    day: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(date),
    views: Math.round(views * 3.8),
  };
});
const dateTicks = data
  .filter((_, index) => index % 6 === 0 || index === data.length - 1)
  .map(({ day }) => day);

export function TrafficBarChart() {
  return (
    <div
      className="mt-3 h-[190px] w-full min-w-0"
      role="img"
      aria-label="Demo bar chart of daily portfolio views over the last 30 days"
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
        minWidth={0}
        minHeight={190}
        initialDimension={{ width: 640, height: 190 }}
      >
        <BarChart
          data={data}
          margin={{ top: 6, right: 2, bottom: 0, left: -18 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--admin-line)"
            strokeDasharray="3 4"
          />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            ticks={dateTicks}
            interval={0}
            tick={{ fill: "var(--admin-subtle)", fontSize: 10 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--admin-subtle)", fontSize: 10 }}
            width={34}
          />
          <Tooltip
            cursor={{ fill: "var(--admin-soft)" }}
            contentStyle={{
              border: "1px solid var(--admin-line)",
              borderRadius: 7,
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--admin-subtle)" }}
          />
          <Bar
            dataKey="views"
            name="Views"
            fill="var(--admin-chart-bar)"
            radius={[3, 3, 0, 0]}
            maxBarSize={16}
            activeBar={{
              stroke: "var(--admin-chart-hover)",
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`${entry.day}-${index}`}
                fill={
                  index === data.length - 1
                    ? "var(--accent)"
                    : "var(--admin-chart-bar)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
