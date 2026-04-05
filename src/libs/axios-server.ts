import type { AxiosRequestConfig, RawAxiosRequestHeaders } from "axios";
import axios from "axios";

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

export const createAxiosServer = () => {
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    // https://github.com/axios/axios/issues/5058#issuecomment-1272107602
    // Example: Params { a: ['b', 'c']}
    // From (by default - false) 'a[]=b&a[]=c'
    // To (by null) 'a=b&a=c'
    paramsSerializer: {
      indexes: null,
    },
  });

  const getRequest = async ({ path, config, customHeader, params }: GetParams) => {
    const response = await axiosInstance.get(path, {
      headers: {
        Accept: "application/json",
        ...customHeader,
      },
      params,
      ...config,
    });
    return response.data;
  };

  const postRequest = <T>({ path, config, customHeader, data, params }: PostParams<T>) => {
    return axiosInstance.post(path, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...customHeader,
      },
      params,
      ...config,
    });
  };

  const putRequest = <T>({ path, config, customHeader, data, params }: PostParams<T>) => {
    return axiosInstance.put(`${path}`, data, {
      headers: {
        Accept: "application/json",
        ...customHeader,
      },
      params,
      ...config,
    });
  };

  const patchRequest = <T>({ path, config, customHeader, data, params }: PostParams<T>) => {
    return axiosInstance.patch(path, data, {
      headers: {
        Accept: "application/json",
        ...customHeader,
      },
      params,
      ...config,
    });
  };

  const delRequest = <T>({ path, config, customHeader, data, params }: PostParams<T>) => {
    return axiosInstance.delete(path, {
      headers: {
        Accept: "application/json",
        ...customHeader,
      },
      params,
      ...(data ? { data } : {}),
      ...config,
    });
  };

  return {
    getRequest,
    postRequest,
    putRequest,
    patchRequest,
    delRequest,
  };
};
