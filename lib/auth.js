
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },

  pages: {
    signIn: "/admin/login",
  },

  providers: [
    Credentials({
      name: "Connexion administrateur",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },

      async authorize(credentials) {
        const email = String(
          credentials?.email || ""
        ).trim().toLowerCase();

        const password = String(
          credentials?.password || ""
        );

        if (!email || !password) {
          return null;
        }

        const admin = await prisma.adminUser.findUnique({
          where: { email },
        });

        if (!admin || admin.role !== "ADMIN") {
          return null;
        }

        const validPassword = await bcrypt.compare(
          password,
          admin.passwordHash
        );

        if (!validPassword) {
          return null;
        }

        return {
          id: admin.id,
          name: admin.name || "Administrateur",
          email: admin.email,
          role: admin.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }

      return session;
    },
  },
});
