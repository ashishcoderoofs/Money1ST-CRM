
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const performanceData = [
  { name: "Admin", sales: 0, target: 0 },
  { name: "Field Builder", sales: 15, target: 20 },
  { name: "Field Trainer", sales: 12, target: 15 },
  { name: "Sr. BMA", sales: 8, target: 10 },
  { name: "BMA", sales: 5, target: 8 },
  { name: "IBA", sales: 3, target: 5 },
];

export function TeamPerformanceChart() {
  return (
    <Card className="shadow-m1f border-m1f-primary/20">
      <CardHeader>
        <CardTitle className="text-m1f-primary">Team Performance by Role</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#0e4d92" name="Actual Sales" />
            <Bar dataKey="target" fill="#ffd700" name="Target" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
