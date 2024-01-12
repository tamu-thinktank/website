import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/trpc/react";
import { clientErrorHandler } from "@/lib/utils";

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
  } = api.admin.getAvailabilities.useQuery(undefined);

  const { mutate, isLoading: isMutateLoading } =
    api.admin.updateAvailabilities.useMutation({
      onSettled: async (newData, err) => {
        if (err) {
          clientErrorHandler(err, toast);
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
