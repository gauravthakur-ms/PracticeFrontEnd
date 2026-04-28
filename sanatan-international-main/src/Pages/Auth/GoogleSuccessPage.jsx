import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import authService from "../../services/auth.service";
import useAuthStore from "../../store/authStore";

export default function GoogleSuccessPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await authService.refreshToken();
        const accessToken = r.data?.data?.accessToken;
        if (!accessToken) throw new Error("No access token");
        const me = await authService.getCurrentUser();
        if (cancelled) return;
        const u = me.data?.data?.user || me.data?.data || null;
        setUser(u, accessToken);
        toast.success("Signed in with Google");
        navigate("/", { replace: true });
      } catch {
        toast.error("Google sign-in failed");
        navigate("/login", { replace: true });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center text-slate-600">
      Signing you in...
    </div>
  );
}
