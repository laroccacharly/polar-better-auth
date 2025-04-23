import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

export const env = createEnv({
    server: {
        POLAR_ACCESS_TOKEN: z.string(),
        POLAR_SERVER: z.enum(["sandbox", "production"]),
        POLAR_WEBHOOK_SECRET: z.string().optional(),
        BETTER_AUTH_SECRET: z.string(),
        SUCCESS_URL: z.string(),
        DATABASE_URL: z.string(),
        RESEND_API_KEY: z.string(),
        RESEND_FROM_EMAIL: z.string().email(),
        BASE_URL: z.string(),
    },
    client: {},
    runtimeEnv: {
        POLAR_ACCESS_TOKEN: process.env.POLAR_ACCESS_TOKEN,
        POLAR_SERVER: process.env.POLAR_SERVER,
        POLAR_WEBHOOK_SECRET: process.env.POLAR_WEBHOOK_SECRET,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
        SUCCESS_URL: process.env.SUCCESS_URL,
        DATABASE_URL: process.env.DATABASE_URL,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
        BASE_URL: process.env.BASE_URL,
    },
})