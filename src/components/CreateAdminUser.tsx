
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export function CreateAdminUser() {
  const [loading, setLoading] = useState(false);

  const createAdminUser = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-admin-user');
      
      if (error) {
        console.error('Error:', error);
        toast.error(`Failed to create admin user: ${error.message}`);
        return;
      }

      if (data.success) {
        toast.success('Admin user created successfully! You can now login with admin@money1st.com / AdminPass123!');
      } else {
        toast.error(`Failed to create admin user: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Create Admin User</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Click the button below to create an admin user with email: admin@money1st.com
        </p>
        <Button 
          onClick={createAdminUser} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Creating...' : 'Create Admin User'}
        </Button>
      </CardContent>
    </Card>
  );
}
