import { apiClient, handleApiError } from "@/utils/axios.config";
import { ApiError } from "next/dist/server/api-utils";

export const chatApi = {
  getUsers: async function () {
    try {
      const { data } = await apiClient.get("/users/all-users");
      return data;
    } catch (error: unknown) {
      console.log(error);
      throw new Error(handleApiError(error as ApiError));
    }
  },
};
