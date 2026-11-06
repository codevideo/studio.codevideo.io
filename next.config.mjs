// A static export, deployed by Netlify from out/. Stripe links and API URLs are
// inlined at build time, so a missing one would only show up as a dead button in
// production. Fail the Netlify build instead.
const requiredOnNetlify = [
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_CODEVIDEO_API_URL",
  "NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_LINK",
  "NEXT_PUBLIC_STRIPE_STARTER_PAYMENT_LINK",
  "NEXT_PUBLIC_STRIPE_CREATOR_PAYMENT_LINK",
  "NEXT_PUBLIC_STRIPE_ENTERPRISE_PAYMENT_LINK",
  "NEXT_PUBLIC_STRIPE_LIFETIME_PAYMENT_LINK",
  "NEXT_PUBLIC_STRIPE_TOPUP_PAYMENT_LINK",
  "NEXT_PUBLIC_STRIPE_STARTER_MONTHLY_LINK",
];
if (process.env.NETLIFY === "true") {
  const missing = requiredOnNetlify.filter((name) => !process.env[name]);
  if (missing.length > 0) throw new Error(`Set these in Netlify before deploying: ${missing.join(", ")}`);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: false,
};

export default nextConfig;
