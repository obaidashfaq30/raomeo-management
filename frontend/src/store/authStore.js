import { create } from "zustand";
import { persist } from "zustand/middleware";
import { endpoints } from "../api/client";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      loading: false,
      error: null,
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await endpoints.login({ email, password });
          set({
            token: response.data.data.token,
            user: response.data.data.user,
            loading: false
          });
          return true;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.error || "Unable to sign in"
          });
          return false;
        }
      },
      logout: () => set({ token: null, user: null, error: null })
    }),
    {
      name: "raomeo-auth"
    }
  )
);
