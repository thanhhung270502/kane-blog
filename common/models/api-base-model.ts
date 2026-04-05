export type BaseAPIResponse<T> = {
  data: T;
  statusCode: number;
};

export interface BasePageableResponse<T> {
  items: T[];
  total: number;
}

/**
 * The interface representing a pageable response.
 * @typeParam T The type of items in the response list.
 */
export interface PageableResponse<T> {
  total_record: number;
  data: T[];
}

/*
 * The interface representing the query parameters for pagination.
 */
export interface PaginationQueryParams {
  limit: number;
  offset: number;
}
