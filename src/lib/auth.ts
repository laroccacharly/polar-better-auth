import { betterAuth } from "better-auth";
import { polar } from "@polar-sh/better-auth";
import { magicLink } from "better-auth/plugins";
import { Polar } from "@polar-sh/sdk";
import { Pool } from "pg";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// --- Environment Variables --- //
const polarAccessToken = process.env.POLAR_ACCESS_TOKEN;
const polarServerEnv = process.env.POLAR_SERVER;
const polarWebhookSecret = process.env.POLAR_WEBHOOK_SECRET; // Optional
const authSecret = process.env.BETTER_AUTH_SECRET;
const successUrl = process.env.SUCCESS_URL;
const dbConnectionString = process.env.DATABASE_URL;
// --- Validations (Moved here as they are needed for the config) --- //
if (!polarAccessToken) {
  throw new Error("POLAR_ACCESS_TOKEN environment variable is not set.");
}
if (!authSecret) {
  throw new Error("BETTER_AUTH_SECRET environment variable is not set. It is required for session security.");
}
if (!successUrl) {
  throw new Error("SUCCESS_URL environment variable is not set. It is required for checkout.");
}

// Validate Polar server environment
if (polarServerEnv !== 'sandbox' && polarServerEnv !== 'production') {
  throw new Error(`POLAR_SERVER must be 'sandbox' or 'production', received: ${polarServerEnv}`);
}
const polarServer: 'sandbox' | 'production' = polarServerEnv;

// --- Initialize Polar Client (Needed for the plugin) --- //
const polarClient = new Polar({
  accessToken: polarAccessToken,
  server: polarServer,
});

// --- Prepare Polar Plugin Config (Webhooks Optional) --- //
const polarPluginConfig = {
  client: polarClient,
  createCustomerOnSignUp: true,
  enableCustomerPortal: true,
  checkout: {
    enabled: true,
    products: [
      {
        productId: "c429985c-b08f-45ae-9666-dc62cfbd8883", // Example Product ID
        slug: "consultation" // Define a user-friendly slug
      },
    ],
    successUrl: `${successUrl}?checkout_id={CHECKOUT_ID}`
  },
  ...(polarWebhookSecret ? {
    webhooks: {
      secret: polarWebhookSecret,
      onPayload: async (event: unknown) => { // Changed any to unknown
        // Added type checks for safety
        let eventId = 'unknown_id';
        let eventType = 'unknown_type';
        if (typeof event === 'object' && event !== null) {
           eventId = 'id' in event ? String(event.id) : 'unknown_id';
           eventType = 'type' in event ? String(event.type) : 'unknown_type';
        }
        console.log("Received Polar Webhook:", eventType, eventId);
      },
      onSubscriptionUpdated: async (payload: unknown) => { // Changed any to unknown
        // Added type checks for safety
        let subId = 'unknown_sub_id';
        let subStatus = 'unknown_status';
        if (typeof payload === 'object' && payload !== null && 'subscription' in payload && typeof payload.subscription === 'object' && payload.subscription !== null) {
            const subscription = payload.subscription;
            subId = 'id' in subscription ? String(subscription.id) : 'unknown_sub_id';
            subStatus = 'status' in subscription ? String(subscription.status) : 'unknown_status';
        }
        console.log("Subscription Updated:", subId, subStatus);
      },
    }
  } : {})
};

// --- Initialize and Export betterAuth Instance --- //
export const auth = betterAuth({
  secret: authSecret,
  database: new Pool({
    connectionString: dbConnectionString,
  }),
  emailAndPassword: { // Ensure this is enabled
    enabled: true,
    signup: { enabled: true },
    login: { enabled: true },
    async sendResetPasswordEmail({ data, request }: { data: { email: string }, request: Request }) {
       console.log("Sending reset password email to:", data.email);
       console.log("Request details:", request);
    },
  },
  plugins: [
    polar(polarPluginConfig),
    magicLink({
        sendMagicLink: async ({ email, token, url }, request) => {
          // send email to user
          console.log("Sending magic link to:", email);
          console.log("Token:", token);
          console.log("URL:", url);
      } 
  }),
  ],
});

console.log("betterAuth instance created using Email/Password in src/lib/auth.ts"); 