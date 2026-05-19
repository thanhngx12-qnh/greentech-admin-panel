// File: src/components/ui/form/RHFInputNumber.tsx
import React from "react";
import { Controller, Control } from "react-hook-form";
import { InputNumber, InputNumberProps } from "antd";

interface RHFInputNumberProps extends Omit<
  InputNumberProps,
  "name" | "defaultValue"
> {
  name: string;
  control: any;
  label: string;
  required?: boolean;
}

export function RHFInputNumber({
  name,
  control,
  label,
  required,
  ...props
}: RHFInputNumberProps) {
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
            <InputNumber
              {...field}
              {...props}
              status={error ? "error" : ""}
              // FIX: Ép width 100% qua style để ghi đè mặc định của Antd
              style={{ width: "100%" }}
              className="rounded-[4px]"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
              }
              parser={(value) => value!.replace(/\.\s?|(,*)/g, "")}
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
