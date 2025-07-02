import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { ConsultantFormSectionProps } from "./types";
import { FormFields, fieldOptions } from "@/components/ui/form-fields";

export function ConsultantBasicForm({ form }: ConsultantFormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Main Information
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormFields.Text
          form={form}
          name="consultantId"
          label="Consultant ID"
          placeholder="Auto-generated if empty"
        />

        <FormFields.Date
          form={form}
          name="entryDate"
          label="Entry Date"
          required
        />

        <FormFields.Select
          form={form}
          name="position"
          label="Position"
          options={fieldOptions.consultantPositions}
          placeholder="Select a position"
        />

        <FormFields.Select
          form={form}
          name="status"
          label="Status"
          options={fieldOptions.status}
        />

        <FormFields.Select
          form={form}
          name="title"
          label="Title"
          options={fieldOptions.titles}
          placeholder="Select title"
        />

        <div></div> {/* Empty div for grid alignment */}

        <FormFields.Text
          form={form}
          name="firstName"
          label="First Name"
          required
        />

        <FormFields.Text
          form={form}
          name="middleInitial"
          label="MI"
        />

        <FormFields.Text
          form={form}
          name="lastName"
          label="Last Name"
          required
        />

        <FormFields.Text
          form={form}
          name="suffix"
          label="Suffix"
        />

        <div className="md:col-span-3">
          <FormFields.Textarea
            form={form}
            name="comment"
            label="Comment"
            placeholder="Add a comment..."
            rows={4}
          />
        </div>

        <div className="md:col-span-3">
          <FormFields.Textarea
            form={form}
            name="remarks"
            label="Remarks"
            placeholder="Add remarks..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
}
