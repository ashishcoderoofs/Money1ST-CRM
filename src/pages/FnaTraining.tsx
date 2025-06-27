
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainingModules } from "@/components/fna-training/TrainingModules";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Award, BookOpen } from "lucide-react";

export default function FnaTraining() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-m1f-primary">FNA Training Center</h2>
        <p className="text-muted-foreground">
          Financial Needs Analysis comprehensive training program
        </p>
      </div>

      {/* Training Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-m1f border-m1f-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-m1f-primary">Total Modules</CardTitle>
            <BookOpen className="h-4 w-4 text-m1f-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-m1f-primary">12</div>
            <p className="text-xs text-muted-foreground">Available training modules</p>
          </CardContent>
        </Card>

        <Card className="shadow-m1f border-m1f-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-m1f-primary">Active Learners</CardTitle>
            <Users className="h-4 w-4 text-m1f-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-m1f-primary">47</div>
            <p className="text-xs text-muted-foreground">Currently enrolled</p>
          </CardContent>
        </Card>

        <Card className="shadow-m1f border-m1f-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-m1f-primary">Avg. Completion</CardTitle>
            <Clock className="h-4 w-4 text-m1f-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-m1f-primary">68%</div>
            <p className="text-xs text-muted-foreground">Average progress rate</p>
          </CardContent>
        </Card>

        <Card className="shadow-m1f border-m1f-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-m1f-primary">Certifications</CardTitle>
            <Award className="h-4 w-4 text-m1f-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-m1f-primary">23</div>
            <p className="text-xs text-muted-foreground">Completed this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Training Modules */}
      <Card className="shadow-m1f border-m1f-primary/20">
        <CardHeader>
          <CardTitle className="text-m1f-primary">Training Modules</CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-m1f-primary">Beginner</Badge>
            <Badge variant="outline">Intermediate</Badge>
            <Badge variant="outline">Advanced</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <TrainingModules />
        </CardContent>
      </Card>
    </div>
  );
}
