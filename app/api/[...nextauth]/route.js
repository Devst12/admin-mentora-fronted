import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const allowedEmails = (process.env.ALLOWED_EMAILS || "").split(",");

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        if (allowedEmails.includes(user.email)) {
          return true;
        }
        return false;
      }
      return true;
    },

    async session({ session }) {

      if (allowedEmails.includes(session.user?.email)) {
        session.user.allowed = true;
      } else {
        session.user.allowed = false;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
