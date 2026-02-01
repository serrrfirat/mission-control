import { ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  console.warn("NEXT_PUBLIC_CONVEX_URL not set. Convex features will not work.");
}

export const convex = convexUrl
  ? new ConvexReactClient(convexUrl)
  : null;

// Helper to check if Convex is configured
export const isConvexConfigured = () => convex !== null;
