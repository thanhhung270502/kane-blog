// eslint-disable-next-line simple-import-sort/imports
import "server-only";

import type { NextRequest } from "next/server";
import { logger } from "./logger";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { createAxiosServer } from "./axios-server";
import { CookieKeys } from "@/shared";
import { AxiosError } from "axios";
import type { GetParams, PostParams } from "@/shared/types";

const axiosServer = createAxiosServer();

type GetRequestParams = GetParams;

type PostRequestParams<T> = PostParams<T>;

type RouterHandlerProps = {
  handler: Function;
  customResponseHandler?: Function;
  customErrorHandler?: Function;
};

type ApiServiceProps<T> =
  | GetParams
  | (PostParams<T> & {
      withAuth?: boolean;
    });

export const getRequest = async ({ path, config, customHeader, params }: GetRequestParams) => {
  const accessToken = await getCookie(CookieKeys.ACCESS_TOKEN, { cookies });
  customHeader = {
    ...customHeader,
    Authorization: `Bearer ${accessToken}`,
  };
  return await axiosServer.getRequest({ path, config, customHeader, params });
};

export const postRequest = async <T>({
  path,
  config,
  customHeader,
  data,
  params,
}: PostRequestParams<T>) => {
  const accessToken = await getCookie(CookieKeys.ACCESS_TOKEN, { cookies });
  customHeader = {
    ...customHeader,
    Authorization: `Bearer ${accessToken}`,
  };
  const response = await axiosServer.postRequest({ path, config, customHeader, data, params });
  return response.data;
};

export const putRequest = async <T>({
  path,
  config,
  customHeader,
  data,
  params,
}: PostRequestParams<T>) => {
  const accessToken = getCookie(CookieKeys.ACCESS_TOKEN, { cookies });
  customHeader = {
    ...customHeader,
    Authorization: `Bearer ${accessToken}`,
  };
  const response = await axiosServer.putRequest({ path, config, customHeader, data, params });
  return response.data;
};

export const patchRequest = async <T>({
  path,
  config,
  customHeader,
  data,
  params,
}: PostRequestParams<T>) => {
  const accessToken = getCookie(CookieKeys.ACCESS_TOKEN, { cookies });
  customHeader = {
    ...customHeader,
    Authorization: `Bearer ${accessToken}`,
  };
  const response = await axiosServer.patchRequest({ path, config, customHeader, data, params });
  return response.data;
};

export const deleteRequest = async <T>({
  path,
  config,
  customHeader,
  data,
  params,
}: PostRequestParams<T>) => {
  const accessToken = getCookie(CookieKeys.ACCESS_TOKEN, { cookies });
  customHeader = {
    ...customHeader,
    Authorization: `Bearer ${accessToken}`,
  };
  const response = await axiosServer.delRequest({ path, config, customHeader, data, params });
  return response.data;
};

export const apiRequest = async <T>(props: ApiServiceProps<T>) => {
  const method = (props.config?.method || "get")?.toLowerCase();
  switch (method) {
    case "get":
      return getRequest(props as GetParams);
    case "post":
      return postRequest(props as PostParams<T>);
    case "put":
      return putRequest(props as PostParams<T>);
    case "patch":
      return patchRequest(props as PostParams<T>);
    case "delete":
      return deleteRequest(props as GetParams);
    default:
      return getRequest(props as GetParams);
  }
};

/**
 * Handles URL query parameters from NextRequest, automatically detecting
 * and preserving array parameters (e.g., ?status=A&status=B becomes ['A', 'B'])
 */
export const apiRequestWithQuery = async <T>(req: NextRequest, props: ApiServiceProps<T>) => {
  const urlQueryParams: Record<string, string | string[]> = {};
  req.nextUrl.searchParams.forEach((value, key) => {
    const allValues = req.nextUrl.searchParams.getAll(key);
    urlQueryParams[key] = allValues.length > 1 ? allValues : value;
  });

  props.params = {
    ...props.params,
    ...urlQueryParams,
  };

  return apiRequest<T>(props);
};

export const apiRouteHandler =
  <T>({ handler, customResponseHandler, customErrorHandler }: RouterHandlerProps) =>
  async (req: NextRequest, context?: any) => {
    try {
      const response: T = await handler(req, context);
      if (customResponseHandler) {
        return customResponseHandler(response, req, context);
      }
      return Response.json(response, { status: 200 });
    } catch (error) {
      logger.error(error);
      let errorMsg = "Something went wrong";
      let errorStatus = 500;
      if (error instanceof AxiosError) {
        errorMsg = error.response?.data || error.message;
        errorStatus = error.response?.status || (error.code as unknown as number);
      }
      if (customErrorHandler) {
        return customErrorHandler(error, req, context);
      }
      return Response.json({ error: errorMsg }, { status: errorStatus });
    }
  };
