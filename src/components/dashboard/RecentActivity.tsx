
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, DollarSign, FileText } from "lucide-react";

const recentActivities = [
  {
    id: 1,
    type: "New Client",
    description: "John Doe added as new client",
    time: "2 hours ago",
    icon: User,
    status: "success"
  },
  {
    id: 2,
    type: "Mortgage Application",
    description: "Application #1234 submitted",
    time: "4 hours ago",
    icon: FileText,
    status: "pending"
  },
  {
    id: 3,
    type: "Commission Payment",
    description: "$2,500 commission processed",
    time: "1 day ago",
    icon: DollarSign,
    status: "success"
  },
  {
    id: 4,
    type: "Training Completed",
    description: "FNA Training Module 1 completed",
    time: "2 days ago",
    icon: Clock,
    status: "info"
  }
];

export function RecentActivity() {
  return (
    <Card className="shadow-m1f border-m1f-primary/20">
      <CardHeader>
        <CardTitle className="text-m1f-primary">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <activity.icon className="h-5 w-5 text-m1f-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-m1f-primary">
                  {activity.type}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
              </div>
              <div className="flex-shrink-0 text-xs text-muted-foreground">
                {activity.time}
              </div>
              <Badge variant={activity.status === 'success' ? 'default' : 'secondary'}>
                {activity.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
