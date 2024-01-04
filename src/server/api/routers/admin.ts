import { getAvailabilityMap } from "@/lib/utils/getAvailabilityMap";
import { AvailabilityMapSchema } from "@/lib/z.schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getAvailabities } from "@/server/db/queries";
import { z } from "zod";

// TODO: change to protectedProcedure
export const adminRouter = createTRPCRouter({
  getAvailabities: protectedProcedure
    .output(
      z.object({
        officers: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
          }),
        ),
        availabilities: AvailabilityMapSchema,
      }),
    )
    .query(async ({ ctx }) => {
      const officers = await ctx.db.user.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      const dbAvailabilities = await getAvailabities();
      const availabilities = getAvailabilityMap(dbAvailabilities);

      return {
        officers,
        availabilities,
      };
    }),
  updateAvailabilities: protectedProcedure
    .input(
      z.intersection(
        z.object({
          gridTimes: z.array(z.string()),
        }),
        z.union([
          z.object({
            mode: z.literal("add"),
            selectedAt: z.string(),
          }),
          z.object({
            mode: z.literal("remove"),
          }),
        ]),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      const { gridTimes, mode } = input;

      if (mode === "add") {
        for (const gridTime of gridTimes) {
          await ctx.db.timeSection.upsert({
            where: {
              gridTime_officerId: {
                gridTime,
                officerId: ctx.session.user.id,
              },
            },
            update: {
              selectedAt: input.selectedAt,
            },
            create: {
              gridTime,
              officerId: ctx.session.user.id,
              selectedAt: input.selectedAt,
            },
          });
        }
      } else if (mode === "remove") {
        await ctx.db.timeSection.deleteMany({
          where: {
            officerId: ctx.session.user.id,
            gridTime: {
              notIn: gridTimes,
            },
          },
        });
      }

      return true;
    }),
});
