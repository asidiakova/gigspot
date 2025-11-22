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
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      if (trigger === "update" && token.id) {
        const freshUser = await container.userRepository.findById(token.id);
        if (freshUser) {
          token.name = freshUser.nickname;
          token.picture = freshUser.avatarUrl;
          token.role = freshUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },
  },
};
