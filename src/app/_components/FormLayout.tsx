"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import PurpleLayout from "./PurpleLayout";

interface LayoutProps<TFormValues extends FieldValues> {
  children: React.ReactNode;
  form: UseFormReturn<TFormValues>;
  onSubmit: SubmitHandler<TFormValues>;
  buttonText?: string;
  showButton?: boolean;
}

export default function FormLayout<TFormValues extends FieldValues>({
  children,
  form,
  onSubmit,
  buttonText = "Submit",
  showButton = true,
}: LayoutProps<TFormValues>) {
  return (
    <PurpleLayout>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (err) => {
            console.error(err);
          })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          className="flex items-center justify-center"
        >
          <div className="flex w-11/12 md:w-3/4 lg:w-1/2 my-8 flex-col items-center justify-center space-y-4">
            {children}
            {showButton ? (
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  form.formState.isValidating
                }
                className="self-start"
              >
                {form.formState.isSubmitting ? <Loader2 /> : buttonText}
              </Button>
            ) : null}
          </div>
        </form>
      </Form>
    </PurpleLayout>
  );
}
