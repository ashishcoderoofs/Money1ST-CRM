import React from 'react';
import { ConsultantFormApi } from '@/components/ConsultantFormApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

export default function CreateConsultantPage() {
  const handleSuccess = () => {
    console.log('Consultant created successfully!');
    // You could navigate to consultant list or show success message
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-6 w-6" />
            Add New Consultant
          </CardTitle>
          <p className="text-muted-foreground">
            Fill out the form below to create a new consultant profile. An invitation email with a temporary password will be sent.
          </p>
        </CardHeader>
        <CardContent>
          <ConsultantFormApi onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}
