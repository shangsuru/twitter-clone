import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";

function signToken(email: string) {
  const token = jwt.sign(
    { id: email },
    process.env.NEXT_PUBLIC_JWT_SECRET_KEY!,
    { expiresIn: "1d" }
  );
  return token;
}

const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user || !user.email) {
        return false;
      }
      const handle = user.email.split("@")[0];
      await fetch(`${process.env.PUBLIC_API_URL}/users/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          handle: handle,
          username: user.name,
          image: user.image,
        }),
      });
      return true;
    },
    async jwt({ token, user, account }) {
      if (account) {
        const userLoggedIn = signToken(user?.email as string);
        token.loggedUser = userLoggedIn;
      }
      return token;
    },
    async session({ session, token }) {
      session.token = token.loggedUser;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
