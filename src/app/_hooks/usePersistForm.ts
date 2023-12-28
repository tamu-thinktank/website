import {
  useForm,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import useFormPersist from "react-hook-form-persist";

/**
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

  useFormPersist(name, form);

  return form;
};
