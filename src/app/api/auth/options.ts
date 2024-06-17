import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions, AuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import { GoogleProfile } from "next-auth/providers/google";

import { API } from "../api";

export const Options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      profile(profile: GoogleProfile) {
        return {
          ...profile,
          role: profile.role ?? "user",
          id: profile.id.toString(),
          image: profile.avatar_url,
        };
      },
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email...." },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password....",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        try {
          const response = await API.post("/login", {
            email: credentials.email,
            password: credentials.password,
          });

          if (response.data.status === 200) {
            const user = response.data;
            return user;
          }
        } catch (error: any) {
          // if (error.response) {
          //   return {
          //     status: error.response.data.status,
          //     message: error.response.data.message,
          //   };
          // }
          return null; // if password wrong
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      // console.log(token); // return all data & status from api
      return { ...token, ...user };
    },
    async session({
      session,
      token,
      user,
    }: {
      session: any;
      token: any;
      user: any;
    }) {
      session.user = token as any; // return all data & status from api
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(Options);
export { handler as GET, handler as POST };
