import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  SignUpRequest,
  SignUpResponse,
  UserObject,
} from "@common";
import { toast } from "sonner";

import type { MutationProps, QueryProps } from "@/shared";
import { asError, useMutation, useQuery, useQueryClient, USER_KEYS } from "@/shared";
import { getMe, login, logout, register } from "@/shared/apis";

// ------- API_LOGIN -------
type LoginMutationProps = MutationProps<LoginResponse, LoginRequest>;

export const useLoginMutation = (props: LoginMutationProps = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      toast.success("Login successful");
      return await queryClient.invalidateQueries({ queryKey: USER_KEYS.me() });
    },
    onError: (error) => {
      toast.error(asError(error).message);
    },
    ...props,
  });
};

// ------- API_REGISTER -------
type RegisterMutationProps = MutationProps<SignUpResponse, SignUpRequest>;

export const useRegisterMutation = (props: RegisterMutationProps = {}) => {
  return useMutation({
    mutationFn: register,
    onSuccess: async () => {
      toast.success("Register successful");
    },
    onError: (error) => {
      toast.error(asError(error).message);
    },
    ...props,
  });
};

// ------- API_LOGOUT -------
type LogoutMutationProps = MutationProps<LogoutResponse>;

export const useLogoutMutation = (props: LogoutMutationProps = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("Logout successful");
      queryClient.removeQueries({ queryKey: USER_KEYS.me() });
    },
    onError: (error) => {
      toast.error(asError(error).message);
    },
    ...props,
  });
};

// ------- API_ME -------
type QueryMe = QueryProps<UserObject>;
export const useQueryMe = (props: QueryMe = {}) => {
  return useQuery({
    queryKey: USER_KEYS.me(),
    queryFn: getMe,
    ...props,
  });
};
