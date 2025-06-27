
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateTask, useUpdateTask } from "@/hooks/useTasks";
import { useContacts } from "@/hooks/useContacts";
import { useDeals } from "@/hooks/useDeals";
import type { Database } from "@/integrations/supabase/types";

type TaskPriority = Database["public"]["Enums"]["task_priority"];
type TaskStatus = Database["public"]["Enums"]["task_status"];

interface TaskFormProps {
  task?: any;
  onClose?: () => void;
}

export function TaskForm({ task, onClose }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    due_date: task?.due_date ? task.due_date.split('T')[0] : "",
    priority: (task?.priority || "Medium") as TaskPriority,
    status: (task?.status || "Pending") as TaskStatus,
    assigned_to: task?.assigned_to || "",
    contact_id: task?.contact_id || "",
    deal_id: task?.deal_id || "",
  });

  const { data: contacts } = useContacts();
  const { data: deals } = useDeals();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      title: formData.title,
      description: formData.description || undefined,
      due_date: formData.due_date ? new Date(formData.due_date).toISOString() : undefined,
      priority: formData.priority,
      assigned_to: formData.assigned_to,
      contact_id: formData.contact_id || undefined,
      deal_id: formData.deal_id || undefined,
    };

    if (task) {
      await updateTask.mutateAsync({ 
        id: task.id, 
        ...taskData,
        status: formData.status 
      });
    } else {
      await createTask.mutateAsync(taskData);
    }
    
    onClose?.();
  };

  const isLoading = createTask.isPending || updateTask.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="due_date">Due Date</Label>
          <Input
            id="due_date"
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value: TaskPriority) => setFormData({ ...formData, priority: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {task && (
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: TaskStatus) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="assigned_to">Assigned To</Label>
        <Input
          id="assigned_to"
          value={formData.assigned_to}
          onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
          placeholder="User ID"
          required
        />
      </div>

      <div>
        <Label htmlFor="contact_id">Related Contact</Label>
        <Select
          value={formData.contact_id}
          onValueChange={(value) => setFormData({ ...formData, contact_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a contact (optional)" />
          </SelectTrigger>
          <SelectContent>
            {contacts?.map((contact) => (
              <SelectItem key={contact.id} value={contact.id}>
                {contact.first_name} {contact.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="deal_id">Related Deal</Label>
        <Select
          value={formData.deal_id}
          onValueChange={(value) => setFormData({ ...formData, deal_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a deal (optional)" />
          </SelectTrigger>
          <SelectContent>
            {deals?.map((deal) => (
              <SelectItem key={deal.id} value={deal.id}>
                {deal.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : task ? "Update Task" : "Create Task"}
        </Button>
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
