import React, { useMemo } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Issue } from "../../../utilities/models";

interface IssuesBarChartProps {
  issues: Issue[];
}

const IssuesBarChart: React.FC<IssuesBarChartProps> = ({ issues }) => {
  const chartData = useMemo(() => {
    const countsByDate: Record<string, number> = {};

    issues.forEach((issue) => {
      const date = new Date(issue.createdAt).toLocaleDateString("en-CA");
      countsByDate[date] = (countsByDate[date] || 0) + 1;
    });

    return Object.entries(countsByDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count,
      }));
  }, [issues]);

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Issues Created (Day-wise)
        </Typography>
        {chartData.length === 0 ? (
          <Typography color="text.secondary" py={6} textAlign="center">
            No data available
          </Typography>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(20, 18, 50, 0.95)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 8,
                  color: "#fff",
                }}
              />
              <Bar dataKey="count" name="Issues" fill="#1976d2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default IssuesBarChart;
