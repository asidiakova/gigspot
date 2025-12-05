import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { container } from "@/container";
import { config } from "@/config";
import { UserAlreadyDeletedError, UserNotFoundError } from "@/domain/errors";

export const authOptions: NextAuthOptions = {
  secret: config.auth.secret,
  session: { strategy: "jwt", maxAge: config.auth.maxAgeSecs },
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Email or nickname", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const identifier = credentials?.identifier;
        const password = credentials?.password;
        if (!identifier || !password) {
          throw new Error("MissingCredentials");
        }

        const user =
          await container.userRepository.findByEmailOrNickname(identifier);

        if (!user) {
          throw new UserNotFoundError();
        }
        if (user.deletedAt) {
          throw new UserAlreadyDeletedError();
        }

        const isValid = await container.passwordHasher.compare(
          password,
          user.passwordHash
        );
        if (!isValid) {
          throw new Error("InvalidPassword");
        }

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
