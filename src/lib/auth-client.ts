import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({

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