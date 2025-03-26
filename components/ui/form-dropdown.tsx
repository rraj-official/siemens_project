"use client";

import * as React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Dropdown } from "@/components/ui/dropdown";
import { UseFormReturn } from "react-hook-form";

interface FormDropdownProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  description?: string;
  options: string[];
  placeholder?: string;
  className?: string;
}

export function FormDropdown({
  form,
  name,
  label,
  description,
  options,
  placeholder,
  className,
}: FormDropdownProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Dropdown
              options={options}
              placeholder={placeholder}
              value={field.value}
              onValueChange={field.onChange}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
} 