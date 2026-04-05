export const APIMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;
export type APIMethod = (typeof APIMethod)[keyof typeof APIMethod];

export interface APIDefinition<TParams extends Record<string, string> = NonNullable<unknown>> {
  method: APIMethod;
  baseUrl: string;
  subUrl: string;
  pathRegex?: RegExp;
  requestBody?: any;
  responseBody: any;
  queryParams?: any;
  customHeaders?: any;
  buildUrlPath: (params: TParams) => string;
}
