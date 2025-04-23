// Removed imports and logic now handled in src/lib/auth.ts
import { auth } from "@/lib/auth"; // Import the configured auth instance
import { toNextJsHandler } from "better-auth/next-js";

// --- Export Next.js Handlers --- //
// Pass the imported auth instance to the handler helper
export const { GET, POST } = toNextJsHandler(auth); 