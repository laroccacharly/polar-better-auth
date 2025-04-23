import { Checkout } from "@polar-sh/nextjs";

const accessToken = process.env.POLAR_ACCESS_TOKEN;
const successUrl = process.env.SUCCESS_URL;
const serverEnv = process.env.POLAR_SERVER;

if (!accessToken) {
	throw new Error("POLAR_ACCESS_TOKEN is not configured");
}

if (!successUrl) {
	throw new Error("SUCCESS_URL is not configured");
}

if (serverEnv !== 'sandbox' && serverEnv !== 'production') {
	throw new Error(`POLAR_SERVER must be 'sandbox' or 'production', received: ${serverEnv}`);
}

const server: 'sandbox' | 'production' = serverEnv;
// need to pass in the product id in query params as an array "products" example c429985c-b08f-45ae-9666-dc62cfbd8883
export const GET = Checkout({
	accessToken: accessToken,
	successUrl: successUrl,
	server: server, // Now correctly typed
});
