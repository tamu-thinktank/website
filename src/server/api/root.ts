import { adminRouter } from "./routers/admin";
import { publicRouter } from "./routers/public";
import { dcmemberRouter } from "./routers/dcmember";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  public: publicRouter,
  admin: adminRouter,
  dcmember: dcmemberRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
