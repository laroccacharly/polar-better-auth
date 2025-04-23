import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";
// Create the client instance.
// Since your API routes (/api/auth/...) are likely served from the same
// origin as your frontend pages in Next.js, you typically don't need
// to specify the baseURL.
export const authClient = createAuthClient({
  // No plugins needed for basic email/password
  // baseURL: "http://localhost:3000" // Only needed if frontend/backend are on different origins
  plugins: [
    magicLinkClient()
  ]
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;


console.log("betterAuth client created for Email/Password in src/lib/auth-client.ts"); 