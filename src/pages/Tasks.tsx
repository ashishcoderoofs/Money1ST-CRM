
import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useCreateTask, useUpdateTask, useDeleteTask, useUpdateTaskStatus, TaskFormData } from "@/hooks/useTaskMutations";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog";
import { TasksTable } from "@/components/tasks/TasksTable";
import { Plus, CheckSquare } from "lucide-react";

export default function Tasks() {
  const { user } = useAuth();
  const { role } = useUserRole(user?.id ?? null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();
  const updateStatusMutation = useUpdateTaskStatus();

  if (!user) {
    return <div className="p-8 text-center">Please log in to view tasks.</div>;
  }

  const handleCreateTask = async (values: TaskFormData) => {
    try {
      await createMutation.mutateAsync(values);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleUpdateTask = async (values: TaskFormData) => {
    if (!editingTask) return;
    
    try {
      await updateMutation.mutateAsync({
        id: editingTask.id,
        ...values,
      });
      setEditingTask(null);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteMutation.mutateAsync(taskId);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask({
      ...task,
      due_date: task.due_date ? new Date(task.due_date) : undefined,
    });
  };

  const handleStatusChange = async (taskId: string, status: any) => {
    try {
      await updateStatusMutation.mutateAsync({ id: taskId, status });
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <CheckSquare className="h-8 w-8" />
            Task Management
          </h2>
          <p className="text-muted-foreground">
            Manage and track your tasks and assignments
          </p>
        </div>
        
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <TasksTable
        tasks={tasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
        isLoading={tasksLoading}
      />

      <TaskFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateTask}
        isLoading={createMutation.isPending}
        title="Create New Task"
      />

      {editingTask && (
        <TaskFormDialog
          open={!!editingTask}
          onOpenChange={() => setEditingTask(null)}
          onSubmit={handleUpdateTask}
          initialValues={{
            title: editingTask.title,
            description: editingTask.description || "",
            due_date: editingTask.due_date,
            priority: editingTask.priority,
            status: editingTask.status,
            assigned_to: editingTask.assigned_to,
            contact_id: editingTask.contact_id || "",
            deal_id: editingTask.deal_id || "",
          }}
          isLoading={updateMutation.isPending}
          title="Edit Task"
        />
      )}
    </div>
  );
}
