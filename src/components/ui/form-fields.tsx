import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Common form field component types
interface BaseFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

interface TextFieldProps extends BaseFieldProps {
  type?: "text" | "email" | "tel" | "password";
}

interface NumberFieldProps extends BaseFieldProps {
  type?: "number";
  min?: number;
  max?: number;
  step?: number | string;
}

interface SelectFieldProps extends BaseFieldProps {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

interface TextareaFieldProps extends BaseFieldProps {
  rows?: number;
}

// Reusable form field components
export const FormFields = {
  // Text input field
  Text: ({ form, name, label, type = "text", placeholder, required, disabled, className }: TextFieldProps) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label} {required && "*"}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              value={field.value || ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),

  // Number input field
  Number: ({ form, name, label, min, max, step = "0.01", placeholder, required, disabled, className }: NumberFieldProps) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label} {required && "*"}</FormLabel>
          <FormControl>
            <Input
              type="number"
              min={min}
              max={max}
              step={step}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              value={field.value || ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),

  // Date input field
  Date: ({ form, name, label, required, disabled, className }: BaseFieldProps) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label} {required && "*"}</FormLabel>
          <FormControl>
            <Input
              type="date"
              disabled={disabled}
              {...field}
              value={field.value || ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),

  // Select dropdown field
  Select: ({ form, name, label, options, placeholder = "Select an option", required, disabled, className }: SelectFieldProps) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label} {required && "*"}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value || ""} disabled={disabled}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  ),

  // Textarea field
  Textarea: ({ form, name, label, placeholder, rows = 3, required, disabled, className }: TextareaFieldProps) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label} {required && "*"}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              rows={rows}
              disabled={disabled}
              {...field}
              value={field.value || ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
};

// Common field option sets
export const fieldOptions = {
  titles: [
    { value: "Mr.", label: "Mr." },
    { value: "Mrs.", label: "Mrs." },
    { value: "Ms.", label: "Ms." },
    { value: "Miss", label: "Miss" },
    { value: "Dr.", label: "Dr." },
    { value: "Prof.", label: "Prof." },
    { value: "Rev.", label: "Rev." },
  ],
  
  maritalStatus: [
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
    { value: "Divorced", label: "Divorced" },
    { value: "Widowed", label: "Widowed" },
    { value: "Separated", label: "Separated" },
  ],
  
  sex: [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ],
  
  educationLevels: [
    { value: "High School", label: "High School" },
    { value: "Associate Degree", label: "Associate Degree" },
    { value: "Bachelor Degree", label: "Bachelor Degree" },
    { value: "Master Degree", label: "Master Degree" },
    { value: "Doctorate", label: "Doctorate" },
    { value: "Other", label: "Other" },
  ],
  
  employmentStatus: [
    { value: "Employed", label: "Employed" },
    { value: "Unemployed", label: "Unemployed" },
    { value: "Self-Employed", label: "Self-Employed" },
    { value: "Retired", label: "Retired" },
    { value: "Student", label: "Student" },
  ],
  
  status: [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ],
  
  consultantPositions: [
    { value: "Admin", label: "Admin" },
    { value: "Field Builder", label: "Field Builder" },
    { value: "Field Trainer", label: "Field Trainer" },
    { value: "Senior BMA", label: "Senior BMA" },
    { value: "BMA", label: "BMA" },
    { value: "IBA", label: "IBA" },
  ],
};
