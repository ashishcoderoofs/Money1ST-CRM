
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bug, Send } from "lucide-react";
import { toast } from "sonner";

export default function ReportBug() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !priority || !category) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Here you would typically send the bug report to your backend
    toast.success("Bug report submitted successfully!");
    
    // Reset form
    setTitle("");
    setDescription("");
    setPriority("");
    setCategory("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Bug className="h-8 w-8 text-red-500" />
        <div>
          <h1 className="text-3xl font-bold">Report a Bug</h1>
          <p className="text-muted-foreground">Help us improve by reporting issues</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bug Report Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Bug Title *</label>
              <Input
                placeholder="Brief description of the issue"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Priority *</label>
                <Select value={priority} onValueChange={setPriority} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Category *</label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ui">User Interface</SelectItem>
                    <SelectItem value="functionality">Functionality</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                placeholder="Detailed description of the bug, steps to reproduce, expected vs actual behavior..."
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Submit Bug Report
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tips for Better Bug Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Be specific about what you were trying to do</li>
            <li>• Include steps to reproduce the issue</li>
            <li>• Mention your browser and operating system if relevant</li>
            <li>• Describe what you expected to happen vs what actually happened</li>
            <li>• Include any error messages you saw</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
