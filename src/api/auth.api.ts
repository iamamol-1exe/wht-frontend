import { ApiError } from "@/types/apiTypes";
import { handleApiError, publicApiClient } from "../utils/axios.config";

export const AuthApi = {
  login: async function (email: string, password: string) {
    try {
      const { data } = await publicApiClient.post("/auth/login", {
        email,
        password,
      });
      return data;
    } catch (error) {
      throw new Error(handleApiError(error as ApiError));
    }
  },
  register: async function (username: string, email: string, password: string) {
    try {
      const { data } = await publicApiClient.post("/auth/register", {
        username,
        email,
        password,
      });
      return data;
    } catch (error) {
      throw new Error(handleApiError(error as ApiError));
    }
  },
};
