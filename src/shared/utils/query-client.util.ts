import {
  type InfiniteData,
  QueryClient,
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
  useMutation,
  type UseMutationOptions,
  usePrefetchQuery,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseQueryResult,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type QueryProps<Response, Input = null> = Input extends null
  ? Omit<UseQueryOptions<Response, AxiosError>, "queryKey" | "queryFn">
  : Omit<UseQueryOptions<Response, AxiosError>, "queryKey" | "queryFn"> & { input: Input };

export type InfiniteQueryProps<Response, TData = unknown, Input = null> = Input extends null
  ? Omit<
      UseInfiniteQueryOptions<Response, AxiosError, TData>,
      "queryKey" | "queryFn" | "getNextPageParam" | "getPreviousPageParam" | "initialPageParam"
    >
  : Omit<
      UseInfiniteQueryOptions<Response, AxiosError, TData>,
      "queryKey" | "queryFn" | "getNextPageParam" | "getPreviousPageParam" | "initialPageParam"
    > & { input: Input };

export type MutationProps<Response, Input = unknown, Context = unknown> = Omit<
  UseMutationOptions<Response, AxiosError, Input, Context>,
  "mutationFn"
>;

export type PageParam = {
  offset: number;
  limit: number;
};

export {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  usePrefetchQuery,
  useQuery,
  useQueryClient,
  UseQueryResult,
  useSuspenseQuery,
};

export const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: false,
      },
    },
  });
};
