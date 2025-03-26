"use client";

import * as React from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/utils";

export interface DropdownProps 
  extends React.ComponentPropsWithoutRef<typeof SelectTrigger> {
  options: string[];
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const Dropdown = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  DropdownProps
>(({ className, options, placeholder = "Select an option", value, onValueChange, ...props }, ref) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        ref={ref}
        className={cn(
          "w-full", 
          className
        )}
        {...props}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});
Dropdown.displayName = "Dropdown";

export { Dropdown }; 