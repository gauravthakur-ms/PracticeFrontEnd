import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import AuthLayout from "./AuthLayout";
import authService from "../../services/auth.service";
import useAuthStore from "../../store/authStore";

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const onSubmit = async (values) => {
    try {
      const { user, accessToken } = await authService.login(values);
      if (!user || !accessToken) throw new Error("Invalid login response");
      setUser(user, accessToken);
      toast.success("Welcome back!");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.message || "Login failed";
      if (status === 401) toast.error("Invalid email or password");
      else if (status === 403) toast.error("Please verify your email first");
      else toast.error(msg);
    }
  };

  const googleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your journey"
      footer={
        <>
          Don't have an account?{" "}
          <Link
            to="/register"
            state={location.state?.from ? { from: location.state.from } : undefined}
            className="text-orange-500 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="auth-input"
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="auth-input"
            placeholder="••••••••"
          />
        </Field>
        <div className="text-right">
          <Link to="/forgot-password" className="text-xs text-orange-500 hover:underline">
            Forgot your password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2 rounded-md transition"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <div className="my-4 flex items-center gap-3 text-xs text-slate-400">
        <span className="flex-1 h-px bg-slate-200" /> OR <span className="flex-1 h-px bg-slate-200" />
      </div>
      <button
        type="button"
        onClick={googleLogin}
        className="w-full flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2 rounded-md"
      >
        <FcGoogle size={20} /> Continue with Google
      </button>
    </AuthLayout>
  );
}

export function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="block text-sm text-slate-700 mb-1">{label}</span>
      {children}
      {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
    </label>
  );
}
