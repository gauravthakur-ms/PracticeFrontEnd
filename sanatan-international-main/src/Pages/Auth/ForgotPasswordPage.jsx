import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "./AuthLayout";
import { Field } from "./LoginPage";
import authService from "../../services/auth.service";

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [sent, setSent] = useState(false);

  const onSubmit = async (values) => {
    try {
      await authService.forgotPassword(values);
    } catch {
      // intentionally swallow - don't reveal email existence
    }
    setSent(true);
    toast.success("If that email exists, a reset link has been sent.");
  };

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email and we'll send a reset link"
      footer={<Link to="/login" className="text-orange-500 hover:underline">Back to login</Link>}
    >
      {sent ? (
        <p className="text-center text-slate-600">
          If that email exists, a reset link has been sent.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Email" error={errors.email?.message}>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="auth-input"
              placeholder="you@example.com"
            />
          </Field>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2 rounded-md"
          >
            {isSubmitting ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
