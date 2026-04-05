import type { GetRequestParams, PostRequestParams } from "@/shared/types";

import { createAxios } from "./axios-client";

const apiClient = createAxios();

export const getRequest = async ({ path, config, customHeader, params }: GetRequestParams) => {
  return await apiClient.getRequest({ path, config, customHeader, params });
};

export const postRequest = async <T>({
  path,
  config,
  customHeader,
  data,
  params,
}: PostRequestParams<T>) => {
  return await apiClient.postRequest({ path, config, customHeader, data, params });
};

export const putRequest = async <T>({
  path,
  config,
  customHeader,
  data,
  params,
}: PostRequestParams<T>) => {
  return await apiClient.putRequest({ path, config, customHeader, data, params });
};

export const patchRequest = async <T>({
  path,
  config,
  customHeader,
  data,
  params,
}: PostRequestParams<T>) => {
  return await apiClient.patchRequest({ path, config, customHeader, data, params });
};

export const deleteRequest = async <T>({
  path,
  config,
  customHeader,
  data,
  params,
}: PostRequestParams<T>) => {
  return await apiClient.delRequest({ path, config, customHeader, data, params });
};
