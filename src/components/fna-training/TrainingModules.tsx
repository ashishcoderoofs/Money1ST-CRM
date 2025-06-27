
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, CheckCircle2, PlayCircle } from "lucide-react";

const trainingModules = [
  {
    id: 1,
    title: "Introduction to FNA",
    description: "Basic principles of Financial Needs Analysis",
    duration: "45 min",
    progress: 100,
    completed: true,
    lessons: 5
  },
  {
    id: 2,
    title: "Client Assessment Techniques",
    description: "Methods for evaluating client financial situations",
    duration: "60 min",
    progress: 75,
    completed: false,
    lessons: 7
  },
  {
    id: 3,
    title: "Insurance Products Overview",
    description: "Understanding different insurance products and their applications",
    duration: "90 min",
    progress: 30,
    completed: false,
    lessons: 9
  },
  {
    id: 4,
    title: "Mortgage Solutions",
    description: "Comprehensive guide to mortgage products and processes",
    duration: "120 min",
    progress: 0,
    completed: false,
    lessons: 12
  }
];

export function TrainingModules() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {trainingModules.map((module) => (
          <Card key={module.id} className="shadow-m1f border-m1f-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-m1f-primary rounded-lg">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-m1f-primary">{module.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </div>
                </div>
                <Badge variant={module.completed ? 'default' : 'secondary'}>
                  {module.completed ? 'Completed' : 'In Progress'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{module.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{module.lessons} lessons</span>
                    </div>
                  </div>
                  <span className="text-m1f-primary font-medium">{module.progress}% Complete</span>
                </div>
                <Progress value={module.progress} className="h-2" />
                <div className="flex justify-between items-center">
                  <Button 
                    variant={module.completed ? "outline" : "default"}
                    className={module.completed ? "" : "bg-m1f-primary hover:bg-m1f-dark"}
                  >
                    {module.completed ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Review
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Continue
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
