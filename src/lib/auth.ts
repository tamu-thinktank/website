import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession } from "next-auth";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

import { env } from "@/env";
import { db } from "@/lib/db";
import { getBaseUrl } from "./trpc/shared";

export const redirect_uri = getBaseUrl() + "/api/auth/callback/auth0";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      /**
       * The user's ID in our database.
       */
      id: string;
      providerAccountId: string;
    } & DefaultSession["user"];
    error?: "RefreshAccessTokenError"; // google refresh token error
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    signIn: ({ user, profile }) => {
      if (user.email && env.ALLOWED_EMAILS.includes(user.email)) {
        if (profile) {
          user.name = profile.name;
        }
        return true;
      } else {
        return false;
      }
    },
    jwt: ({ token, user, account }) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (user) {
        token.userId = user.id;
      }
      if (account?.providerAccountId) {
        token.providerAccountId = account.providerAccountId; // to call the provider's API
      }

      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.userId,
          providerAccountId: token.providerAccountId,
        },
      };
    },
  },
  events: {
    createUser: async ({ user }) => {
      // Set default target teams for new users
      console.log(`🆕 [AUTH] Creating new user: ${user.name} (${user.email})`);
      
      // Default teams - can be customized later by the user
      const defaultTeams = ["PROJECT_MANAGER"]; // Start with a general team
      
      try {
        await db.user.update({
          where: { id: user.id },
          data: { targetTeams: defaultTeams }
        });
        console.log(`✅ [AUTH] Set default targetTeams for ${user.name}: [${defaultTeams.join(', ')}]`);
      } catch (error) {
        console.error(`❌ [AUTH] Failed to set default targetTeams for ${user.name}:`, error);
      }
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    Auth0Provider({
      clientId: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      issuer: env.AUTH0_ISSUER,
      authorization: {
        params: {
          // these are required to get IDP refresh token from google
          redirect_uri,
          access_type: "offline",
          connection_scope: "https://www.googleapis.com/auth/calendar",
          approval_prompt: "force", // @see https://community.auth0.com/t/need-help-with-fetching-refresh-token-from-google-social-login/11699/2
        },
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
