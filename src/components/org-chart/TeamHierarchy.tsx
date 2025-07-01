
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Crown, Building2, GraduationCap, TrendingUp, UserCheck, User } from "lucide-react";

const hierarchyData = [
  {
    role: "Admin",
    count: 1,
    icon: Crown,
    color: "bg-red-500",
    description: "System Administration",
    level: 1
  },
  {
    role: "Field Builder",
    count: 3,
    icon: Building2,
    color: "bg-purple-500",
    description: "Territory Development",
    level: 2
  },
  {
    role: "Field Trainer",
    count: 5,
    icon: GraduationCap,
    color: "bg-blue-500",
    description: "Training & Development",
    level: 2
  },
  {
    role: "Senior BMA",
    count: 8,
    icon: TrendingUp,
    color: "bg-green-500",
    description: "Senior Business Management",
    level: 3
  },
  {
    role: "BMA",
    count: 15,
    icon: UserCheck,
    color: "bg-yellow-500",
    description: "Business Management",
    level: 4
  },
  {
    role: "IBA",
    count: 25,
    icon: User,
    color: "bg-gray-500",
    description: "Independent Business Associates",
    level: 5
  }
];

export function TeamHierarchy() {
  return (
    <Card className="shadow-m1f border-m1f-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-m1f-primary">
          <Users className="h-5 w-5" />
          Organizational Hierarchy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hierarchyData.map((level, index) => (
            <div key={level.role} className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className={`p-2 rounded-full ${level.color} text-white`}>
                <level.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-m1f-primary">{level.role}</h3>
                  <Badge variant="outline">{level.count} members</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{level.description}</p>
              </div>
              <div className="text-xs text-muted-foreground">
                Level {level.level}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
