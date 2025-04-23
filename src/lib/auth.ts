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
      onPayload: async (event: unknown) => { 
        // TDB
        console.log("Received Polar Webhook:", event);
      },
      onSubscriptionUpdated: async (payload: unknown) => { 
        // TDB
        console.log("Subscription Updated:", payload);
      },
    }
  } : {})
};

// --- Initialize and Export betterAuth Instance --- //
export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BASE_URL,
  database: new Pool({
    connectionString: env.DATABASE_URL,
  }),
  emailAndPassword: { 
    enabled: true,
    signup: { enabled: true },
    login: { enabled: true }
  },
  plugins: [
    polar(polarPluginConfig),
    magicLink({
        sendMagicLink: async ({ email, url }) => {
          // send email to user
          console.log("Sending magic link via Resend to:", email);
          try {
            const baseUrl = env.BASE_URL;
            await resend.emails.send({
              from: env.RESEND_FROM_EMAIL, // Use environment variable for sender
              to: email,
              subject: `Your Magic Login Link from ${baseUrl}`,
              html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                  <h2 style="color: #333;">Login to Your Account</h2>
                  <p>Hello,</p>
                  <p>Click the button below to securely log in to your account on ${baseUrl}.</p>
                  <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 3px; margin-top: 15px;">
                    Log In
                  </a>
                  <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
                    If you did not request this email, you can safely ignore it. This link will expire shortly.
                  </p>
                </div>
              `
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
