import type { AxiosRequestConfig, RawAxiosRequestHeaders } from "axios";

export type GetParams = {
  path: string;
  config?: AxiosRequestConfig;
  customHeader?: RawAxiosRequestHeaders;
  applyMiddleWare?: boolean;
  params?: AxiosRequestConfig["params"];
};

export type PostParams<T> = GetParams & {
  data?: T;
};

export type GetRequestParams = GetParams;
export type PostRequestParams<T> = PostParams<T>;
