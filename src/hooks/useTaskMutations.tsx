
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type TaskPriority = Database["public"]["Enums"]["task_priority"];
type TaskStatus = Database["public"]["Enums"]["task_status"];

export interface TaskFormData {
  title: string;
  description?: string;
  due_date?: Date;
  priority: TaskPriority;
  status?: TaskStatus;
  assigned_to: string;
  contact_id?: string;
  deal_id?: string;
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (taskData: TaskFormData) => {
      console.log("Creating task with data:", taskData);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("tasks")
        .insert({
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.due_date?.toISOString(),
          priority: taskData.priority,
          status: taskData.status || "Pending",
          assigned_to: taskData.assigned_to,
          contact_id: taskData.contact_id || null,
          deal_id: taskData.deal_id || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Create task error:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    },
    onError: (error: any) => {
      console.error("Create task error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      ...taskData 
    }: TaskFormData & { id: string }) => {
      console.log("Updating task:", id, taskData);
      
      const { data, error } = await supabase
        .from("tasks")
        .update({
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.due_date?.toISOString(),
          priority: taskData.priority,
          status: taskData.status,
          assigned_to: taskData.assigned_to,
          contact_id: taskData.contact_id || null,
          deal_id: taskData.deal_id || null,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Update task error:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    },
    onError: (error: any) => {
      console.error("Update task error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (taskId: string) => {
      console.log("Deleting task:", taskId);
      
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) {
        console.error("Delete task error:", error);
        throw error;
      }

      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error("Delete task error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete task",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      status 
    }: { id: string; status: TaskStatus }) => {
      console.log("Updating task status:", id, status);
      
      const { data, error } = await supabase
        .from("tasks")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Update task status error:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Success",
        description: "Task status updated successfully",
      });
    },
    onError: (error: any) => {
      console.error("Update task status error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update task status",
        variant: "destructive",
      });
    },
  });
}
