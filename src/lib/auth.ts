// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { SupabaseAdapter } from "@auth/supabase-adapter";

export const authOptions: NextAuthOptions = {
    adapter: SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    }),
    session: { strategy: "jwt" },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: Number(process.env.EMAIL_SERVER_PORT),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM!,
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        // 1) When user signs in, store their database ID in the token
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id; // user.id comes from SupabaseAdapter
            }
            return token;
        },
        // 2) When session is checked by the client, copy token.sub into session.user.id
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
    // callbacks: {
    //     async signIn({ account, profile }) {
    //         console.log("🔹 signIn callback:", { account, profile });
    //         return true;
    //     },
    // },
};
