import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Persist ONLY the user object to localStorage so the UI stays signed-in
// across reloads while App.jsx silently rotates the short-lived
// accessToken via the httpOnly refresh-token cookie.
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user, accessToken) =>
        set({
          user,
          accessToken: accessToken ?? null,
          isAuthenticated: !!user,
        }),

      setAccessToken: (accessToken) => set({ accessToken }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "sanatan-auth",
      storage: createJSONStorage(() => localStorage),
      // never persist the access token (security)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  return { user, accessToken, isAuthenticated, isLoading };
};

export default useAuthStore;
