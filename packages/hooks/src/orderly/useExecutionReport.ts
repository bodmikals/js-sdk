import useSWRSubscription from "swr/subscription";
import { useWS } from "../useWS";

export const useExecutionReport = () => {
  const ws = useWS();
  const { data } = useSWRSubscription("executionreport", (_, { next }) => {
    const unsubscribe = ws.privateSubscribe("executionreport", {
      onMessage: (data: any) => {
        console.log(data);
      },
    });
    return () => unsubscribe();
  });

  return data;
};
