import type { GetUserByIdResponse } from "@common";

import { getUserById } from "@/shared/apis";
import { USER_KEYS } from "@/shared/constants";
import type { QueryProps } from "@/shared/utils";
import { useQuery } from "@/shared/utils";

// ------- API_ME -------
type QueryUserByIdProps = QueryProps<GetUserByIdResponse, { userId: string }>;
export const useQueryUserById = (props: QueryUserByIdProps) => {
  const { userId } = props.input;
  return useQuery({
    queryKey: USER_KEYS.detail(userId),
    queryFn: () => getUserById(userId),
    ...props,
  });
};
