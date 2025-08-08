import { db } from "@/db/drizzle";
import { schema } from "../db/schema";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema
    }),
    plugins: [
        nextCookies(),
        admin() 
    ]
});