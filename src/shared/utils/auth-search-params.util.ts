"use client";

import { createParser } from "nuqs";

import { SearchParams } from "../enums";

export enum AuthSearchParams {
  Login = "login",
  Signup = "signup",
}

export const isValidAuthSearchParams = (
  authSearchParams: string
): authSearchParams is AuthSearchParams => {
  const validAuthSearchParams = Object.values(AuthSearchParams);
  return validAuthSearchParams.includes(authSearchParams as AuthSearchParams);
};

export const parseAsAuthSearchParams = createParser({
  parse: (queryValue) => {
    if (!isValidAuthSearchParams(queryValue)) {
      return null;
    }
    return queryValue;
  },
  serialize: (value) => {
    return value;
  },
});

export const AUTH_SEARCH_PARAMS = {
  [SearchParams.Auth]: parseAsAuthSearchParams,
};
