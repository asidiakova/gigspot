import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { container } from "@/container";
import { config } from "@/config";

export const authOptions: NextAuthOptions = {
  secret: config.auth.secret,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password) return null;

        const user = await container.authService.validateCredentials(email, password);
        if (!user) return null;

        return {
          id: user.id,
          name: user.nickname,
          email: user.email,
          image: user.avatarUrl,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
