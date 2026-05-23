import React, { useMemo } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { StatusCountsDto } from "../../../utilities/models";

interface IssuesPieChartProps {
  statusCounts: StatusCountsDto | null;
}

const STATUS_COLORS: Record<string, string> = {
  Open: "#0288d1",
  "In Progress": "#ed6c02",
  Resolved: "#2e7d32",
  Closed: "#757575",
};

const IssuesPieChart: React.FC<IssuesPieChartProps> = ({ statusCounts }) => {
  const chartData = useMemo(() => {
    if (!statusCounts) return [];

    return [
      { name: "Open", value: statusCounts.Open || 0 },
      { name: "In Progress", value: statusCounts["In Progress"] || 0 },
      { name: "Resolved", value: statusCounts.Resolved || 0 },
      { name: "Closed", value: statusCounts.Closed || 0 },
    ].filter((entry) => entry.value > 0);
  }, [statusCounts]);

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Issues by Status
        </Typography>
        {chartData.length === 0 ? (
          <Typography color="text.secondary" py={6} textAlign="center">
            No data available
          </Typography>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                label={(props: any) => `${props.name ?? ""} ${((props.percent ?? 0) * 100).toFixed(0)}%`}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#8884d8"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(20, 18, 50, 0.95)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 8,
                  color: "#fff",
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default IssuesPieChart;
