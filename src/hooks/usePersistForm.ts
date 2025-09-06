import { useForm } from "react-hook-form";
import type { FieldValues, UseFormProps, UseFormReturn } from "react-hook-form";
import { useEffect } from "react";

/**
 * Custom form persistence that doesn't cause setState during render
 * Prevents defaultValues from being set if form persisted in sessionStorage
 */
export const usePersistForm = <TFieldValues extends FieldValues = FieldValues>(
  name: string,
  props?: UseFormProps<TFieldValues>,
): UseFormReturn<TFieldValues> => {
  const hasStorage =
    typeof window !== "undefined" ? window.sessionStorage.getItem(name) : false;

  const form = useForm<TFieldValues>({
    ...(typeof window !== "undefined" && hasStorage
      ? (delete props?.defaultValues, props)
      : props),
  });

  // Simplified persistence - only load on mount, save manually
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load saved data on mount only
    const savedData = window.sessionStorage.getItem(name);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Use setTimeout to avoid render conflicts
        setTimeout(() => form.reset(parsedData as TFieldValues), 0);
      } catch (error) {
        console.warn('Failed to parse saved form data:', error);
      }
    }
  }, [name]); // Remove form from dependencies to prevent re-runs

  // Save to storage periodically instead of on every change
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const interval = setInterval(() => {
      const currentValues = form.getValues();
      window.sessionStorage.setItem(name, JSON.stringify(currentValues));
    }, 2000); // Save every 2 seconds instead of on every change

    return () => clearInterval(interval);
  }, [name, form]);

  return form;
};
