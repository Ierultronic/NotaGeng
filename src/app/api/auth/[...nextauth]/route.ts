import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    // 1) Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // 2) Email “Magic Link” provider
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

  // Optionally, customize session callback to include user.id in the session
  callbacks: {
    async session({ session, token, user }) {
      // `session.user.id` will be available on the client
      if (session.user && token.sub) {
        session.user.name = token.sub;
      }
      return session;
    },
  },

  // You can optionally specify pages for sign in / error
  pages: {
    signIn: "/login", // custom sign-in page
    // signOut: "/auth/signout",
    // error: "/auth/error",
    // newUser: "/register", // if you want to redirect new users here
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
