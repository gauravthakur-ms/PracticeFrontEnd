import { loadStripe } from "@stripe/stripe-js";

const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Returns null if key not configured (deferred). Pages should handle null.
export const stripePromise = key ? loadStripe(key) : null;
