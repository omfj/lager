import { createQuery } from "lager/query";
import { queryClient, queryObserver } from "./query-client";

export const createCountQuery = (wait = 3000) => {
  return createQuery(queryClient, {
    queryKey: ["api"],
    queryFn: () => fetch(`/api/count?wait=${wait}`).then((res) => res.text()),
  });
};
