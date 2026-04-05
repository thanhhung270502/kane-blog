"use client";

import type { FieldValues, UseFormReturn } from "react-hook-form";
import { FormProvider as ReactHookFormProvider } from "react-hook-form";

type FormProviderProps<T extends FieldValues> = {
  children: React.ReactNode;
  formMethods: UseFormReturn<T>;
  onSubmit: VoidFunction;
  className?: string;
};

export const FormProvider = <T extends FieldValues>({
  children,
  formMethods,
  onSubmit,
  className,
}: FormProviderProps<T>) => {
  return (
    <ReactHookFormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </ReactHookFormProvider>
  );
};
