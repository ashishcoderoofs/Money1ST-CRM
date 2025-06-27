
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Trash2, CheckSquare, User, Calendar, AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  created_at: string;
  assigned_user?: {
    first_name: string;
    last_name: string;
  };
  contact?: {
    first_name: string;
    last_name: string;
  };
  deal?: {
    title: string;
  };
}

interface TasksTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  isLoading?: boolean;
}

export function TasksTable({ tasks, onEdit, onDelete, onStatusChange, isLoading = false }: TasksTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (taskId: string) => {
    setDeletingId(taskId);
    try {
      await onDelete(taskId);
    } finally {
      setDeletingId(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low": return "bg-gray-500";
      case "Medium": return "bg-blue-500";
      case "High": return "bg-orange-500";
      case "Critical": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-500";
      case "In Progress": return "bg-blue-500";
      case "Completed": return "bg-green-500";
      case "Cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (!dueDate || status === "Completed") return false;
    return new Date(dueDate) < new Date();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading tasks...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Tasks ({tasks.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No tasks found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Related</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {task.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {task.assigned_user && (
                        <div className="flex items-center gap-1 text-sm">
                          <User className="h-3 w-3 text-muted-foreground" />
                          {task.assigned_user.first_name} {task.assigned_user.last_name}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(task.status)} text-white`}>
                          {task.status}
                        </Badge>
                        {task.status !== "Completed" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onStatusChange(task.id, "Completed")}
                            className="h-6 w-6 p-0"
                          >
                            <CheckSquare className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {task.due_date && (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className={isOverdue(task.due_date, task.status) ? "text-red-500 font-medium" : ""}>
                            {format(new Date(task.due_date), "MMM dd, yyyy")}
                          </span>
                          {isOverdue(task.due_date, task.status) && (
                            <AlertCircle className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {task.contact && (
                          <div className="text-xs text-muted-foreground">
                            Contact: {task.contact.first_name} {task.contact.last_name}
                          </div>
                        )}
                        {task.deal && (
                          <div className="text-xs text-muted-foreground">
                            Deal: {task.deal.title}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(task.created_at), "MMM dd")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(task)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Task</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{task.title}"? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(task.id)}
                                disabled={deletingId === task.id}
                              >
                                {deletingId === task.id ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
