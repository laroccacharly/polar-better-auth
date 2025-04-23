import { betterAuth } from "better-auth";
import { polar } from "@polar-sh/better-auth";
import { magicLink } from "better-auth/plugins";
import { Polar } from "@polar-sh/sdk";
import { Pool } from "pg";
import { Resend } from 'resend';
import { env } from "@/env";
import { nextCookies } from "better-auth/next-js";

// --- Initialize Resend Client --- //
const resend = new Resend(env.RESEND_API_KEY);

// --- Initialize Polar Client (Needed for the plugin) --- //
const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: env.POLAR_SERVER,
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
    successUrl: `${env.SUCCESS_URL}?checkout_id={CHECKOUT_ID}`
  },
  ...(env.POLAR_WEBHOOK_SECRET ? {
    webhooks: {
      secret: env.POLAR_WEBHOOK_SECRET,
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
  secret: env.BETTER_AUTH_SECRET,
  database: new Pool({
    connectionString: env.DATABASE_URL,
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
          console.log("Sending magic link via Resend to:", email);
          try {
            await resend.emails.send({
              from: env.RESEND_FROM_EMAIL, // Use environment variable for sender
              to: email,
              subject: 'Your Magic Login Link',
              html: `<p>Click <a href="${url}">here</a> to log in.</p><p>Your token is ${token} (for debugging, remove in production)</p>`
            });
            console.log("Magic link email sent successfully to:", email);
            console.log("Magic link URL:", url);
          } catch (error) {
            console.error("Failed to send magic link email:", error);
            // Handle error appropriately (e.g., log, alert)
          }
      } 
  }),
  nextCookies(), 
  ],
});

console.log("betterAuth instance created using Email/Password in src/lib/auth.ts"); 