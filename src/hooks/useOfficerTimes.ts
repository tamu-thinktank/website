import { useToast } from "@/components/ui/use-toast";
import { api, clientErrorHandler } from "@/lib/trpc/react";
import { useEffect } from "react";

/**
 * Get officer availabilities and mutate current user availabilities
 */
export default function useOfficerTimes() {
  const { toast } = useToast();
  const apiUtils = api.useUtils();

  const {
    data,
    isFetched: isDataFetched,
    isFetching: isDataFetching,
    isLoading: isDataLoading,
    isError: isDataError,
    error: err,
  } = api.admin.getAvailabilities.useQuery(undefined);

  useEffect(() => {
    if (!isDataError) return;
    clientErrorHandler({ err, toastFn: toast });
  }, [isDataError, toast, err]);

  const { mutate, isPending: isMutateLoading } =
    api.admin.setAvailabilities.useMutation({
      onSettled: (newData, err) => {
        if (err) {
          clientErrorHandler({ err, toastFn: toast });
        }

        // refetch
        void apiUtils.admin.getAvailabilities.invalidate();
      },
    });

  return {
    data,
    isDataFetched,
    isDataFetching,
    isDataLoading,
    isMutateLoading,
    mutate,
  };
}
