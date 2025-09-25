"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FormCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export function FormCheckbox({
  label,
  checked,
  onChange,
  error,
  required = false,
  disabled = false,
}: FormCheckboxProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-3">
        <Checkbox
          id={label}
          checked={checked}
          onCheckedChange={(checkedState) => onChange(checkedState === true)}
          disabled={disabled}
          className={
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }
        />
        <Label 
          htmlFor={label} 
          className="text-sm font-medium text-gray-700 cursor-pointer leading-5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}