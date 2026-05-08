import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { endpoints } from "../api/client";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      loading: false,
      hydrated: false,
      error: null,
      setHydrated: () => set({ hydrated: true }),
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
      name: "raomeo-mobile-auth",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      }
    }
  )
);
