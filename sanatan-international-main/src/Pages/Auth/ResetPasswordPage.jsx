import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "./AuthLayout";
import { Field } from "./LoginPage";
import authService from "../../services/auth.service";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const password = watch("password");

  const onSubmit = async (values) => {
    try {
      await authService.resetPassword(token, { password: values.password });
      toast.success("Password reset! Please log in.");
      navigate("/login");
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        toast.error("This link has expired. Request a new one.");
      } else {
        toast.error(err.response?.data?.message || "Reset failed");
      }
    }
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your new password"
      footer={<Link to="/forgot-password" className="text-orange-500 hover:underline">Request new link</Link>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="New Password" error={errors.password?.message}>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "At least 6 characters" },
            })}
            className="auth-input"
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
          />
        </Field>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2 rounded-md"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </AuthLayout>
  );
}
