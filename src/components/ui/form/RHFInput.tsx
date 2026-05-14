// File: src/components/ui/form/RHFInput.tsx
import React from "react";
import { Controller, Control } from "react-hook-form";
import { Input, InputProps } from "antd";
import { TextAreaProps } from "antd/es/input";

interface RHFInputProps extends Omit<InputProps, "name" | "defaultValue"> {
  name: string;
  control: Control<any>;
  label: string;
  required?: boolean;
  isTextArea?: boolean;
  textAreaProps?: TextAreaProps;
}

export function RHFInput({
  name,
  control,
  label,
  required,
  isTextArea,
  textAreaProps,
  ...inputProps
}: RHFInputProps) {
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
            {isTextArea ? (
              <Input.TextArea
                {...field}
                {...textAreaProps}
                status={error ? "error" : ""}
                className="rounded-[4px] hover:border-[#1976D2] focus:border-[#1976D2]"
              />
            ) : (
              <Input
                {...field}
                {...inputProps}
                status={error ? "error" : ""}
                className="rounded-[4px] hover:border-[#1976D2] focus:border-[#1976D2]"
              />
            )}
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
