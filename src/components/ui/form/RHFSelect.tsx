// File: src/components/ui/form/RHFSelect.tsx
import React from "react";
import { Controller, Control } from "react-hook-form";
import { Select, SelectProps } from "antd";

interface RHFSelectProps extends SelectProps {
  name: string;
  control: any;
  label: string;
  required?: boolean;
  options: { label: string; value: string | number | boolean }[];
}

export function RHFSelect({
  name,
  control,
  label,
  required,
  options,
  ...selectProps
}: RHFSelectProps) {
  return (
    <div className="mb-4">
      <label className="block text-[14px] font-medium text-[#1b1c1c] mb-1">
        {label} {required && <span className="text-[#D32F2F]">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <Select
              {...field}
              {...selectProps}
              status={error ? "error" : ""}
              options={options}
              className="w-full"
            />
            {error && (
              <span className="text-[#D32F2F] text-xs mt-1 block">
                {error.message}
              </span>
            )}
          </>
        )}
      />
    </div>
  );
}
