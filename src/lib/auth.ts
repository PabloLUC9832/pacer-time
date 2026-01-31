import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "@auth/core/providers/credentials";
import prisma from "../../lib/prisma";
import {signInSchema} from "@/lib/validations/auth.schema";
import bcrypt from "bcryptjs";

const adapter = PrismaAdapter(prisma);

export const { auth, signIn, signOut, handlers } = NextAuth({
  adapter: adapter,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials)  => {

        console.log('credentials', credentials);

        try {
          const validatedData  = signInSchema.parse(credentials);

          const user = await prisma.user.findUnique({
            where: {
              email: validatedData.email.toLowerCase(),
            },
          });

          if (!user) return null;

          const isPasswordMatch = await bcrypt.compare(validatedData.password, user.password);

          if (!isPasswordMatch) return null;

          return {
            id: user.id,
            email: user.email,
            name: `${user.name} ${user.fatherLastName} ${user.motherLastName ?? ''}`,
            role: user.role,
          };

        } catch (error) {
          console.error("Authorize error: ", error);
          return null;
        }
      },
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  }
});