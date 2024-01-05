import { type RouterInputs } from "@/lib/trpc/shared";
import { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

/**
 * Tab names match with object sections in the form schema
 */
export type ApplyTabType =
  | "id"
  | "personal"
  | "interests"
  | "leadership"
  | "resumeLink";

/**
 * Validate input in section before allowing user to move on to next
 * */
export default function useApplyFormTab(
  currentTab: ApplyTabType,
  nextTab: ApplyTabType,
) {
  const form = useFormContext<RouterInputs["public"]["apply"]>();

  const [isValid, setIsValid] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [value, setValue] = useState<ApplyTabType>(currentTab);

  const handleNext = useCallback(async () => {
    const isValid = await form.trigger(currentTab, {
      shouldFocus: true,
    });

    if (isValid) {
      setIsValid(true);
      setValue(nextTab);
    } else {
      setIsValid(false);
      setValue(currentTab);
    }

    setIsChecked(true);
  }, [form.trigger]);

  useEffect(() => {
    if (!isChecked) return;

    const sub = form.watch((values, { name }) => {
      if (name?.startsWith(currentTab)) {
        form
          .trigger(currentTab)
          .then((isValid) => {
            if (isValid) {
              setIsValid(true);
              setValue(nextTab);
            } else {
              setIsValid(false);
              setValue(currentTab);
            }
          })
          .catch(() => setIsValid(false));
      }
    });

    return () => {
      sub.unsubscribe();
    };
  }, [form.watch, isChecked]);

  return [isValid, isChecked, value, handleNext] as const;
}
