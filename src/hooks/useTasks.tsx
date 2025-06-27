
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import type { Database } from "@/integrations/supabase/types";

type TaskPriority = Database["public"]["Enums"]["task_priority"];
type TaskStatus = Database["public"]["Enums"]["task_status"];

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          contact:contacts(first_name, last_name),
          deal:deals(title),
          assigned_user:profiles!tasks_assigned_to_fkey(first_name, last_name)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (task: {
      title: string;
      description?: string;
      due_date?: string;
      priority?: TaskPriority;
      assigned_to: string;
      contact_id?: string;
      deal_id?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("tasks")
        .insert({
          ...task,
          created_by: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create task: ${error.message}`);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<{
      title: string;
      description: string;
      due_date: string;
      priority: TaskPriority;
      status: TaskStatus;
      assigned_to: string;
    }>) => {
      const { data, error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update task: ${error.message}`);
    },
  });
}
