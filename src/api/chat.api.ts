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

  getCurrentUser: async function () {
    try {
      const { data } = await apiClient.get("/users/me");
      return data;
    } catch (error: unknown) {
      console.log(error);
      throw new Error(handleApiError(error as ApiError));
    }
  },

  getUserById: async function (userId: string) {
    try {
      const { data } = await apiClient.get(`/users/${userId}`);
      return data;
    } catch (error: unknown) {
      console.log(error);
      throw new Error(handleApiError(error as ApiError));
    }
  },

  getAllFriends: async function () {
    try {
      const { data } = await apiClient.get("/users/getAllFriends");
      return data;
    } catch (error: unknown) {
      throw new Error(handleApiError(error as ApiError));
    }
  },

  sendFriendRequest: async function (recipient: string) {
    try {
      const { data } = await apiClient.post("/users/sendRequest", {
        recipient,
      });
      return data;
    } catch (error: unknown) {
      throw new Error(handleApiError(error as ApiError));
    }
  },

  updateProfile: async function (profileData: {
    bio?: string;
    location?: string;
    website?: string;
  }) {
    try {
      const { data } = await apiClient.patch("/users/update-bio", profileData);
      return data;
    } catch (error) {
      throw new Error(handleApiError(error as ApiError));
    }
  },
  fetchFriendReq: async function () {
    try {
      const { data } = await apiClient.get("/users/fetch-friend-req");
      return data;  
    } catch (error) {
      throw new Error(handleApiError(error as ApiError));
    }
  },
};
