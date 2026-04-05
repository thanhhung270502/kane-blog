import axios from "axios";

import type { GetParams, PostParams } from "@/shared/types";

export const createAxios = (baseURL?: string) => {
  const axiosClient = axios.create({
    ...(baseURL ? { baseURL } : {}),
    // https://github.com/axios/axios/issues/5058#issuecomment-1272107602
    // Example: Params { a: ['b', 'c']}
    // From (by default - false) 'a[]=b&a[]=c'
    // To (by null) 'a=b&a=c'
    paramsSerializer: {
      indexes: null,
    },
  });

  const getRequest = async ({ path, config, customHeader, params }: GetParams) => {
    const response = await axiosClient.get(path, {
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
    return axiosClient.post(path, data, {
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
    return axiosClient.put(`${path}`, data, {
      headers: {
        Accept: "application/json",
        ...customHeader,
      },
      params,
      ...config,
    });
  };

  const patchRequest = <T>({ path, config, customHeader, data, params }: PostParams<T>) => {
    return axiosClient.patch(path, data, {
      headers: {
        Accept: "application/json",
        ...customHeader,
      },
      params,
      ...config,
    });
  };

  const delRequest = <T>({ path, config, customHeader, data, params }: PostParams<T>) => {
    return axiosClient.delete(path, {
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
    axiosInstance: axiosClient,
  };
};
