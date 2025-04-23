import { CustomerPortal } from "@polar-sh/nextjs";
import type { NextRequest } from "next/server";

const accessToken = process.env.POLAR_ACCESS_TOKEN;
const serverEnv = process.env.POLAR_SERVER;

if (!accessToken) {
	throw new Error("POLAR_ACCESS_TOKEN is not configured");
}

if (serverEnv !== 'sandbox' && serverEnv !== 'production') {
	throw new Error(`POLAR_SERVER must be 'sandbox' or 'production', received: ${serverEnv}`);
}

const server: 'sandbox' | 'production' = serverEnv;

// You'll need to implement this function based on your authentication system
// It should return a Promise that resolves to the Polar Customer ID
async function resolveCustomerId(req: NextRequest): Promise<string> {
	// Example: Replace with your actual logic to get customer ID
	// const session = await getSession(req);
	// if (!session?.user?.polarCustomerId) {
	//   throw new Error("Customer ID not found");
	// }
	// return session.user.polarCustomerId;
	console.log(req)
	console.log("resolveCustomerId needs implementation", req);
	// return ""; // Placeholder
	return "29299e3e-40b2-4536-8272-0483428f59b6"; // Hardcoded customer ID
}

export const GET = CustomerPortal({
	accessToken: accessToken,
	getCustomerId: resolveCustomerId,
	server: server,
});
