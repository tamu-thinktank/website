import { z } from "zod";

/**
 * @see https://auth0.com/docs/secure/tokens/access-tokens/get-management-api-access-tokens-for-production
 */
export const Auth0MgmtAccessTokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  scope: z.string(),
  token_type: z.string(),
});

/**
 * @see https://auth0.com/docs/api/management/v2/users/get-users-by-id
 */
export const Auth0UserIdentitiesSchema = z.object({
  identities: z
    .array(
      z.object({
        provider: z.string(),
        expires_in: z.number(),
        connection: z.string(),
        access_token: z.string(),
        refresh_token: z.string(),
        user_id: z.string(),
        isSocial: z.boolean(),
      }),
    )
    .min(1),
});
