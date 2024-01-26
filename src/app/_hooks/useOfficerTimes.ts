import { useToast } from "@/components/ui/use-toast";
import { api, clientErrorHandler } from "@/lib/trpc/react";

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
  } = api.admin.getAvailabilities.useQuery(undefined, {
    onError: (err) => {
      clientErrorHandler({ err, toastFn: toast });
    },
  });

  const { mutate, isLoading: isMutateLoading } =
    api.admin.updateAvailabilities.useMutation({
      onSettled: async (newData, err) => {
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
