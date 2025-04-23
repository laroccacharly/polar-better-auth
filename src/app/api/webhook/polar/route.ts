import { Webhooks } from "@polar-sh/nextjs";

export const POST = Webhooks({
	webhookSecret: "balcony",
	onPayload: async (payload) => {
		// Handle the payload
	},
});
