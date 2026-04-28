import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import AuthLayout from "./AuthLayout";
import { Field } from "./LoginPage";
import authService from "../../services/auth.service";

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const password = watch("password");

  const onSubmit = async (values) => {
    try {
      await authService.register({ email: values.email, password: values.password });
      toast.success("Account created! Check your email to verify your account.");
      navigate("/login", { state: from ? { from } : undefined });
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
    }
  };

  const googleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Begin your spiritual learning journey"
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            state={from ? { from } : undefined}
            className="text-orange-500 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            })}
            className="auth-input"
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "At least 6 characters" },
            })}
            className="auth-input"
            placeholder="At least 6 characters"
          />
        </Field>
        <Field label="Confirm Password" error={errors.confirm?.message}>
          <input
            type="password"
            {...register("confirm", {
              required: "Please confirm",
              validate: (v) => v === password || "Passwords do not match",
            })}
            className="auth-input"
            placeholder="Repeat password"
          />
        </Field>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2 rounded-md transition"
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
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
