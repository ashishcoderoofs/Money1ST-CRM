
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const regionalData = [
  { name: 'North Region', value: 35, color: '#0e4d92' },
  { name: 'South Region', value: 28, color: '#ffd700' },
  { name: 'East Region', value: 22, color: '#22c55e' },
  { name: 'West Region', value: 15, color: '#f97316' },
];

export function RegionalPerformance() {
  return (
    <Card className="shadow-m1f border-m1f-primary/20">
      <CardHeader>
        <CardTitle className="text-m1f-primary">Regional Performance Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={regionalData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {regionalData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
