import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { stripePromise } from "../../lib/stripe";
import courseService from "../../services/course.service";
import orderService from "../../services/order.service";
import LoadingSpinner from "../../Components/shared/LoadingSpinner";

const thumb = (c) => c?.thumbnail?.[0]?.url || "https://placehold.co/600x400?text=Course";

function PaymentForm({ courseId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-success?courseId=${courseId}`,
      },
      redirect: "if_required",
    });
    if (error) {
      toast.error(error.message || "Payment failed");
      setSubmitting(false);
      return;
    }
    navigate(`/order-success?courseId=${courseId}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-md"
      >
        {submitting ? "Processing..." : "Pay now"}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const c = await courseService.getCourseById(courseId);
        const cd = c.data?.data;
        const courseData = Array.isArray(cd) ? cd[0] : cd;
        if (!mounted) return;
        setCourse(courseData);

        const orderRes = await orderService.createOrder(courseId);
        const cs = orderRes.data?.data?.clientSecret;
        if (mounted) setClientSecret(cs || null);
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || "Failed to start checkout");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [courseId]);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-[#FAF8F3] pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-serif-elegant text-3xl text-slate-800 mb-6">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order summary */}
          {course && (
            <div className="bg-white rounded-xl p-5 border border-slate-100 h-fit">
              <h2 className="font-medium text-slate-800 mb-4">Order summary</h2>
              <div className="flex gap-3">
                <img src={thumb(course)} alt={course.title} className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{course.title}</p>
                  {course.label && <p className="text-xs text-slate-500">{course.label}</p>}
                </div>
              </div>
              <div className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Price</span>
                  <span>₹{course.totalPrice}</span>
                </div>
                {Number(course.discountPercent) > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount ({course.discountPercent}%)</span>
                    <span>− ₹{course.totalPrice - course.payableAmount}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 font-bold text-slate-800">
                  <span>Payable</span>
                  <span>₹{course.payableAmount ?? course.totalPrice}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="bg-white rounded-xl p-5 border border-slate-100">
            <h2 className="font-medium text-slate-800 mb-4">Payment</h2>
            {error ? (
              <div className="text-sm text-red-600">
                {error}
                <div className="mt-3">
                  <Link to={`/courses/${courseId}`} className="text-orange-500 hover:underline">
                    Back to course
                  </Link>
                </div>
              </div>
            ) : !stripePromise ? (
              <div className="text-sm bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-3">
                <strong>Payments unavailable.</strong> Stripe publishable key is not configured yet.
                Set <code>VITE_STRIPE_PUBLISHABLE_KEY</code> to enable checkout.
              </div>
            ) : !clientSecret ? (
              <p className="text-sm text-slate-500">Initializing payment...</p>
            ) : (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
                <PaymentForm courseId={courseId} />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
