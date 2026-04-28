import { useEffect } from "react";
import "./App.css";
import AppRoutes from "./AppRoutes/AppRoutes";
import ScrollToTop from "./Utils/ScrollToTop";
import useAuthStore from "./store/authStore";
import authService from "./services/auth.service";

function App() {
  const setUser = useAuthStore((s) => s.setUser);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setLoading = useAuthStore((s) => s.setLoading);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const persistedUser = useAuthStore.getState().user;
      try {
        const refreshRes = await authService.refreshToken();
        const accessToken = refreshRes?.data?.data?.accessToken;
        if (accessToken) {
          if (mounted) setAccessToken(accessToken);
          let user = refreshRes?.data?.data?.user;
          if (!user) {
            const me = await authService.getCurrentUser();
            // backend wraps it: { data: { user: {...} } }
            user = me?.data?.data?.user || me?.data?.data;
          }
          if (mounted && user) setUser(user, accessToken);
        } else if (persistedUser) {
          // refresh returned no token but user is persisted → logged out
          logout();
        }
      } catch {
        // refresh failed → cookie expired/missing. Drop any persisted user.
        if (persistedUser) logout();
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [setUser, setAccessToken, setLoading, logout]);

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <ScrollToTop />
      <AppRoutes />
    </div>
  );
}

export default App;
