
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const salesData = [
  { month: 'Jan', revenue: 45000, policies: 23, clients: 18 },
  { month: 'Feb', revenue: 52000, policies: 28, clients: 22 },
  { month: 'Mar', revenue: 48000, policies: 25, clients: 20 },
  { month: 'Apr', revenue: 61000, policies: 32, clients: 26 },
  { month: 'May', revenue: 55000, policies: 29, clients: 24 },
  { month: 'Jun', revenue: 67000, policies: 35, clients: 28 },
];

export function SalesMetricsChart() {
  return (
    <Card className="shadow-m1f border-m1f-primary/20">
      <CardHeader>
        <CardTitle className="text-m1f-primary">Sales Performance Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value, name) => [
              name === 'revenue' ? `$${value.toLocaleString()}` : value,
              name === 'revenue' ? 'Revenue' : name === 'policies' ? 'Policies Sold' : 'New Clients'
            ]} />
            <Line type="monotone" dataKey="revenue" stroke="#0e4d92" strokeWidth={2} />
            <Line type="monotone" dataKey="policies" stroke="#ffd700" strokeWidth={2} />
            <Line type="monotone" dataKey="clients" stroke="#22c55e" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
