// auth.js (in project root)
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Ensure user id is available in session
      if (session.user) {
        session.user.id = user?.id || token?.sub;
      }
      return session;
    },
  },
});