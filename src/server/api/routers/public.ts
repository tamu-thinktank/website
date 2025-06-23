import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import DriveService from "@/server/service/google-drive";
import { z } from "zod";

export const publicRouter = createTRPCRouter({
  deleteResume: publicProcedure
    .input(z.object({ resumeId: z.string() }))
    .mutation(async ({ input }) => {
      await DriveService.deleteFile(input.resumeId);
    }),
});