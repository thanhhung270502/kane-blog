import type { GetUserByIdResponse } from "@common";
import { API_GET_USER_BY_ID } from "@common";

import { getRequest } from "@/libs/api-client";

export const getUserById = async (userId: string): Promise<GetUserByIdResponse> => {
  return await getRequest({
    path: API_GET_USER_BY_ID.buildUrlPath({ userId }),
  });
};
