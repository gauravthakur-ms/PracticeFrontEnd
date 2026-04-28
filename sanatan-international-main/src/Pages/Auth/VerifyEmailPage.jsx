import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import authService from "../../services/auth.service";

export default function VerifyEmailPage() {
  const { token } = useParams();
  const [state, setState] = useState({ loading: true, ok: false, message: "" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await authService.verifyEmail(token);
        if (mounted)
          setState({ loading: false, ok: true, message: res?.data?.message || "Email verified" });
      } catch (err) {
        if (mounted)
          setState({
            loading: false,
            ok: false,
            message: err.response?.data?.message || "Invalid or expired link",
          });
      }
    })();
    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <AuthLayout title={state.loading ? "Verifying..." : state.ok ? "Email verified" : "Verification failed"}>
      <p className="text-center text-slate-600 mb-4">
        {state.loading ? "Please wait while we verify your email." : state.message}
      </p>
      {!state.loading && (
        <Link
          to="/login"
          className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center font-semibold py-2 rounded-md"
        >
          Go to Login
        </Link>
      )}
    </AuthLayout>
  );
}
